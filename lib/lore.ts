import loreData from "@/data/lore.json";

export type LoreKind = "theory" | "origin" | "trivia";

export type LoreEntry = {
  kind: LoreKind;
  title: string;
  text: string;
};

const lore = loreData as Record<string, LoreEntry[]>;

export const loreLabels: Record<LoreKind, { label: string; icon: string }> = {
  theory: { label: "Fan theory", icon: "🕵️" },
  origin: { label: "Real-world origin", icon: "📜" },
  trivia: { label: "Behind the scenes", icon: "🎬" },
};

export function getLore(id: number): LoreEntry[] {
  return lore[String(id)] ?? [];
}

export const loreIds = Object.keys(lore).map(Number);
