/**
 * ポケモンの能力値を計算する関数群
 */

import { StatValues, Nature, IV, EV, Stat } from '@lib/model';
import { inverse, Matrix } from 'ml-matrix';

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
  base: Readonly<StatValues<number>>,
  individual: StatValues<IV>,
  effort: StatValues<EV>,
  nature: Nature,
): StatValues<Stat> {
  // Stat = floor((floor((floor(EV/4) + D) × (Level/100)) + B) × Nature)
  // D = Base×2 + IV + A
  // HP:    A = 100, B = 10
  // HP以外: A = 0,   B = 5
  const A = vector([100, 0, 0, 0, 0, 0]);
  const B = vector([10, 5, 5, 5, 5, 5]);
  const D = vector([...base])
    .mul(2)
    .add(vector(individual))
    .add(A);
  const NV = Matrix.diag(createNatureValues(nature));

  const mat = Matrix.zeros(1, 6)
    .add(vector(effort).divide(4))
    .floor()
    .add(D)
    .mul(level / 100)
    .floor()
    .add(B)
    .mmul(NV)
    .floor();

  return mat.getRow(0) as StatValues<Stat>;
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
  stats: StatValues<Stat>,
  base: Readonly<StatValues<number>>,
  individual: StatValues<IV>,
  nature: Nature,
): StatValues<EV> {
  // EV = ceil(ceil(Stat / Nature) - B) × (100/Level)) - D) * 4
  // D  = Base×2 + IV + A
  // HP:    A = 100, B = 10
  // HP以外: A = 0,   B = 5
  const A = vector([100, 0, 0, 0, 0, 0]);
  const B = vector([10, 5, 5, 5, 5, 5]);
  const D = vector([...base])
    .mul(2)
    .add(vector(individual))
    .add(A);
  const NV = createNatureValues(nature);

  const mat = Matrix.zeros(1, 6)
    .add(vector(stats))
    .mmul(inverse(Matrix.diag(NV)))
    .ceil()
    .sub(B)
    .mul(100 / level)
    .ceil()
    .sub(D)
    .mul(4);

  return mat.getRow(0).map((v) => Math.min(Math.max(v, 0), 252)) as StatValues<EV>;
}

export function createNatureValues(nature: Nature): StatValues<number> {
  const vec = vector([1, 1, 1, 1, 1, 1]);

  if (nature.noop) {
    return vec.getRow(0) as StatValues<number>;
  }

  const { up, down } = nature;
  const statIndex = { A: 1, B: 2, C: 3, D: 4, S: 5 };
  return vec.set(0, statIndex[up], 1.1).set(0, statIndex[down], 0.9).getRow(0) as StatValues<number>;
}

function vector(values: number[]) {
  return new Matrix([values]);
}
