import Image from "next/image";
import Link from "next/link";
import TypeBadge from "./TypeBadge";
import { bestPartners, recommendedNature, role } from "@/lib/strategy";
import { displayName, getPokemon, typeColor, type Pokemon } from "@/lib/pokemon";

export default function StrategyPanel({ entry }: { entry: Pokemon }) {
  const nature = recommendedNature(entry);
  const entryRole = role(entry);
  const partners = bestPartners(entry);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="font-semibold">Recommended nature</h2>
        <div className="mt-4 flex items-center gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-center text-sm font-semibold text-white"
            style={{ backgroundColor: typeColor(entry.types[0]) }}
          >
            {nature.name}
          </div>
          <div className="text-sm">
            <p>
              <span className="text-green-600">▲ {nature.raises}</span>
              {"  "}
              <span className="text-muted">▼ {nature.lowers}</span>
            </p>
            <p className="mt-1 text-xs text-muted">Plays as a {entryRole.toLowerCase()}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">{nature.reason}</p>
      </section>

      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="font-semibold">Best duo partners</h2>
        <p className="mt-1 text-xs text-muted">
          Teammates that resist what {displayName(entry.name)} fears most.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {partners.length === 0 && (
            <p className="text-sm text-muted">
              It has no exploitable weaknesses to cover.
            </p>
          )}
          {partners.map((partner) => {
            const partnerEntry = getPokemon(partner.id);
            if (!partnerEntry) return null;
            return (
              <Link
                key={partner.id}
                href={`/pokemon/${partner.id}`}
                className="flex items-center gap-3 rounded-2xl border border-line p-2.5 transition-colors hover:bg-surface-soft"
              >
                {partnerEntry.sprite && (
                  <div className="relative h-12 w-12 shrink-0">
                    <Image
                      src={partnerEntry.sprite}
                      alt={displayName(partnerEntry.name)}
                      fill
                      sizes="48px"
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {displayName(partnerEntry.name)}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    <span className="text-[11px] text-muted">covers</span>
                    {partner.covered.map((type) => (
                      <TypeBadge key={type} type={type} />
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
