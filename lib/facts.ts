import {
  displayName,
  pokemon,
  totalStats,
  typeMatchups,
  type Pokemon,
  type Stat,
} from "./pokemon";

export type Fact = { icon: string; text: string };

function stat(stats: Stat[], name: string): number {
  return stats.find((s) => s.name === name)?.value ?? 0;
}

// Rankings are the same for every page, so build them once per process.
const byTotal = [...pokemon].sort(
  (a, b) => totalStats(b.stats) - totalStats(a.stats)
);
const totalRank = new Map(byTotal.map((p, i) => [p.id, i + 1]));

const bySpeed = [...pokemon].sort(
  (a, b) => stat(b.stats, "speed") - stat(a.stats, "speed")
);
const speedRank = new Map(bySpeed.map((p, i) => [p.id, i + 1]));

const weightSorted = [...pokemon].map((p) => p.weight).sort((a, b) => a - b);
const heightSorted = [...pokemon].map((p) => p.height).sort((a, b) => a - b);

const comboCounts = new Map<string, number>();
for (const p of pokemon) {
  const key = [...p.types].sort().join("/");
  comboCounts.set(key, (comboCounts.get(key) ?? 0) + 1);
}

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Special Attack",
  "special-defense": "Special Defense",
  speed: "Speed",
};

function percentile(sorted: number[], value: number): number {
  const below = sorted.filter((v) => v < value).length;
  return Math.round((below / sorted.length) * 100);
}

export function funFacts(entry: Pokemon): Fact[] {
  const facts: Fact[] = [];
  const total = totalStats(entry.stats);
  const rank = totalRank.get(entry.id) ?? 0;
  const combo = [...entry.types].sort().join("/");
  const comboCount = comboCounts.get(combo) ?? 1;
  const typeLabel = entry.types.map(displayName).join("/");

  if (rank <= 25) {
    facts.push({
      icon: "👑",
      text: `With ${total} total base stats it is the #${rank} strongest Pokémon ever made.`,
    });
  } else if (rank >= pokemon.length - 25) {
    facts.push({
      icon: "🌱",
      text: `Its ${total} total base stats rank #${rank} of ${pokemon.length} — one of the gentlest Pokémon in the dex.`,
    });
  } else {
    facts.push({
      icon: "📊",
      text: `Its ${total} total base stats rank #${rank} out of ${pokemon.length} Pokémon.`,
    });
  }

  if (comboCount === 1) {
    facts.push({
      icon: "💎",
      text: `It is the only Pokémon in the entire dex with the ${typeLabel} typing.`,
    });
  } else if (comboCount <= 5) {
    facts.push({
      icon: "🔮",
      text: `Only ${comboCount} Pokémon share its ${typeLabel} typing.`,
    });
  }

  const best = [...entry.stats].sort((a, b) => b.value - a.value)[0];
  const sameTypeBest = pokemon
    .filter((p) => p.types.includes(entry.types[0]))
    .sort((a, b) => stat(b.stats, best.name) - stat(a.stats, best.name))[0];
  if (sameTypeBest?.id === entry.id) {
    facts.push({
      icon: "🏆",
      text: `No other ${displayName(entry.types[0])}-type has more ${STAT_LABELS[best.name]} than its ${best.value}.`,
    });
  } else {
    facts.push({
      icon: "💪",
      text: `${STAT_LABELS[best.name]} is its standout stat at ${best.value}.`,
    });
  }

  const speedPlace = speedRank.get(entry.id) ?? 0;
  if (speedPlace <= 15) {
    facts.push({
      icon: "⚡",
      text: `It is the #${speedPlace} fastest Pokémon in the world.`,
    });
  }

  const weightPercent = percentile(weightSorted, entry.weight);
  if (weightPercent >= 97) {
    facts.push({
      icon: "🏋️",
      text: `At ${(entry.weight / 10).toFixed(1)} kg it is heavier than ${weightPercent}% of all Pokémon.`,
    });
  } else if (weightPercent <= 3) {
    facts.push({
      icon: "🪶",
      text: `At just ${(entry.weight / 10).toFixed(1)} kg it is lighter than all but ${weightPercent}% of Pokémon.`,
    });
  }

  const heightPercent = percentile(heightSorted, entry.height);
  if (heightPercent >= 98) {
    facts.push({
      icon: "🗼",
      text: `Standing ${(entry.height / 10).toFixed(1)} m tall, it towers over ${heightPercent}% of the dex.`,
    });
  }

  const quadWeak = typeMatchups(entry.types).filter((m) => m.multiplier >= 4);
  if (quadWeak.length > 0) {
    facts.push({
      icon: "💥",
      text: `${quadWeak.map((m) => displayName(m.type)).join(" and ")} moves hit it for quadruple damage — one of the steepest weaknesses in the game.`,
    });
  }

  const immunities = typeMatchups(entry.types).filter((m) => m.multiplier === 0);
  if (immunities.length > 0) {
    facts.push({
      icon: "🛡️",
      text: `It ignores ${immunities.map((m) => displayName(m.type)).join(" and ")} moves completely.`,
    });
  }

  if (entry.captureRate <= 5) {
    facts.push({
      icon: "🎯",
      text: `With a catch rate of just ${entry.captureRate}/255, it is one of the hardest Pokémon to catch.`,
    });
  } else if (entry.captureRate >= 235) {
    facts.push({
      icon: "🫶",
      text: `A catch rate of ${entry.captureRate}/255 makes it one of the easiest catches around.`,
    });
  }

  if (entry.evolutionChain.length >= 3) {
    const position = entry.evolutionChain.findIndex((s) => s.id === entry.id);
    facts.push({
      icon: "🧬",
      text: `It sits at stage ${position + 1} of a ${entry.evolutionChain.length}-Pokémon evolution family.`,
    });
  }

  if (entry.moves.length >= 40) {
    facts.push({
      icon: "📚",
      text: `It learns ${entry.moves.length} different moves as it levels up — a huge movepool.`,
    });
  }

  return facts.slice(0, 6);
}
