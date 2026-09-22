import Link from "next/link";
import DisneyBrowser from "@/components/DisneyBrowser";
import { disney, getCategoryMeta } from "@/lib/categories";

const meta = getCategoryMeta("disney")!;

export const metadata = {
  title: "Disney characters — Collections",
  description: meta.tagline,
};

export default function DisneyPage() {
  const filmCount = new Set(disney.flatMap((c) => c.films)).size;

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
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Disney</h1>
        <p className="mt-1 text-sm text-muted">{meta.tagline}</p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          <div
            className="rounded-2xl p-3 text-center"
            style={{ backgroundColor: meta.accentSoft }}
          >
            <dt className="text-[11px] text-muted">Characters</dt>
            <dd className="mt-0.5 text-sm font-semibold">{disney.length}</dd>
          </div>
          <div
            className="rounded-2xl p-3 text-center"
            style={{ backgroundColor: meta.accentSoft }}
          >
            <dt className="text-[11px] text-muted">Films represented</dt>
            <dd className="mt-0.5 text-sm font-semibold">{filmCount}</dd>
          </div>
        </dl>
      </header>

      <DisneyBrowser characters={disney} />

      <p className="text-center text-xs text-muted">
        Character data from{" "}
        <a
          href={meta.source.url}
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          {meta.source.name}
        </a>
        . All characters are the property of The Walt Disney Company. This is a
        non-commercial fan page.
      </p>
    </div>
  );
}
