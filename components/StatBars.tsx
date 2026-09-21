import { statLabels, totalStats, type Stat } from "@/lib/pokemon";

const MAX_BASE_STAT = 180;

export default function StatBars({
  stats,
  color,
}: {
  stats: Stat[];
  color: string;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {stats.map((stat) => (
        <div key={stat.name} className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-xs text-muted">
            {statLabels[stat.name] ?? stat.name}
          </span>
          <span className="w-8 shrink-0 font-mono text-xs">{stat.value}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-soft">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min((stat.value / MAX_BASE_STAT) * 100, 100)}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </div>
      ))}
      <div className="mt-1 flex items-center gap-3 border-t border-line pt-2.5">
        <span className="w-16 shrink-0 text-xs font-medium">Total</span>
        <span className="font-mono text-xs font-semibold">
          {totalStats(stats)}
        </span>
      </div>
    </div>
  );
}
