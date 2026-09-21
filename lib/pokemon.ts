import data from "@/data/pokemon.json";
import typeChart from "@/data/types.json";

export type Stat = { name: string; value: number };

export type Pokemon = {
  id: number;
  name: string;
  generation: number;
  genus: string;
  description: string;
  types: string[];
  abilities: { name: string; hidden: boolean }[];
  height: number;
  weight: number;
  baseExperience: number | null;
  stats: Stat[];
  sprite: string | null;
  shinySprite: string | null;
  artwork: string | null;
  shinyArtwork: string | null;
  cry: string | null;
  isLegendary: boolean;
  isMythical: boolean;
  isBaby: boolean;
  captureRate: number;
  evolutionChain: { id: number; name: string }[];
};

/** Trimmed shape sent to the browser so the grid stays light. */
export type PokemonSummary = {
  id: number;
  name: string;
  generation: number;
  types: string[];
  sprite: string | null;
  shinySprite: string | null;
  statTotal: number;
  isLegendary: boolean;
  isMythical: boolean;
};

type TypeRelations = {
  weakTo: string[];
  resists: string[];
  immuneTo: string[];
  strongAgainst: string[];
};

export const pokemon = data as Pokemon[];
const chart = typeChart as Record<string, TypeRelations>;

export function getPokemon(id: number): Pokemon | undefined {
  return pokemon.find((p) => p.id === id);
}

export function totalStats(stats: Stat[]): number {
  return stats.reduce((sum, s) => sum + s.value, 0);
}

export const summaries: PokemonSummary[] = pokemon.map((p) => ({
  id: p.id,
  name: p.name,
  generation: p.generation,
  types: p.types,
  sprite: p.sprite,
  shinySprite: p.shinySprite,
  statTotal: totalStats(p.stats),
  isLegendary: p.isLegendary,
  isMythical: p.isMythical,
}));

export const allTypes = Object.keys(chart).sort();

export const generations = Array.from(
  new Set(pokemon.map((p) => p.generation))
).sort((a, b) => a - b);

export const generationNames: Record<number, string> = {
  1: "Kanto",
  2: "Johto",
  3: "Hoenn",
  4: "Sinnoh",
  5: "Unova",
  6: "Kalos",
  7: "Alola",
  8: "Galar",
  9: "Paldea",
};

export const typeColors: Record<string, string> = {
  normal: "#9fa19f",
  fire: "#e8622b",
  water: "#2e80ef",
  electric: "#e8b60b",
  grass: "#42bf5c",
  ice: "#41cfd4",
  fighting: "#e0316a",
  poison: "#a04ad1",
  ground: "#d87a3c",
  flying: "#8fa4e8",
  psychic: "#f9457f",
  bug: "#93c22c",
  rock: "#c7b58a",
  ghost: "#6c5b9e",
  dragon: "#4f64d4",
  dark: "#5a5366",
  steel: "#6fa5bd",
  fairy: "#ec8fe6",
};

export function typeColor(type: string): string {
  return typeColors[type] ?? "#9fa19f";
}

export function displayName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function pokedexNumber(id: number): string {
  return `#${String(id).padStart(4, "0")}`;
}

export const statLabels: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

/** How much damage each attacking type does to a Pokémon with these types. */
export function typeMatchups(
  defendingTypes: string[]
): { type: string; multiplier: number }[] {
  return allTypes
    .map((attacking) => {
      let multiplier = 1;
      for (const defending of defendingTypes) {
        const relations = chart[defending];
        if (!relations) continue;
        if (relations.immuneTo.includes(attacking)) multiplier *= 0;
        else if (relations.weakTo.includes(attacking)) multiplier *= 2;
        else if (relations.resists.includes(attacking)) multiplier *= 0.5;
      }
      return { type: attacking, multiplier };
    })
    .filter((m) => m.multiplier !== 1)
    .sort((a, b) => b.multiplier - a.multiplier);
}
