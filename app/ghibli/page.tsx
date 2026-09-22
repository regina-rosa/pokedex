import Image from "next/image";
import Link from "next/link";
import { getCategoryMeta, ghibli } from "@/lib/categories";

const meta = getCategoryMeta("ghibli")!;

export const metadata = {
  title: "Studio Ghibli films — Collections",
  description: meta.tagline,
};

export default function GhibliPage() {
  const directors = new Set(ghibli.map((f) => f.director)).size;

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
          Studio Ghibli
        </h1>
        <p className="mt-1 text-sm text-muted">{meta.tagline}</p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Films", value: String(ghibli.length) },
            { label: "Directors", value: String(directors) },
            {
              label: "Years",
              value: `${ghibli[0]?.releaseDate}–${ghibli.at(-1)?.releaseDate}`,
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

      <div className="flex flex-col gap-4">
        {ghibli.map((film) => (
          <article
            key={film.id}
            className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-4 shadow-sm sm:flex-row"
          >
            {film.image && (
              <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-2xl bg-surface-soft sm:h-auto sm:w-40">
                <Image
                  src={film.image}
                  alt={film.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 160px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-lg font-semibold">{film.title}</h2>
                <span className="text-xs text-muted">{film.romanised}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                {film.releaseDate} · {film.runningTime} min · dir.{" "}
                {film.director}
                {film.score && ` · ★ ${film.score}`}
              </p>
              <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted">
                {film.description}
              </p>
              {film.characters.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {film.characters.map((character) => (
                    <span
                      key={character.name}
                      className="rounded-full px-2.5 py-0.5 text-[11px]"
                      style={{ backgroundColor: meta.accentSoft }}
                    >
                      {character.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <p className="text-center text-xs text-muted">
        Film data from{" "}
        <a
          href={meta.source.url}
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          {meta.source.name}
        </a>
        . All films are the property of Studio Ghibli. This is a non-commercial
        fan page.
      </p>
    </div>
  );
}
