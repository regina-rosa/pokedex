import Image from "next/image";
import Link from "next/link";
import TypeBadge from "./TypeBadge";
import { displayName, pokedexNumber, typeColor, type Pokemon } from "@/lib/pokemon";

export default function PokemonCard({ entry }: { entry: Pokemon }) {
  return (
    <Link
      href={`/pokemon/${entry.id}`}
      className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-4 transition-all hover:-translate-y-1 hover:border-transparent"
      style={{ ["--type" as string]: typeColor(entry.types[0]) }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-25 blur-2xl transition-opacity group-hover:opacity-60"
        style={{ backgroundColor: typeColor(entry.types[0]) }}
      />
      <div className="relative flex items-start justify-between">
        <span className="font-mono text-xs text-muted">
          {pokedexNumber(entry.id)}
        </span>
      </div>
      <div className="relative mx-auto my-1 h-24 w-24">
        <Image
          src={entry.sprite}
          alt={displayName(entry.name)}
          fill
          sizes="96px"
          className="object-contain transition-transform duration-200 group-hover:scale-110"
          unoptimized
        />
      </div>
      <p className="relative text-center font-semibold">
        {displayName(entry.name)}
      </p>
      <div className="relative mt-2 flex flex-wrap justify-center gap-1">
        {entry.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>
    </Link>
  );
}
