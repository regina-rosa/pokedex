import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import DexStories from "@/components/DexStories";
import FunFacts from "@/components/FunFacts";
import MoveList from "@/components/MoveList";
import PokemonShowcase, {
  type ShowcaseEntry,
} from "@/components/PokemonShowcase";
import StatBars from "@/components/StatBars";
import StrategyPanel from "@/components/StrategyPanel";
import TypeMatchups from "@/components/TypeMatchups";
import { learnedMoves } from "@/lib/moves";
import {
  displayName,
  generationNames,
  getPokemon,
  pokemon,
  typeColor,
  type Pokemon,
} from "@/lib/pokemon";

export function generateStaticParams() {
  return pokemon.map((entry) => ({ id: String(entry.id) }));
}

function toShowcaseEntry(entry: Pokemon): ShowcaseEntry {
  return {
    id: entry.id,
    name: entry.name,
    genus: entry.genus,
    types: entry.types,
    artwork: entry.artwork,
    shinyArtwork: entry.shinyArtwork,
    cry: entry.cry,
    isLegendary: entry.isLegendary,
    isMythical: entry.isMythical,
  };
}

export async function generateMetadata({ params }: PageProps<"/pokemon/[id]">) {
  const { id } = await params;
  const entry = getPokemon(Number(id));
  if (!entry) return { title: "Not found" };
  return {
    title: `${displayName(entry.name)} — Pokédex`,
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
      <div className="flex items-center justify-between gap-4 text-sm">
        <Link
          href="/"
          className="text-muted transition-colors hover:text-foreground"
        >
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
        <PokemonShowcase entry={toShowcaseEntry(entry)} />

        <div className="flex flex-col gap-5">
          <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
            <p className="text-sm leading-relaxed text-muted">
              {entry.description}
            </p>
            <dl className="mt-5 grid grid-cols-4 gap-3 text-center">
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
                <dt className="text-xs text-muted">Catch rate</dt>
                <dd className="mt-0.5 font-semibold">{entry.captureRate}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Region</dt>
                <dd className="mt-0.5 font-semibold">
                  {generationNames[entry.generation]}
                </dd>
              </div>
            </dl>
            <div className="mt-5">
              <p className="text-xs text-muted">Abilities</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {entry.abilities.map((ability) => (
                  <span
                    key={ability.name}
                    className="rounded-full border border-line bg-surface-soft px-3 py-1 text-xs"
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

          <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
            <h2 className="mb-4 font-semibold">Base stats</h2>
            <StatBars stats={entry.stats} color={accent} />
          </section>
        </div>
      </div>

      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Type matchups</h2>
        <TypeMatchups types={entry.types} />
      </section>

      <FunFacts entry={entry} />

      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="font-semibold">Dex stories</h2>
        <p className="mb-4 mt-1 text-xs text-muted">
          What each game&apos;s Pokédex says about it.
        </p>
        <DexStories stories={entry.stories} />
      </section>

      <StrategyPanel entry={entry} />

      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Moves it learns</h2>
        <MoveList moves={learnedMoves(entry.moves)} />
      </section>

      {entry.evolutionChain.length > 1 && (
        <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
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
        </section>
      )}
    </div>
  );
}
