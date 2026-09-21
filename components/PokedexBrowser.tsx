"use client";

import { useMemo, useState } from "react";
import PokemonCard from "./PokemonCard";
import {
  allTypes,
  displayName,
  totalStats,
  typeColor,
  type Pokemon,
} from "@/lib/pokemon";

type SortKey = "number" | "name" | "power";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "number", label: "Number" },
  { key: "name", label: "Name" },
  { key: "power", label: "Base stats" },
];

export default function PokedexBrowser({ entries }: { entries: Pokemon[] }) {
  const [query, setQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("number");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = entries.filter((entry) => {
      const matchesQuery =
        normalized === "" ||
        entry.name.includes(normalized) ||
        String(entry.id) === normalized.replace(/^#/, "");
      const matchesType =
        activeTypes.length === 0 ||
        activeTypes.every((type) => entry.types.includes(type));
      return matchesQuery && matchesType;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "power") return totalStats(b.stats) - totalStats(a.stats);
      return a.id - b.id;
    });
  }, [entries, query, activeTypes, sort]);

  function toggleType(type: string) {
    setActiveTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or number..."
          className="flex-1 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent/70"
        />
        <div className="flex items-center gap-1 rounded-xl border border-line bg-surface p-1">
          {SORTS.map((option) => (
            <button
              key={option.key}
              onClick={() => setSort(option.key)}
              className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                sort === option.key
                  ? "bg-accent text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {allTypes.map((type) => {
          const active = activeTypes.includes(type);
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                active
                  ? "border-transparent text-white"
                  : "border-line text-muted hover:text-foreground"
              }`}
              style={active ? { backgroundColor: typeColor(type) } : undefined}
            >
              {displayName(type)}
            </button>
          );
        })}
        {activeTypes.length > 0 && (
          <button
            onClick={() => setActiveTypes([])}
            className="rounded-full px-3 py-1 text-xs text-muted underline-offset-2 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <p className="text-xs text-muted">
        {results.length} of {entries.length} Pokémon
      </p>

      {results.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">
          No Pokémon match that search.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {results.map((entry) => (
            <PokemonCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
