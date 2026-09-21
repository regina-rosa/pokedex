import { getLore, loreLabels } from "@/lib/lore";

export default function LoreCards({ id }: { id: number }) {
  const entries = getLore(id);
  if (entries.length === 0) return null;

  return (
    <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
      <h2 className="font-semibold">Legends &amp; rumours</h2>
      <p className="mb-4 mt-1 text-xs text-muted">
        Stories fans tell, and where its design really came from.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {entries.map((entry) => {
          const meta = loreLabels[entry.kind];
          return (
            <article
              key={entry.title}
              className="relative overflow-hidden rounded-2xl border border-line bg-surface-soft p-4"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-4 -top-4 text-5xl opacity-10"
              >
                {meta.icon}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-medium text-muted">
                {meta.icon} {meta.label}
              </span>
              <h3 className="relative mt-2 font-semibold">{entry.title}</h3>
              <p className="relative mt-1.5 text-sm leading-relaxed text-muted">
                {entry.text}
              </p>
            </article>
          );
        })}
      </div>
      {entries.some((e) => e.kind === "theory") && (
        <p className="mt-4 text-[11px] text-muted">
          Fan theories are community speculation, not official canon.
        </p>
      )}
    </section>
  );
}
