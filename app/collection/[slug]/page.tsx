import Link from "next/link";
import { notFound } from "next/navigation";
import CollectionTracker from "@/components/CollectionTracker";
import { categories, getCategory } from "@/lib/categories";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/collection/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Not found" };
  return { title: `${category.name} — Collection`, description: category.tagline };
}

export default async function CategoryPage({
  params,
}: PageProps<"/collection/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <div
      className="flex flex-col gap-6"
      style={
        {
          "--cat-accent": category.accent,
          "--cat-accent-soft": category.accentSoft,
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
          background: `radial-gradient(circle at 15% 20%, ${category.accentSoft}, transparent 70%), var(--color-surface)`,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 text-8xl opacity-15"
        >
          {category.motif}
        </span>
        <span aria-hidden className="text-4xl">
          {category.motif}
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {category.name}
        </h1>
        <p className="mt-1 text-sm text-muted">{category.tagline}</p>
      </header>

      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="font-semibold">About</h2>
        <div className="mt-3 flex flex-col gap-3">
          {category.about.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>
        <dl className="mt-5 grid gap-3 sm:grid-cols-4">
          {category.facts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-2xl p-3 text-center"
              style={{ backgroundColor: category.accentSoft }}
            >
              <dt className="text-[11px] text-muted">{fact.label}</dt>
              <dd className="mt-0.5 text-sm font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CollectionTracker
        slug={category.slug}
        label={category.collectionLabel}
        placeholder={category.placeholder}
      />

      <p className="text-center text-xs text-muted">
        {category.name} is a trademark of its respective owner. This page is a
        personal collection log with no official affiliation.
      </p>
    </div>
  );
}
