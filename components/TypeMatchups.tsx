import { displayName, typeColor, typeMatchups } from "@/lib/pokemon";

function multiplierLabel(multiplier: number): string {
  if (multiplier === 0) return "0×";
  if (multiplier === 0.25) return "¼×";
  if (multiplier === 0.5) return "½×";
  return `${multiplier}×`;
}

export default function TypeMatchups({ types }: { types: string[] }) {
  const matchups = typeMatchups(types);
  const weaknesses = matchups.filter((m) => m.multiplier > 1);
  const resistances = matchups.filter((m) => m.multiplier < 1);

  function row(title: string, list: typeof matchups) {
    if (list.length === 0) return null;
    return (
      <div>
        <p className="text-xs text-muted">{title}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {list.map((m) => (
            <span
              key={m.type}
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: typeColor(m.type) }}
            >
              {displayName(m.type)}
              <span className="rounded-full bg-black/25 px-1.5 py-px font-mono text-[10px]">
                {multiplierLabel(m.multiplier)}
              </span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {row("Takes more damage from", weaknesses)}
      {row("Resists", resistances)}
      {matchups.length === 0 && (
        <p className="text-sm text-muted">
          Takes normal damage from every type.
        </p>
      )}
    </div>
  );
}
