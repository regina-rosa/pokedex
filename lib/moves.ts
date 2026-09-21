import moveData from "@/data/moves.json";

export type MoveInfo = {
  type: string;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  damageClass: string;
};

export type LearnedMove = MoveInfo & {
  name: string;
  level: number;
};

const moves = moveData as Record<string, MoveInfo>;

export function getMove(name: string): MoveInfo | undefined {
  return moves[name];
}

export function learnedMoves(
  list: { name: string; level: number }[]
): LearnedMove[] {
  return list.flatMap((entry) => {
    const info = getMove(entry.name);
    return info ? [{ ...info, name: entry.name, level: entry.level }] : [];
  });
}
