import { Nature, NatureValue } from '../models/natures';
import { asEV, EV, IV, Level, Stat } from '../models/primitives';
import { StatValues } from '../models/stat-values';
import { calculateStatForHP, calculateStatForNonHP } from './stats';
import { cmul, sum } from './utilities';

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
  const A = 100;
  const B = 10;
  const D = base * 2 + iv + A;
  const ev = cmul(cmul(stat - B, 100 / level) - D, 4);
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
  const B = 5;
  const D = base * 2 + iv;
  const N = nature === 'up' ? 1.1 : nature === 'down' ? 0.9 : 1;
  const ev = cmul(sum(cmul(sum(cmul(stat, 1 / N), -B), 100 / level), -D), 4);
  return asEV(Math.min(Math.max(ev, 0), 252));
}

export function calculateIncrementedEVForHP(base: Stat, level: Level, iv: IV, ev: EV): EV {
  const before = calculateStatForHP(base, level, iv, ev);
  for (let temp = ev as number; temp <= 252; temp += 4) {
    const newEv = asEV(temp);
    const after = calculateStatForHP(base, level, iv, newEv);
    if (after > before) {
      return newEv;
    }
  }
  return ev;
}

export function calculateIncrementedEVForNonHP(
  base: Stat,
  level: Level,
  iv: IV,
  ev: EV,
  nature: NatureValue = 'neutral',
): EV {
  const before = calculateStatForNonHP(base, level, iv, ev, nature);
  for (let temp = ev as number; temp <= 252; temp += 4) {
    const newEv = asEV(temp);
    const after = calculateStatForNonHP(base, level, iv, newEv, nature);
    if (after > before) {
      return newEv;
    }
  }
  return ev;
}

export function calculateDecrementedEVForHP(base: Stat, level: Level, iv: IV, ev: EV): EV {
  if (ev < 4) {
    return asEV(0);
  }
  for (let temp = ev as number; temp >= 0; temp -= 4) {
    const stat = calculateStatForHP(base, level, iv, asEV(temp));
    const newEv = calculateEVForHP(base, level, iv, stat);
    if (newEv < ev) {
      return newEv;
    }
  }
  return ev;
}

export function calculateDecrementedEVForNonHP(
  base: Stat,
  level: Level,
  iv: IV,
  ev: EV,
  nature: NatureValue = 'neutral',
): EV {
  if (ev < 4) {
    return asEV(0);
  }
  for (let temp = ev as number; temp >= 0; temp -= 4) {
    const stat = calculateStatForNonHP(base, level, iv, asEV(temp), nature);
    const newEv = calculateEVForNonHP(base, level, iv, stat, nature);
    if (newEv < ev) {
      return newEv;
    }
  }
  return ev;
}
