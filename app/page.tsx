import Link from "next/link";
import { categoryList } from "@/lib/categories";
import { summaries } from "@/lib/pokemon";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <header className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          My little collections
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          A shelf for the things I like — browse the characters, episodes and
          films behind each one.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/pokemon"
          className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-accent opacity-20 blur-2xl"
          />
          <span
            aria-hidden
            className="relative block h-8 w-8 rounded-full border-2 border-foreground bg-accent transition-transform group-hover:rotate-180 before:absolute before:inset-x-0 before:top-1/2 before:h-[2px] before:-translate-y-1/2 before:bg-foreground after:absolute after:left-1/2 after:top-1/2 after:h-3 after:w-3 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:border-2 after:border-foreground after:bg-surface"
          />
          <h2 className="relative mt-3 text-xl font-semibold">Pokémon</h2>
          <p className="relative mt-1 text-sm text-muted">
            Stats, types, moves, shinies, natures, team partners and lore.
          </p>
          <span className="relative mt-3 inline-block rounded-full bg-accent-soft px-3 py-1 text-[11px] font-medium text-accent">
            {summaries.length} Pokémon
          </span>
        </Link>

        {categoryList.map((category) => (
          <Link
            key={category.slug}
            href={`/${category.slug}`}
            className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-25 blur-2xl"
              style={{ backgroundColor: category.accent }}
            />
            <span
              aria-hidden
              className="relative block text-3xl transition-transform group-hover:scale-110"
            >
              {category.motif}
            </span>
            <h2 className="relative mt-2 text-xl font-semibold">
              {category.name}
            </h2>
            <p className="relative mt-1 text-sm text-muted">
              {category.tagline}
            </p>
            <span
              className="relative mt-3 inline-block rounded-full px-3 py-1 text-[11px] font-medium"
              style={{
                backgroundColor: category.accentSoft,
                color: category.accent,
              }}
            >
              {category.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
