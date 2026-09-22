"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { DisneyCharacter } from "@/lib/categories";

const PAGE_SIZE = 48;

export default function DisneyBrowser({
  characters,
}: {
  characters: DisneyCharacter[];
}) {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle === "") return characters;
    return characters.filter(
      (character) =>
        character.name.toLowerCase().includes(needle) ||
        character.films.some((film) => film.toLowerCase().includes(needle))
    );
  }, [characters, query]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query]);

  return (
    <div className="flex flex-col gap-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by character or film..."
        className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm shadow-sm outline-none placeholder:text-muted focus:border-[var(--cat-accent)]"
      />

      <p className="text-xs text-muted">
        {results.length} of {characters.length} characters
      </p>

      {results.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-line bg-surface p-10 text-center text-sm text-muted">
          Nobody matches that search.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {results.slice(0, visible).map((character) => (
              <article
                key={character.id}
                className="group overflow-hidden rounded-3xl border border-line bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-square bg-surface-soft">
                  <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    sizes="(max-width: 640px) 45vw, 240px"
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold">{character.name}</h3>
                  {character.films.length > 0 && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted">
                      {character.films.join(", ")}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          {visible < results.length && (
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="mx-auto rounded-full bg-[var(--cat-accent)] px-6 py-2.5 text-sm font-medium text-white shadow-md transition-opacity hover:opacity-90"
            >
              Load more ({results.length - visible} left)
            </button>
          )}
        </>
      )}
    </div>
  );
}
