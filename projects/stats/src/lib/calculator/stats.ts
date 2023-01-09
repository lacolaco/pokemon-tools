/**
 * ポケモンの能力値を計算する関数群
 */

import { Nature, NatureValue } from '../models/natures';
import { asEV, asStat, EV, IV, Level, Stat } from '../models/primitives';
import { StatValues } from '../models/stat-values';

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
    A: calculateStatForNonHP(base.A, level, ivs.A, evs.A, nature.values.A ?? 'neutral'),
    B: calculateStatForNonHP(base.B, level, ivs.B, evs.B, nature.values.B ?? 'neutral'),
    C: calculateStatForNonHP(base.C, level, ivs.C, evs.C, nature.values.C ?? 'neutral'),
    D: calculateStatForNonHP(base.D, level, ivs.D, evs.D, nature.values.D ?? 'neutral'),
    S: calculateStatForNonHP(base.S, level, ivs.S, evs.S, nature.values.S ?? 'neutral'),
  };
}
export function calculateStatForHP(base: Stat, level: Level, iv: IV, ev: EV): Stat;
export function calculateStatForHP(base: Stat, level: Level, iv: IV | null, ev: EV): Stat | null;
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

export function calculateStatForNonHP(base: Stat, level: Level, iv: IV, ev: EV, nature: NatureValue): Stat;
export function calculateStatForNonHP(
  base: Stat,
  level: Level,
  iv: IV | null,
  ev: EV,
  nature: NatureValue,
): Stat | null;
export function calculateStatForNonHP(
  base: Stat,
  level: Level,
  iv: IV | null,
  ev: EV,
  nature: NatureValue,
): Stat | null {
  if (base === null || iv === null) {
    return null;
  }
  // Stat = floor((floor((floor(EV/4) + D) × (Level/100)) + B) × Nature)
  // D = Base × 2 + IV + A
  // A = 0, B = 5
  const D = base * 2 + iv;
  const N = nature === 'up' ? 1.1 : nature === 'down' ? 0.9 : 1;
  const stat = Math.floor((Math.floor(Math.floor(ev / 4) + D) * (level / 100) + 5) * N);
  return asStat(stat);
}

/**
 * 種族値と個体値と性格と能力値から必要な努力値を計算する
 * @param level レベル
 * @param base 種族値
 * @param ivs 個体値
 * @param nature 性格補正
 * @param stats 能力値
 * @returns 努力値
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
    A: calculateEVForNonHP(base.A, level, ivs.A, stats.A, nature.values.A ?? 'neutral'),
    B: calculateEVForNonHP(base.B, level, ivs.B, stats.B, nature.values.B ?? 'neutral'),
    C: calculateEVForNonHP(base.C, level, ivs.C, stats.C, nature.values.C ?? 'neutral'),
    D: calculateEVForNonHP(base.D, level, ivs.D, stats.D, nature.values.D ?? 'neutral'),
    S: calculateEVForNonHP(base.S, level, ivs.S, stats.S, nature.values.S ?? 'neutral'),
  };
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
  nature: NatureValue,
): EV {
  if (iv === null || stat === null) {
    return asEV(0);
  }
  // EV = ceil(ceil(Stat / Nature) - B) × (100/Level)) - D) * 4
  // D  = Base×2 + IV + A
  // A = 0, B = 5
  const D = base * 2 + iv;
  const N = nature === 'up' ? 1.1 : nature === 'down' ? 0.9 : 1;
  const ev = Math.ceil((Math.ceil(stat / N) - 5) * (100 / level) - D) * 4;
  return asEV(Math.min(Math.max(ev, 0), 252));
}
