// Builds data/pokemon.json and data/types.json from PokeAPI.
// Run with: node scripts/fetch-pokemon.mjs
import { writeFile } from "node:fs/promises";

const API = "https://pokeapi.co/api/v2";
const COUNT = 1025; // every species through generation IX
const BATCH = 15;

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

// Family members share one evolution chain, so fetch each chain only once.
const chainCache = new Map();
async function getChain(url) {
  if (!chainCache.has(url)) chainCache.set(url, getJson(url));
  return chainCache.get(url);
}

function englishEntry(entries, key) {
  const entry = entries.find((e) => e.language.name === "en");
  return entry ? entry[key].replace(/[\n\f]/g, " ").trim() : "";
}

function idFromUrl(url) {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

function flattenEvolutionChain(node, acc = []) {
  acc.push({ id: idFromUrl(node.species.url), name: node.species.name });
  for (const next of node.evolves_to) flattenEvolutionChain(next, acc);
  return acc;
}

function generationNumber(name) {
  const romans = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"];
  return romans.indexOf(name.replace("generation-", "")) + 1;
}

async function buildEntry(id) {
  const [pokemon, species] = await Promise.all([
    getJson(`${API}/pokemon/${id}`),
    getJson(`${API}/pokemon-species/${id}`),
  ]);

  const chain = await getChain(species.evolution_chain.url);

  return {
    id: pokemon.id,
    name: pokemon.name,
    generation: generationNumber(species.generation.name),
    genus: englishEntry(species.genera, "genus"),
    description: englishEntry(species.flavor_text_entries, "flavor_text"),
    types: pokemon.types.map((t) => t.type.name),
    abilities: pokemon.abilities.map((a) => ({
      name: a.ability.name,
      hidden: a.is_hidden,
    })),
    height: pokemon.height, // decimetres
    weight: pokemon.weight, // hectograms
    baseExperience: pokemon.base_experience,
    stats: pokemon.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    sprite: pokemon.sprites.front_default,
    shinySprite: pokemon.sprites.front_shiny,
    artwork: pokemon.sprites.other["official-artwork"].front_default,
    shinyArtwork: pokemon.sprites.other["official-artwork"].front_shiny,
    cry: pokemon.cries?.latest ?? null,
    isLegendary: species.is_legendary,
    isMythical: species.is_mythical,
    isBaby: species.is_baby,
    captureRate: species.capture_rate,
    evolutionChain: flattenEvolutionChain(chain.chain),
  };
}

async function buildTypeChart() {
  const list = await getJson(`${API}/type?limit=25`);
  const real = list.results.filter(
    (t) => !["unknown", "shadow", "stellar"].includes(t.name)
  );
  const details = await Promise.all(real.map((t) => getJson(t.url)));

  const chart = {};
  for (const type of details) {
    const relations = type.damage_relations;
    chart[type.name] = {
      weakTo: relations.double_damage_from.map((t) => t.name),
      resists: relations.half_damage_from.map((t) => t.name),
      immuneTo: relations.no_damage_from.map((t) => t.name),
      strongAgainst: relations.double_damage_to.map((t) => t.name),
    };
  }
  return chart;
}

async function main() {
  const entries = [];
  for (let start = 1; start <= COUNT; start += BATCH) {
    const ids = [];
    for (let id = start; id < start + BATCH && id <= COUNT; id++) ids.push(id);
    entries.push(...(await Promise.all(ids.map(buildEntry))));
    if (entries.length % 150 < BATCH) {
      console.log(`fetched ${entries.length}/${COUNT}`);
    }
  }

  await writeFile(
    new URL("../data/pokemon.json", import.meta.url),
    JSON.stringify(entries)
  );
  console.log(`wrote ${entries.length} entries to data/pokemon.json`);

  const chart = await buildTypeChart();
  await writeFile(
    new URL("../data/types.json", import.meta.url),
    JSON.stringify(chart, null, 2)
  );
  console.log(`wrote ${Object.keys(chart).length} types to data/types.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
