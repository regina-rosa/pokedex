"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import TypeBadge from "./TypeBadge";
import { playSound } from "@/lib/sound";
import {
  displayName,
  pokedexNumber,
  typeColor,
  type PokemonSummary,
} from "@/lib/pokemon";

export default function PokemonCard({
  entry,
  shiny,
  favorite,
  onToggleFavorite,
}: {
  entry: PokemonSummary;
  shiny: boolean;
  favorite: boolean;
  onToggleFavorite: (id: number) => void;
}) {
  const [popping, setPopping] = useState(false);
  const image = shiny && entry.shinySprite ? entry.shinySprite : entry.sprite;

  function handleFavorite() {
    onToggleFavorite(entry.id);
    playSound("favorite");
    setPopping(true);
  }

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-50"
        style={{ backgroundColor: typeColor(entry.types[0]) }}
      />
      {/* Faint Poké Ball watermark in the corner. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full border-[6px] border-line opacity-40"
      />
      {shiny && (
        <span
          aria-hidden
          className="sparkle pointer-events-none absolute left-3 top-8 text-sm"
        >
          ✨
        </span>
      )}

      <div className="relative flex items-start justify-between">
        <span className="font-mono text-[11px] text-muted">
          {pokedexNumber(entry.id)}
        </span>
        <button
          onClick={handleFavorite}
          onAnimationEnd={() => setPopping(false)}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          className={`transition-transform hover:scale-125 ${popping ? "animate-pop" : ""}`}
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-4 w-4 ${
              favorite
                ? "fill-accent stroke-accent"
                : "fill-none stroke-muted group-hover:stroke-accent"
            }`}
            strokeWidth="2"
          >
            <path d="M12 20.5 4.2 13a4.8 4.8 0 0 1 6.8-6.8l1 1 1-1A4.8 4.8 0 1 1 19.8 13z" />
          </svg>
        </button>
      </div>

      <Link
        href={`/pokemon/${entry.id}`}
        onClick={() => playSound("pick")}
        className="block"
      >
        <div className="relative mx-auto my-1 h-24 w-24">
          {image && (
            <Image
              src={image}
              alt={displayName(entry.name)}
              fill
              sizes="96px"
              className="object-contain transition-transform duration-200 group-hover:animate-bob"
              unoptimized
            />
          )}
        </div>
        <p className="relative text-center text-sm font-semibold">
          {displayName(entry.name)}
        </p>
        <div className="relative mt-2 flex flex-wrap justify-center gap-1">
          {entry.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
          {(entry.isLegendary || entry.isMythical) && (
            <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-medium text-amber-950">
              {entry.isMythical ? "✦ Mythical" : "★ Legendary"}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
