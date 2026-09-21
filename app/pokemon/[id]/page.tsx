import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import StatBars from "@/components/StatBars";
import TypeBadge from "@/components/TypeBadge";
import {
  displayName,
  getPokemon,
  pokedexNumber,
  pokemon,
  typeColor,
} from "@/lib/pokemon";

export function generateStaticParams() {
  return pokemon.map((entry) => ({ id: String(entry.id) }));
}

export async function generateMetadata({ params }: PageProps<"/pokemon/[id]">) {
  const { id } = await params;
  const entry = getPokemon(Number(id));
  if (!entry) return { title: "Not found" };
  return {
    title: `${displayName(entry.name)} — Kanto Pokédex`,
    description: entry.description,
  };
}

export default async function PokemonPage({
  params,
}: PageProps<"/pokemon/[id]">) {
  const { id } = await params;
  const entry = getPokemon(Number(id));
  if (!entry) notFound();

  const accent = typeColor(entry.types[0]);
  const previous = getPokemon(entry.id - 1);
  const next = getPokemon(entry.id + 1);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-sm">
        <Link href="/" className="text-muted transition-colors hover:text-foreground">
          ← All Pokémon
        </Link>
        <div className="flex gap-4">
          {previous && (
            <Link
              href={`/pokemon/${previous.id}`}
              className="text-muted transition-colors hover:text-foreground"
            >
              ← {displayName(previous.name)}
            </Link>
          )}
          {next && (
            <Link
              href={`/pokemon/${next.id}`}
              className="text-muted transition-colors hover:text-foreground"
            >
              {displayName(next.name)} →
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <div
          className="relative overflow-hidden rounded-3xl border border-line p-8"
          style={{
            background: `radial-gradient(circle at 50% 25%, ${accent}40, transparent 65%), var(--color-surface)`,
          }}
        >
          <span className="font-mono text-sm text-muted">
            {pokedexNumber(entry.id)}
          </span>
          <div className="relative mx-auto aspect-square w-full max-w-xs">
            <Image
              src={entry.artwork}
              alt={displayName(entry.name)}
              fill
              sizes="(max-width: 1024px) 80vw, 320px"
              className="object-contain drop-shadow-2xl"
              priority
              unoptimized
            />
          </div>
          <h1 className="mt-2 text-center text-3xl font-semibold tracking-tight">
            {displayName(entry.name)}
          </h1>
          <p className="mt-0.5 text-center text-sm text-muted">{entry.genus}</p>
          <div className="mt-3 flex justify-center gap-2">
            {entry.types.map((type) => (
              <TypeBadge key={type} type={type} size="md" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <section className="rounded-3xl border border-line bg-surface p-6">
            <p className="text-sm leading-relaxed text-muted">
              {entry.description}
            </p>
            <dl className="mt-5 grid grid-cols-3 gap-4 text-center">
              <div>
                <dt className="text-xs text-muted">Height</dt>
                <dd className="mt-0.5 font-semibold">
                  {(entry.height / 10).toFixed(1)} m
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Weight</dt>
                <dd className="mt-0.5 font-semibold">
                  {(entry.weight / 10).toFixed(1)} kg
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Base exp</dt>
                <dd className="mt-0.5 font-semibold">{entry.baseExperience}</dd>
              </div>
            </dl>
            <div className="mt-5">
              <p className="text-xs text-muted">Abilities</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {entry.abilities.map((ability) => (
                  <span
                    key={ability.name}
                    className="rounded-lg border border-line bg-surface-soft px-2.5 py-1 text-xs"
                  >
                    {displayName(ability.name)}
                    {ability.hidden && (
                      <span className="ml-1 text-muted">(hidden)</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-line bg-surface p-6">
            <h2 className="mb-4 font-semibold">Base stats</h2>
            <StatBars stats={entry.stats} color={accent} />
          </section>
        </div>
      </div>

      {entry.evolutionChain.length > 1 && (
        <section className="rounded-3xl border border-line bg-surface p-6">
          <h2 className="mb-4 font-semibold">Evolution line</h2>
          <div className="flex flex-wrap items-center gap-2">
            {entry.evolutionChain.map((stage, index) => {
              const stageEntry = getPokemon(stage.id);
              return (
                <div key={stage.id} className="flex items-center gap-2">
                  {index > 0 && <span className="text-muted">→</span>}
                  <Link
                    href={`/pokemon/${stage.id}`}
                    className={`flex flex-col items-center rounded-2xl border px-4 py-3 transition-colors ${
                      stage.id === entry.id
                        ? "border-transparent bg-surface-soft"
                        : "border-line hover:bg-surface-soft"
                    }`}
                  >
                    {stageEntry && (
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
        </section>
      )}
    </div>
  );
}
