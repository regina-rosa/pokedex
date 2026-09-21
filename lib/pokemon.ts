import data from "@/data/pokemon.json";

export type Stat = { name: string; value: number };

export type Pokemon = {
  id: number;
  name: string;
  genus: string;
  description: string;
  types: string[];
  abilities: { name: string; hidden: boolean }[];
  height: number;
  weight: number;
  baseExperience: number;
  stats: Stat[];
  sprite: string;
  artwork: string;
  evolutionChain: { id: number; name: string }[];
};

export const pokemon = data as Pokemon[];

export function getPokemon(id: number): Pokemon | undefined {
  return pokemon.find((p) => p.id === id);
}

export const allTypes = Array.from(
  new Set(pokemon.flatMap((p) => p.types))
).sort();

export const typeColors: Record<string, string> = {
  normal: "#9fa19f",
  fire: "#e8622b",
  water: "#2e80ef",
  electric: "#f2c62b",
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
  return `#${String(id).padStart(3, "0")}`;
}

export const statLabels: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

export function totalStats(stats: Stat[]): number {
  return stats.reduce((sum, s) => sum + s.value, 0);
}
