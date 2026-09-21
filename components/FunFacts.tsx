import { funFacts } from "@/lib/facts";
import type { Pokemon } from "@/lib/pokemon";

export default function FunFacts({ entry }: { entry: Pokemon }) {
  const facts = funFacts(entry);
  if (facts.length === 0) return null;

  return (
    <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
      <h2 className="font-semibold">Fun facts</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {facts.map((fact) => (
          <li
            key={fact.text}
            className="flex gap-3 rounded-2xl bg-surface-soft p-3.5"
          >
            <span aria-hidden className="text-lg leading-none">
              {fact.icon}
            </span>
            <span className="text-sm leading-relaxed">{fact.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
