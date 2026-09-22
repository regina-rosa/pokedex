"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { SpongebobEpisode } from "@/lib/categories";

const PAGE_SIZE = 40;

export default function SpongebobBrowser({
  episodes,
}: {
  episodes: SpongebobEpisode[];
}) {
  const [query, setQuery] = useState("");
  const [season, setSeason] = useState<number | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const seasons = useMemo(
    () => [...new Set(episodes.map((e) => e.season))].sort((a, b) => a - b),
    [episodes]
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return episodes.filter((episode) => {
      const matchesQuery =
        needle === "" || episode.name.toLowerCase().includes(needle);
      const matchesSeason = season === null || episode.season === season;
      return matchesQuery && matchesSeason;
    });
  }, [episodes, query, season]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, season]);

  return (
    <div className="flex flex-col gap-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search episode titles..."
        className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm shadow-sm outline-none placeholder:text-muted focus:border-[var(--cat-accent)]"
      />

      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setSeason(null)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            season === null
              ? "border-transparent bg-[var(--cat-accent)] text-white"
              : "border-line bg-surface text-muted hover:text-foreground"
          }`}
        >
          All seasons
        </button>
        {seasons.map((s) => (
          <button
            key={s}
            onClick={() => setSeason(s)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              season === s
                ? "border-transparent bg-[var(--cat-accent)] text-white"
                : "border-line bg-surface text-muted hover:text-foreground"
            }`}
          >
            S{s}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted">
        {results.length} of {episodes.length} episodes
      </p>

      {results.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-line bg-surface p-10 text-center text-sm text-muted">
          No episodes match that search.
        </p>
      ) : (
        <>
          <ul className="grid gap-3 sm:grid-cols-2">
            {results.slice(0, visible).map((episode) => (
              <li
                key={episode.id}
                className="flex gap-3 rounded-2xl border border-line bg-surface p-3 shadow-sm"
              >
                {episode.image && (
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-soft">
                    <Image
                      src={episode.image}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-muted">
                    S{episode.season} · E{episode.number}
                    {episode.airdate && ` · ${episode.airdate}`}
                    {episode.rating && ` · ★ ${episode.rating}`}
                  </p>
                  <p className="text-sm font-medium">{episode.name}</p>
                  {episode.summary && (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                      {episode.summary}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>

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
