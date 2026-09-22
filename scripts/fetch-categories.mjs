// Builds data/spongebob.json, data/disney.json and data/ghibli.json.
// Run with: node scripts/fetch-categories.mjs
import { writeFile } from "node:fs/promises";

const DISNEY_LIMIT = 800;

async function getJson(url, tries = 3) {
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return await res.json();
    } catch (err) {
      if (attempt === tries) throw new Error(`${url}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
}

function stripHtml(value) {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function buildSpongebob() {
  const [show, episodes, cast] = await Promise.all([
    getJson("https://api.tvmaze.com/shows/713"),
    getJson("https://api.tvmaze.com/shows/713/episodes"),
    getJson("https://api.tvmaze.com/shows/713/cast"),
  ]);

  return {
    title: show.name,
    premiered: show.premiered,
    status: show.status,
    genres: show.genres,
    rating: show.rating?.average ?? null,
    network: show.network?.name ?? show.webChannel?.name ?? null,
    image: show.image?.medium ?? null,
    characters: cast.map((entry) => ({
      name: entry.character.name,
      actor: entry.person.name,
      image: entry.character.image?.medium ?? null,
    })),
    episodes: episodes.map((episode) => ({
      id: episode.id,
      season: episode.season,
      number: episode.number,
      name: episode.name,
      airdate: episode.airdate || null,
      runtime: episode.runtime ?? null,
      rating: episode.rating?.average ?? null,
      summary: stripHtml(episode.summary),
      image: episode.image?.medium ?? null,
    })),
  };
}

async function buildDisney() {
  const kept = [];
  let page = 1;

  while (kept.length < DISNEY_LIMIT) {
    const body = await getJson(
      `https://api.disneyapi.dev/character?page=${page}&pageSize=500`
    );
    const batch = Array.isArray(body.data) ? body.data : [body.data];
    if (batch.length === 0) break;

    for (const character of batch) {
      // Nameless entries and those with no film credit are mostly noise.
      if (!character?.imageUrl || !character.films?.length) continue;
      kept.push({
        id: character._id,
        name: character.name,
        image: character.imageUrl,
        films: character.films.slice(0, 6),
        tvShows: (character.tvShows ?? []).slice(0, 4),
        allies: (character.allies ?? []).slice(0, 5),
        enemies: (character.enemies ?? []).slice(0, 5),
      });
      if (kept.length >= DISNEY_LIMIT) break;
    }

    if (!body.info?.nextPage) break;
    page += 1;
    console.log(`disney: ${kept.length} kept (page ${page})`);
  }

  return kept;
}

async function buildGhibli() {
  const [films, people] = await Promise.all([
    getJson("https://ghibliapi.vercel.app/films"),
    getJson("https://ghibliapi.vercel.app/people").catch(() => []),
  ]);

  const peopleByFilm = new Map();
  for (const person of people) {
    for (const filmUrl of person.films ?? []) {
      const id = filmUrl.split("/").pop();
      if (!peopleByFilm.has(id)) peopleByFilm.set(id, []);
      peopleByFilm.get(id).push({
        name: person.name,
        gender: person.gender,
        age: person.age,
      });
    }
  }

  return films
    .map((film) => ({
      id: film.id,
      title: film.title,
      originalTitle: film.original_title,
      romanised: film.original_title_romanised,
      description: film.description,
      director: film.director,
      producer: film.producer,
      releaseDate: film.release_date,
      runningTime: film.running_time,
      score: film.rt_score,
      image: film.image,
      banner: film.movie_banner,
      characters: (peopleByFilm.get(film.id) ?? []).slice(0, 12),
    }))
    .sort((a, b) => Number(a.releaseDate) - Number(b.releaseDate));
}

async function main() {
  const spongebob = await buildSpongebob();
  await writeFile(
    new URL("../data/spongebob.json", import.meta.url),
    JSON.stringify(spongebob)
  );
  console.log(
    `spongebob: ${spongebob.episodes.length} episodes, ${spongebob.characters.length} characters`
  );

  const ghibli = await buildGhibli();
  await writeFile(
    new URL("../data/ghibli.json", import.meta.url),
    JSON.stringify(ghibli)
  );
  console.log(`ghibli: ${ghibli.length} films`);

  const disney = await buildDisney();
  await writeFile(
    new URL("../data/disney.json", import.meta.url),
    JSON.stringify(disney)
  );
  console.log(`disney: ${disney.length} characters`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
