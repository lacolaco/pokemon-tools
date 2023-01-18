/**
 * ポケモンの能力値を計算する関数群
 */

import { Nature, NatureValue } from '../models/natures';
import { asStat, EV, IV, Level, Stat } from '../models/primitives';
import { StatValues } from '../models/stat-values';
import { fmul, sum } from './utilities';

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
    A: calculateStatForNonHP(base.A, level, ivs.A, evs.A, nature.values.A),
    B: calculateStatForNonHP(base.B, level, ivs.B, evs.B, nature.values.B),
    C: calculateStatForNonHP(base.C, level, ivs.C, evs.C, nature.values.C),
    D: calculateStatForNonHP(base.D, level, ivs.D, evs.D, nature.values.D),
    S: calculateStatForNonHP(base.S, level, ivs.S, evs.S, nature.values.S),
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
  const A = 100;
  const B = 10;
  const D = base * 2 + iv + A;
  const stat = sum(fmul(sum(fmul(ev, 1 / 4), D), level / 100), B);

  return asStat(stat);
}

export function calculateStatForNonHP(base: Stat, level: Level, iv: IV, ev: EV, nature?: NatureValue): Stat;
export function calculateStatForNonHP(
  base: Stat,
  level: Level,
  iv: IV | null,
  ev: EV,
  nature?: NatureValue,
): Stat | null;
export function calculateStatForNonHP(
  base: Stat,
  level: Level,
  iv: IV | null,
  ev: EV,
  nature: NatureValue = 'neutral',
): Stat | null {
  if (base === null || iv === null) {
    return null;
  }
  // Stat = floor((floor((floor(EV/4) + D) × (Level/100)) + B) × N)
  // D = Base × 2 + IV + A
  // A = 0, B = 5
  const B = 5;
  const D = base * 2 + iv;
  const N = nature === 'up' ? 1.1 : nature === 'down' ? 0.9 : 1;
  const stat = fmul(sum(fmul(sum(fmul(ev, 1 / 4), D), level / 100), B), N);
  return asStat(stat);
}
