// Builds data/pokemon.json from PokeAPI. Run with: node scripts/fetch-pokemon.mjs
import { writeFile } from "node:fs/promises";

const API = "https://pokeapi.co/api/v2";
const COUNT = 151;

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

function englishFlavorText(species) {
  const entry = species.flavor_text_entries.find(
    (e) => e.language.name === "en"
  );
  return entry ? entry.flavor_text.replace(/[\n\f]/g, " ").trim() : "";
}

function englishGenus(species) {
  const entry = species.genera.find((g) => g.language.name === "en");
  return entry ? entry.genus : "";
}

function idFromSpeciesUrl(url) {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

function flattenEvolutionChain(node, acc = []) {
  acc.push({
    id: idFromSpeciesUrl(node.species.url),
    name: node.species.name,
  });
  for (const next of node.evolves_to) flattenEvolutionChain(next, acc);
  return acc;
}

async function buildEntry(id) {
  const [pokemon, species] = await Promise.all([
    getJson(`${API}/pokemon/${id}`),
    getJson(`${API}/pokemon-species/${id}`),
  ]);

  const chain = await getJson(species.evolution_chain.url);

  return {
    id: pokemon.id,
    name: pokemon.name,
    genus: englishGenus(species),
    description: englishFlavorText(species),
    types: pokemon.types.map((t) => t.type.name),
    abilities: pokemon.abilities.map((a) => ({
      name: a.ability.name,
      hidden: a.is_hidden,
    })),
    height: pokemon.height, // decimetres
    weight: pokemon.weight, // hectograms
    baseExperience: pokemon.base_experience,
    stats: pokemon.stats.map((s) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
    sprite: pokemon.sprites.front_default,
    artwork: pokemon.sprites.other["official-artwork"].front_default,
    evolutionChain: flattenEvolutionChain(chain.chain),
  };
}

async function main() {
  const entries = [];
  // Small batches keep us well inside PokeAPI's fair-use limits.
  for (let start = 1; start <= COUNT; start += 10) {
    const ids = [];
    for (let id = start; id < start + 10 && id <= COUNT; id++) ids.push(id);
    const batch = await Promise.all(ids.map(buildEntry));
    entries.push(...batch);
    console.log(`fetched ${entries.length}/${COUNT}`);
  }

  await writeFile(
    new URL("../data/pokemon.json", import.meta.url),
    JSON.stringify(entries, null, 2)
  );
  console.log(`wrote ${entries.length} entries to data/pokemon.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
