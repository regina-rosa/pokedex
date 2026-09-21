import {
  allTypes,
  pokemon,
  typeMatchups,
  totalStats,
  type Pokemon,
  type Stat,
} from "./pokemon";

export type Nature = {
  name: string;
  raises: string;
  lowers: string;
  reason: string;
};

export type Role =
  | "Physical sweeper"
  | "Special sweeper"
  | "Physical attacker"
  | "Special attacker"
  | "Physical wall"
  | "Special wall"
  | "Balanced";

function stat(stats: Stat[], name: string): number {
  return stats.find((s) => s.name === name)?.value ?? 0;
}

export function role(entry: Pokemon): Role {
  const attack = stat(entry.stats, "attack");
  const spAttack = stat(entry.stats, "special-attack");
  const defense = stat(entry.stats, "defense");
  const spDefense = stat(entry.stats, "special-defense");
  const speed = stat(entry.stats, "speed");
  const hp = stat(entry.stats, "hp");

  const offense = Math.max(attack, spAttack);
  const bulk = (defense + spDefense + hp) / 3;

  if (bulk > offense + 15) {
    return defense >= spDefense ? "Physical wall" : "Special wall";
  }
  if (attack >= spAttack) {
    return speed >= 95 ? "Physical sweeper" : "Physical attacker";
  }
  return speed >= 95 ? "Special sweeper" : "Special attacker";
}

/**
 * Picks the nature competitive players would default to: boost the stat the
 * Pokémon actually uses, and drop the offensive stat it never touches.
 */
export function recommendedNature(entry: Pokemon): Nature {
  const attack = stat(entry.stats, "attack");
  const spAttack = stat(entry.stats, "special-attack");
  const defense = stat(entry.stats, "defense");
  const spDefense = stat(entry.stats, "special-defense");
  const speed = stat(entry.stats, "speed");

  const physical = attack >= spAttack;
  const unusedOffense = physical ? "Sp. Atk" : "Attack";
  const entryRole = role(entry);

  if (entryRole === "Physical wall" || entryRole === "Special wall") {
    const boostDefense = defense <= spDefense;
    if (physical) {
      return {
        name: boostDefense ? "Impish" : "Careful",
        raises: boostDefense ? "Defense" : "Sp. Def",
        lowers: "Sp. Atk",
        reason: `Its bulk outweighs its offence, so shore up the weaker defensive side and drop the unused Sp. Atk.`,
      };
    }
    return {
      name: boostDefense ? "Bold" : "Calm",
      raises: boostDefense ? "Defense" : "Sp. Def",
      lowers: "Attack",
      reason: `A defensive spread suits it, and Attack is the stat it never needs.`,
    };
  }

  const fast = speed >= 95;
  if (physical) {
    return {
      name: fast ? "Jolly" : "Adamant",
      raises: fast ? "Speed" : "Attack",
      lowers: unusedOffense,
      reason: fast
        ? `Base ${speed} Speed is worth pushing so it moves first; its Sp. Atk goes unused.`
        : `It is too slow to outspeed much, so lean into base ${attack} Attack instead.`,
    };
  }
  return {
    name: fast ? "Timid" : "Modest",
    raises: fast ? "Speed" : "Sp. Atk",
    lowers: unusedOffense,
    reason: fast
      ? `Base ${speed} Speed lets it outrun threats, and it never uses physical Attack.`
      : `Base ${spAttack} Sp. Atk is its main weapon, and physical Attack is dead weight.`,
  };
}

export type Partner = {
  id: number;
  covered: string[];
};

const partnerCache = new Map<string, Partner[]>();

/**
 * Suggests teammates that resist what this Pokémon is weak to, while this
 * Pokémon covers their weaknesses in return.
 */
export function bestPartners(entry: Pokemon, limit = 3): Partner[] {
  const key = entry.types.join("/");
  const cached = partnerCache.get(key);
  if (cached) return cached.filter((p) => p.id !== entry.id).slice(0, limit);

  const myWeaknesses = typeMatchups(entry.types).filter((m) => m.multiplier > 1);
  const myResistances = new Set(
    typeMatchups(entry.types)
      .filter((m) => m.multiplier < 1)
      .map((m) => m.type)
  );

  const scored = pokemon
    .filter(
      (candidate) =>
        candidate.types.join("/") !== key &&
        // Box legends make lazy suggestions; recommend teammates people can use.
        !candidate.isLegendary &&
        !candidate.isMythical &&
        // Fully evolved only, so we never suggest a Caterpie as a bodyguard.
        candidate.evolutionChain.at(-1)?.id === candidate.id
    )
    .map((candidate) => {
      const matchups = typeMatchups(candidate.types);
      const resists = new Map(
        matchups
          .filter((m) => m.multiplier < 1)
          .map((m) => [m.type, m.multiplier])
      );
      const weaknesses = matchups
        .filter((m) => m.multiplier > 1)
        .map((m) => m.type);

      // Shutting down a 4x weakness is worth far more than a 2x one.
      const coverageScore = myWeaknesses.reduce((sum, weakness) => {
        const resistance = resists.get(weakness.type);
        if (resistance === undefined) return sum;
        return sum + weakness.multiplier * (resistance === 0 ? 2 : 1);
      }, 0);

      const returned = weaknesses.filter((type) => myResistances.has(type));

      return {
        id: candidate.id,
        covered: myWeaknesses
          .filter((w) => resists.has(w.type))
          .map((w) => w.type),
        score:
          coverageScore * 3 +
          returned.length * 2 +
          totalStats(candidate.stats) / 2000,
      };
    })
    .filter((candidate) => candidate.covered.length > 0)
    .sort((a, b) => b.score - a.score);

  // Keep one suggestion per type combination so the list is not three clones.
  const seenCombos = new Set<string>();
  const picks: Partner[] = [];
  for (const candidate of scored) {
    const combo = pokemon.find((p) => p.id === candidate.id)!.types.join("/");
    if (seenCombos.has(combo)) continue;
    seenCombos.add(combo);
    picks.push({ id: candidate.id, covered: candidate.covered });
    if (picks.length >= limit + 2) break;
  }

  partnerCache.set(key, picks);
  return picks.filter((p) => p.id !== entry.id).slice(0, limit);
}

export const typeList = allTypes;
