/**
 * ポケモンの能力値を計算する関数群
 */

import { asStats, EVs, IVs, Level, Nature, Stats, StatValues } from '@lib/model';
import { inverse, Matrix } from 'ml-matrix';

/**
 * 種族値と個体値と努力値と性格から能力値を計算する
 * @param level レベル
 * @param base 種族値 [H, A, B, C, D, S]
 * @param ivs 個体値 [H, A, B, C, D, S]
 * @param evs 努力値 [H, A, B, C, D, S]
 * @param nature 性格補正 [H, A, B, C, D, S]
 * @returns 能力値 [H, A, B, C, D, S]
 */
export function calculateStats(base: Readonly<Stats>, level: Level, nature: Nature, ivs: IVs, evs: EVs): Stats {
  // Stat = floor((floor((floor(EV/4) + D) × (Level/100)) + B) × Nature)
  // D = Base×2 + IV + A
  // HP:    A = 100, B = 10
  // HP以外: A = 0,   B = 5
  const Base = vectorFromStatValues(base);
  const IV = vectorFromStatValues(ivs);
  const EV = vectorFromStatValues(evs);
  const A = vector([100, 0, 0, 0, 0, 0]);
  const B = vector([10, 5, 5, 5, 5, 5]);
  const D = Base.mul(2).add(IV).add(A);
  const NV = createNatureDiagonal(nature);

  const mat = Matrix.zeros(1, 6)
    .add(EV.divide(4))
    .floor()
    .add(D)
    .mul(level / 100)
    .floor()
    .add(B)
    .mmul(NV)
    .floor();

  // ignore stat values if the iv is ignored
  const values = statValuesFromVector(mat);
  return asStats({
    H: ivs.H === null ? null : values.H,
    A: ivs.A === null ? null : values.A,
    B: ivs.B === null ? null : values.B,
    C: ivs.C === null ? null : values.C,
    D: ivs.D === null ? null : values.D,
    S: ivs.S === null ? null : values.S,
  });
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
export function calculateEVs(base: Readonly<Stats>, level: Level, nature: Nature, ivs: IVs, stats: Stats): EVs {
  // EV = ceil(ceil(Stat / Nature) - B) × (100/Level)) - D) * 4
  // D  = Base×2 + IV + A
  // HP:    A = 100, B = 10
  // HP以外: A = 0,   B = 5
  const Base = vectorFromStatValues(base);
  const IV = vectorFromStatValues(ivs);
  const Stat = vectorFromStatValues(stats);
  const A = vector([100, 0, 0, 0, 0, 0]);
  const B = vector([10, 5, 5, 5, 5, 5]);
  const D = Base.mul(2).add(IV).add(A);
  const NV = createNatureDiagonal(nature);

  const mat = Matrix.zeros(1, 6)
    .add(Stat)
    .mmul(inverse(NV))
    .ceil()
    .sub(B)
    .mul(100 / level)
    .ceil()
    .sub(D)
    .mul(4)
    .apply(function (this: Matrix, i, j) {
      // 負の値は0に、252より大きい値は252にする
      const v = this.get(i, j);
      return this.set(i, j, Math.min(Math.max(v, 0), 252));
    });
  return statValuesFromVector(mat);
}

function createNatureDiagonal(nature: Nature): Matrix {
  if (nature.noop) {
    return Matrix.diag([1, 1, 1, 1, 1, 1]);
  }

  const vec = vector([1, 1, 1, 1, 1, 1]);
  const { up, down } = nature;
  const statIndex = { A: 1, B: 2, C: 3, D: 4, S: 5 };
  return Matrix.diag(vec.set(0, statIndex[up], 1.1).set(0, statIndex[down], 0.9).getRow(0));
}

function vector(values: number[]) {
  return new Matrix([values]);
}

function vectorFromStatValues<V extends number | null>({ H, A, B, C, D, S }: StatValues<V>) {
  return vector([H ?? 0, A ?? 0, B ?? 0, C ?? 0, D ?? 0, S ?? 0]);
}

function statValuesFromVector<V extends number>(vec: Matrix): StatValues<V> {
  if (vec.rows !== 1 || vec.columns !== 6) {
    console.error(vec.toString());
    throw new Error('Invalid vector');
  }
  const [H, A, B, C, D, S] = vec.getRow(0);
  return { H, A, B, C, D, S } as StatValues<V>;
}
