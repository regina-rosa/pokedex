import Image from "next/image";
import Link from "next/link";
import TypeBadge from "./TypeBadge";
import { displayName, getPokemon, type Pokemon } from "@/lib/pokemon";

export default function EvolutionLine({ entry }: { entry: Pokemon }) {
  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Evolution line</h2>
        {entry.evolutionChain.length <= 1 ? (
          <p className="text-sm text-muted">
            {displayName(entry.name)} does not evolve — it is one of a kind.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {entry.evolutionChain.map((stage, index) => {
              const stageEntry = getPokemon(stage.id);
              return (
                <div key={stage.id} className="flex items-center gap-2">
                  {index > 0 && (
                    <span aria-hidden className="text-accent">
                      →
                    </span>
                  )}
                  <Link
                    href={`/pokemon/${stage.id}`}
                    className={`flex flex-col items-center rounded-2xl border px-4 py-3 transition-all hover:-translate-y-0.5 ${
                      stage.id === entry.id
                        ? "border-accent bg-accent-soft"
                        : "border-line hover:bg-surface-soft"
                    }`}
                  >
                    {stageEntry?.sprite && (
                      <div className="relative h-16 w-16">
                        <Image
                          src={stageEntry.sprite}
                          alt={displayName(stage.name)}
                          fill
                          sizes="64px"
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    )}
                    <span className="text-xs">{displayName(stage.name)}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Breeding</h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">Egg groups</span>
          {entry.eggGroups.length === 0 ? (
            <span className="text-sm text-muted">Unknown</span>
          ) : (
            entry.eggGroups.map((group) => (
              <span
                key={group}
                className="rounded-full border border-line bg-surface-soft px-3 py-1 text-xs"
              >
                {displayName(group)}
              </span>
            ))
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">Types</span>
          {entry.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </section>
    </div>
  );
}
