/**
 * ポケモンの能力値を計算する関数群
 */

import * as math from 'mathjs';
import { StatValues, Nature, IV, EV } from './models';

/**
 * 種族値と個体値と努力値と性格から能力値を計算する
 * @param level レベル
 * @param base 種族値 [H, A, B, C, D, S]
 * @param individual 個体値 [H, A, B, C, D, S]
 * @param effort 努力値 [H, A, B, C, D, S]
 * @param nature 性格補正 [H, A, B, C, D, S]
 * @returns 能力値 [H, A, B, C, D, S]
 */
export function calcStats(
  level: number,
  base: StatValues<number>,
  individual: StatValues<IV>,
  effort: StatValues<EV>,
  nature: Nature,
): StatValues<number> {
  // Stat = floor((floor((floor(EV/4) + D) × (Level/100)) + B) × Nature)
  // D = Base×2 + IV + A
  // HP:    A = 100, B = 10
  // HP以外: A = 0,   B = 5
  const A = vector([100, 0, 0, 0, 0, 0]);
  const B = vector([10, 5, 5, 5, 5, 5]);
  const D = math
    .chain(math.matrix(math.multiply(vector(base), 2)))
    .add(vector(individual))
    .add(A)
    .done();
  const NV = nature === null ? [1, 1, 1, 1, 1, 1] : createNatureValues(nature);

  const mat = math
    .chain(math.matrix(vector([0, 0, 0, 0, 0, 0])))
    .add(math.multiply(vector(effort), 1 / 4))
    .map((v) => math.floor(v))
    .add(D)
    .multiply(level / 100)
    .map((v) => math.floor(v))
    .add(B)
    .multiply(math.diag(NV))
    .map((v) => math.floor(v))
    .done();

  return math.flatten(mat).toArray() as StatValues<number>;
}

/**
 * 種族値と個体値と性格と能力値から必要な努力値を計算する
 * @param level レベル
 * @param base 種族値 [H, A, B, C, D, S]
 * @param individual 個体値 [H, A, B, C, D, S]
 * @param nature 性格補正 [H, A, B, C, D, S]
 * @param stats 能力値 [H, A, B, C, D, S]
 * @returns 努力値 [H, A, B, C, D, S]
 */
export function calcEVs(
  level: number,
  stats: StatValues<number>,
  base: StatValues<number>,
  individual: StatValues<IV>,
  nature: Nature,
): StatValues<EV> {
  // EV = ceil(ceil(Stat / Nature) - B) × (100/Level)) - D) * 4
  // D  = Base×2 + IV + A
  // HP:    A = 100, B = 10
  // HP以外: A = 0,   B = 5
  const A = vector([100, 0, 0, 0, 0, 0]);
  const B = vector([10, 5, 5, 5, 5, 5]);
  const D = math
    .chain(math.matrix(math.multiply(vector(base), 2)))
    .add(vector(individual))
    .add(A)
    .done();
  const NV = createNatureValues(nature);

  const mat = math
    .chain(math.matrix(vector([0, 0, 0, 0, 0, 0])))
    .add(vector(stats))
    .multiply(math.diag(NV.map((v) => math.inv(v))))
    .map((v) => math.ceil(v))
    .subtract(B)
    .multiply(100 / level)
    .map((v) => math.ceil(v))
    .subtract(D)
    .map((v) => math.max(v, 0))
    .multiply(4)
    .done();
  return math.flatten(mat).toArray() as StatValues<EV>;
}

export function createNatureValues(nature: Nature): StatValues<number> {
  function getDiff(dir: 'up' | 'down') {
    const val = dir === 'up' ? 1.1 : 0.9;
    if (nature.noop) {
      return vector([0, 0, 0, 0, 0, 0]);
    }

    switch (nature[dir]) {
      case 'A':
        return vector([0, val, 0, 0, 0, 0]);
      case 'B':
        return vector([0, 0, val, 0, 0, 0]);
      case 'C':
        return vector([0, 0, 0, val, 0, 0]);
      case 'D':
        return vector([0, 0, 0, 0, val, 0]);
      case 'S':
        return vector([0, 0, 0, 0, 0, val]);
    }
  }
  return math
    .flatten(
      math
        .chain(vector([0, 0, 0, 0, 0, 0]))
        .add(getDiff('up'))
        .add(getDiff('down'))
        .map((v) => (v === 0 ? 1 : v))
        .done(),
    )
    .toArray() as StatValues<number>;
}

function vector(values: number[]) {
  return math.matrix([values]);
}
