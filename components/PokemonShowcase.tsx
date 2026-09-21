"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import TypeBadge from "./TypeBadge";
import { loadFavorites, toggleFavorite } from "@/lib/favorites";
import {
  displayName,
  pokedexNumber,
  typeColor,
  type Pokemon,
} from "@/lib/pokemon";

export default function PokemonShowcase({ entry }: { entry: Pokemon }) {
  const [shiny, setShiny] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setFavorite(loadFavorites().includes(entry.id));
  }, [entry.id]);

  const accent = typeColor(entry.types[0]);
  const image = shiny && entry.shinyArtwork ? entry.shinyArtwork : entry.artwork;

  function playCry() {
    if (!entry.cry) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(entry.cry);
      audioRef.current.volume = 0.4;
    }
    audioRef.current.currentTime = 0;
    void audioRef.current.play();
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-line p-6 shadow-sm"
      style={{
        background: `radial-gradient(circle at 50% 20%, ${accent}33, transparent 65%), var(--color-surface)`,
      }}
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-sm text-muted">
          {pokedexNumber(entry.id)}
        </span>
        <button
          onClick={() => setFavorite(toggleFavorite(entry.id).includes(entry.id))}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          className="transition-transform hover:scale-125"
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-6 w-6 ${
              favorite ? "fill-accent stroke-accent" : "fill-none stroke-muted"
            }`}
            strokeWidth="2"
          >
            <path d="M12 20.5 4.2 13a4.8 4.8 0 0 1 6.8-6.8l1 1 1-1A4.8 4.8 0 1 1 19.8 13z" />
          </svg>
        </button>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-xs">
        {image && (
          <Image
            src={image}
            alt={displayName(entry.name)}
            fill
            sizes="(max-width: 1024px) 80vw, 320px"
            className="object-contain drop-shadow-xl"
            priority
            unoptimized
          />
        )}
      </div>

      <h1 className="mt-2 text-center text-3xl font-semibold tracking-tight">
        {displayName(entry.name)}
      </h1>
      <p className="mt-0.5 text-center text-sm text-muted">{entry.genus}</p>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {entry.types.map((type) => (
          <TypeBadge key={type} type={type} size="md" />
        ))}
        {entry.isLegendary && (
          <span className="rounded-full bg-amber-400 px-3 py-1 text-sm font-medium text-amber-950">
            Legendary
          </span>
        )}
        {entry.isMythical && (
          <span className="rounded-full bg-violet-400 px-3 py-1 text-sm font-medium text-violet-950">
            Mythical
          </span>
        )}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {entry.shinyArtwork && (
          <button
            onClick={() => setShiny((s) => !s)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              shiny
                ? "border-transparent bg-accent text-white"
                : "border-line bg-surface text-muted hover:text-foreground"
            }`}
          >
            ✨ {shiny ? "Shiny" : "Show shiny"}
          </button>
        )}
        {entry.cry && (
          <button
            onClick={playCry}
            className="rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
          >
            🔊 Play cry
          </button>
        )}
      </div>
    </div>
  );
}
