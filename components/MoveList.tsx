"use client";

import { useState } from "react";
import TypeBadge from "./TypeBadge";
import { displayName } from "@/lib/pokemon";
import type { LearnedMove } from "@/lib/moves";

const CLASS_ICONS: Record<string, string> = {
  physical: "⚔️",
  special: "✨",
  status: "🛡️",
};

export default function MoveList({ moves }: { moves: LearnedMove[] }) {
  const [sortByPower, setSortByPower] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const sorted = [...moves].sort((a, b) =>
    sortByPower
      ? (b.power ?? 0) - (a.power ?? 0)
      : a.level - b.level || a.name.localeCompare(b.name)
  );
  const shown = expanded ? sorted : sorted.slice(0, 12);

  if (moves.length === 0) {
    return (
      <p className="text-sm text-muted">No level-up moves recorded for it.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1 self-start rounded-full border border-line bg-surface-soft p-1">
        <button
          onClick={() => setSortByPower(false)}
          className={`rounded-full px-3 py-1 text-xs transition-colors ${
            sortByPower ? "text-muted hover:text-foreground" : "bg-accent text-white"
          }`}
        >
          By level
        </button>
        <button
          onClick={() => setSortByPower(true)}
          className={`rounded-full px-3 py-1 text-xs transition-colors ${
            sortByPower ? "bg-accent text-white" : "text-muted hover:text-foreground"
          }`}
        >
          Strongest
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[440px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="pb-2 font-normal">Lv</th>
              <th className="pb-2 font-normal">Move</th>
              <th className="pb-2 font-normal">Type</th>
              <th className="pb-2 text-right font-normal">Power</th>
              <th className="pb-2 text-right font-normal">Acc</th>
              <th className="pb-2 text-right font-normal">PP</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((move) => (
              <tr key={move.name} className="border-t border-line">
                <td className="py-2 font-mono text-xs text-muted">
                  {move.level === 0 ? "—" : move.level}
                </td>
                <td className="py-2 pr-3">
                  <span title={move.damageClass}>
                    {CLASS_ICONS[move.damageClass] ?? ""}{" "}
                  </span>
                  {displayName(move.name)}
                </td>
                <td className="py-2 pr-3">
                  <TypeBadge type={move.type} />
                </td>
                <td className="py-2 text-right font-mono text-xs">
                  {move.power ?? "—"}
                </td>
                <td className="py-2 text-right font-mono text-xs">
                  {move.accuracy ? `${move.accuracy}%` : "—"}
                </td>
                <td className="py-2 text-right font-mono text-xs">
                  {move.pp ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sorted.length > 12 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="self-start text-xs font-medium text-accent hover:underline"
        >
          {expanded
            ? "Show fewer"
            : `Show all ${sorted.length} moves`}
        </button>
      )}
    </div>
  );
}
