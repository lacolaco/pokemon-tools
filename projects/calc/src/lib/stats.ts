/**
 * ポケモンの能力値を計算する関数群
 */

import { asEV, asStat, EV, IV, Level, Nature, Stat, StatValues } from '@lib/model';

/**
 * 種族値と個体値と努力値と性格から能力値を計算する
 * @param level レベル
 * @param base 種族値
 * @param ivs 個体値
 * @param evs 努力値
 * @param nature 性格補正
 * @returns 能力値
 */
export function calculateAllStats(
  base: Readonly<StatValues<Stat>>,
  level: Level,
  ivs: StatValues<IV | null>,
  evs: StatValues<EV>,
  nature: Nature,
): StatValues<Stat | null> {
  return {
    H: calculateStatForHP(base.H, level, ivs.H, evs.H),
    A: calculateStatForNonHP(base.A, level, ivs.A, evs.A, nature.up === 'A' ? 1.1 : nature.down === 'A' ? 0.9 : 1),
    B: calculateStatForNonHP(base.B, level, ivs.B, evs.B, nature.up === 'B' ? 1.1 : nature.down === 'B' ? 0.9 : 1),
    C: calculateStatForNonHP(base.C, level, ivs.C, evs.C, nature.up === 'C' ? 1.1 : nature.down === 'C' ? 0.9 : 1),
    D: calculateStatForNonHP(base.D, level, ivs.D, evs.D, nature.up === 'D' ? 1.1 : nature.down === 'D' ? 0.9 : 1),
    S: calculateStatForNonHP(base.S, level, ivs.S, evs.S, nature.up === 'S' ? 1.1 : nature.down === 'S' ? 0.9 : 1),
  };
}

/**
 * 種族値と個体値と性格と能力値から必要な努力値を計算する
 * @param level レベル
 * @param base 種族値 [H, A, B, C, D, S]
 * @param ivs 個体値 [H, A, B, C, D, S]
 * @param nature 性格補正 [H, A, B, C, D, S]
 * @param stats 能力値 [H, A, B, C, D, S]
 * @returns 努力値 [H, A, B, C, D, S]
 */
export function calculateAllEVs(
  base: Readonly<StatValues<Stat>>,
  level: Level,
  ivs: StatValues<IV | null>,
  stats: StatValues<Stat | null>,
  nature: Nature,
): StatValues<EV> {
  return {
    H: calculateEVForHP(base.H, level, ivs.H, stats.H),
    A: calculateEVForNonHP(base.A, level, ivs.A, stats.A, nature.up === 'A' ? 1.1 : nature.down === 'A' ? 0.9 : 1),
    B: calculateEVForNonHP(base.B, level, ivs.B, stats.B, nature.up === 'B' ? 1.1 : nature.down === 'B' ? 0.9 : 1),
    C: calculateEVForNonHP(base.C, level, ivs.C, stats.C, nature.up === 'C' ? 1.1 : nature.down === 'C' ? 0.9 : 1),
    D: calculateEVForNonHP(base.D, level, ivs.D, stats.D, nature.up === 'D' ? 1.1 : nature.down === 'D' ? 0.9 : 1),
    S: calculateEVForNonHP(base.S, level, ivs.S, stats.S, nature.up === 'S' ? 1.1 : nature.down === 'S' ? 0.9 : 1),
  };
}

export type NatureEffect = 1 | 1.1 | 0.9;

export function calculateStatForHP(base: Stat, level: Level, iv: IV | null, ev: EV): Stat | null {
  if (base === null || iv === null) {
    return null;
  }
  // Stat = floor((floor((floor(EV/4) + D) × (Level/100)) + B))
  // D = Base × 2 + IV + A
  // A = 100, B = 10
  const D = base * 2 + iv + 100;
  const stat = Math.floor(Math.floor(Math.floor(ev / 4) + D) * (level / 100) + 10);
  return asStat(stat);
}

export function calculateStatForNonHP(
  base: Stat,
  level: Level,
  iv: IV | null,
  ev: EV,
  nature: NatureEffect,
): Stat | null {
  if (base === null || iv === null) {
    return null;
  }
  // Stat = floor((floor((floor(EV/4) + D) × (Level/100)) + B) × Nature)
  // D = Base × 2 + IV + A
  // A = 0, B = 5
  const D = base * 2 + iv;
  const stat = Math.floor((Math.floor(Math.floor(ev / 4) + D) * (level / 100) + 5) * nature);
  return asStat(stat);
}

export function calculateEVForHP(base: Stat, level: Level, iv: IV | null, stat: Stat | null): EV {
  if (iv === null || stat === null) {
    return asEV(0);
  }
  // EV = ceil((Stat - B) × (100/Level) - D) * 4
  // D  = Base×2 + IV + A
  // A = 100, B = 10
  const D = base * 2 + iv + 100;
  const ev = (Math.ceil((stat - 10) * (100 / level)) - D) * 4;
  return asEV(Math.min(Math.max(ev, 0), 252));
}

export function calculateEVForNonHP(
  base: Stat,
  level: Level,
  iv: IV | null,
  stat: Stat | null,
  nature: NatureEffect,
): EV {
  if (iv === null || stat === null) {
    return asEV(0);
  }
  // EV = ceil(ceil(Stat / Nature) - B) × (100/Level)) - D) * 4
  // D  = Base×2 + IV + A
  // A = 0, B = 5
  const D = base * 2 + iv;
  const ev = Math.ceil((Math.ceil(stat / nature) - 5) * (100 / level) - D) * 4;
  return asEV(Math.min(Math.max(ev, 0), 252));
}
