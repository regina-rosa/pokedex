import Image from "next/image";
import Link from "next/link";
import TypeBadge from "./TypeBadge";
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
  const image = shiny && entry.shinySprite ? entry.shinySprite : entry.sprite;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-50"
        style={{ backgroundColor: typeColor(entry.types[0]) }}
      />

      <div className="relative flex items-start justify-between">
        <span className="font-mono text-[11px] text-muted">
          {pokedexNumber(entry.id)}
        </span>
        <button
          onClick={() => onToggleFavorite(entry.id)}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          className="transition-transform hover:scale-125"
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

      <Link href={`/pokemon/${entry.id}`} className="block">
        <div className="relative mx-auto my-1 h-24 w-24">
          {image && (
            <Image
              src={image}
              alt={displayName(entry.name)}
              fill
              sizes="96px"
              className="object-contain transition-transform duration-200 group-hover:scale-110"
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
        </div>
      </Link>
    </div>
  );
}
