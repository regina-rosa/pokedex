"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PokemonCard from "./PokemonCard";
import { loadFavorites, toggleFavorite } from "@/lib/favorites";
import {
  allTypes,
  displayName,
  generationNames,
  generations,
  typeColor,
  type PokemonSummary,
} from "@/lib/pokemon";

type SortKey = "number" | "name" | "power";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "number", label: "Number" },
  { key: "name", label: "Name" },
  { key: "power", label: "Stats" },
];

const PAGE_SIZE = 60;

export default function PokedexBrowser({
  entries,
}: {
  entries: PokemonSummary[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [activeGens, setActiveGens] = useState<number[]>([]);
  const [sort, setSort] = useState<SortKey>("number");
  const [shiny, setShiny] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = entries.filter((entry) => {
      const matchesQuery =
        normalized === "" ||
        entry.name.includes(normalized) ||
        String(entry.id) === normalized.replace(/^#0*/, "");
      const matchesType =
        activeTypes.length === 0 ||
        activeTypes.every((type) => entry.types.includes(type));
      const matchesGen =
        activeGens.length === 0 || activeGens.includes(entry.generation);
      const matchesFavorite = !favoritesOnly || favorites.includes(entry.id);
      return matchesQuery && matchesType && matchesGen && matchesFavorite;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "power") return b.statTotal - a.statTotal;
      return a.id - b.id;
    });
  }, [entries, query, activeTypes, activeGens, sort, favoritesOnly, favorites]);

  // Any change to the filters should start the list from the top again.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, activeTypes, activeGens, sort, favoritesOnly]);

  function handleToggleFavorite(id: number) {
    setFavorites(toggleFavorite(id));
  }

  function surpriseMe() {
    const pool = results.length > 0 ? results : entries;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    router.push(`/pokemon/${pick.id}`);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or number..."
          className="flex-1 rounded-full border border-line bg-surface px-5 py-2.5 text-sm shadow-sm outline-none placeholder:text-muted focus:border-accent"
        />
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1 shadow-sm">
            {SORTS.map((option) => (
              <button
                key={option.key}
                onClick={() => setSort(option.key)}
                className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                  sort === option.key
                    ? "bg-accent text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShiny((s) => !s)}
            className={`rounded-full border px-3 py-2 text-xs font-medium shadow-sm transition-colors ${
              shiny
                ? "border-transparent bg-accent text-white"
                : "border-line bg-surface text-muted hover:text-foreground"
            }`}
          >
            ✨ Shiny
          </button>
          <button
            onClick={() => setFavoritesOnly((f) => !f)}
            className={`rounded-full border px-3 py-2 text-xs font-medium shadow-sm transition-colors ${
              favoritesOnly
                ? "border-transparent bg-accent text-white"
                : "border-line bg-surface text-muted hover:text-foreground"
            }`}
          >
            ♥ Favorites{favorites.length > 0 && ` (${favorites.length})`}
          </button>
          <button
            onClick={surpriseMe}
            className="rounded-full border border-line bg-surface px-3 py-2 text-xs font-medium text-muted shadow-sm transition-colors hover:text-foreground"
          >
            🎲 Surprise me
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {generations.map((gen) => {
          const active = activeGens.includes(gen);
          return (
            <button
              key={gen}
              onClick={() =>
                setActiveGens((prev) =>
                  prev.includes(gen)
                    ? prev.filter((g) => g !== gen)
                    : [...prev, gen]
                )
              }
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? "border-transparent bg-foreground text-white"
                  : "border-line bg-surface text-muted hover:text-foreground"
              }`}
            >
              Gen {gen} · {generationNames[gen]}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {allTypes.map((type) => {
          const active = activeTypes.includes(type);
          return (
            <button
              key={type}
              onClick={() =>
                setActiveTypes((prev) =>
                  prev.includes(type)
                    ? prev.filter((t) => t !== type)
                    : [...prev, type]
                )
              }
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? "border-transparent text-white"
                  : "border-line bg-surface text-muted hover:text-foreground"
              }`}
              style={active ? { backgroundColor: typeColor(type) } : undefined}
            >
              {displayName(type)}
            </button>
          );
        })}
        {(activeTypes.length > 0 || activeGens.length > 0) && (
          <button
            onClick={() => {
              setActiveTypes([]);
              setActiveGens([]);
            }}
            className="rounded-full px-3 py-1 text-xs text-accent underline-offset-2 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="text-xs text-muted">
        {results.length} of {entries.length} Pokémon
      </p>

      {results.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-line bg-surface p-10 text-center text-sm text-muted">
          {favoritesOnly && favorites.length === 0
            ? "No favorites yet — tap the heart on a Pokémon to save it here."
            : "No Pokémon match that search."}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {results.slice(0, visible).map((entry) => (
              <PokemonCard
                key={entry.id}
                entry={entry}
                shiny={shiny}
                favorite={favorites.includes(entry.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
          {visible < results.length && (
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="mx-auto rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-md transition-opacity hover:opacity-90"
            >
              Load more ({results.length - visible} left)
            </button>
          )}
        </>
      )}
    </div>
  );
}
