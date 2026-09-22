import Image from "next/image";
import Link from "next/link";
import SpongebobBrowser from "@/components/SpongebobBrowser";
import { getCategoryMeta, spongebob } from "@/lib/categories";

const meta = getCategoryMeta("spongebob")!;

export const metadata = {
  title: `${spongebob.title} — Collections`,
  description: meta.tagline,
};

export default function SpongebobPage() {
  const seasons = new Set(spongebob.episodes.map((e) => e.season)).size;

  return (
    <div
      className="flex flex-col gap-6"
      style={
        {
          "--cat-accent": meta.accent,
          "--cat-accent-soft": meta.accentSoft,
        } as React.CSSProperties
      }
    >
      <Link
        href="/"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        ← All categories
      </Link>

      <header
        className="relative overflow-hidden rounded-3xl border border-line p-8 shadow-sm"
        style={{
          background: `radial-gradient(circle at 15% 20%, ${meta.accentSoft}, transparent 70%), var(--color-surface)`,
        }}
      >
        <span aria-hidden className="text-4xl">
          {meta.motif}
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {spongebob.title}
        </h1>
        <p className="mt-1 text-sm text-muted">{meta.tagline}</p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-4">
          {[
            { label: "Premiered", value: spongebob.premiered },
            { label: "Seasons", value: String(seasons) },
            { label: "Episodes", value: String(spongebob.episodes.length) },
            {
              label: "Rating",
              value: spongebob.rating ? `★ ${spongebob.rating}` : "—",
            },
          ].map((fact) => (
            <div
              key={fact.label}
              className="rounded-2xl p-3 text-center"
              style={{ backgroundColor: meta.accentSoft }}
            >
              <dt className="text-[11px] text-muted">{fact.label}</dt>
              <dd className="mt-0.5 text-sm font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Main voice cast</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {spongebob.characters.map((character) => (
            <div
              key={character.name}
              className="overflow-hidden rounded-2xl border border-line"
            >
              {character.image && (
                <div className="relative aspect-square bg-surface-soft">
                  <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    sizes="200px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="p-2.5">
                <p className="text-xs font-semibold">{character.name}</p>
                <p className="mt-0.5 text-[11px] text-muted">
                  {character.actor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">All episodes</h2>
        <SpongebobBrowser episodes={spongebob.episodes} />
      </section>

      <p className="text-center text-xs text-muted">
        Episode data from{" "}
        <a
          href={meta.source.url}
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          {meta.source.name}
        </a>
        . SpongeBob SquarePants is a trademark of Viacom International Inc. This
        is a non-commercial fan page.
      </p>
    </div>
  );
}
