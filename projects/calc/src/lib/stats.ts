import { z } from 'zod';
import * as math from 'mathjs';

/**
 * Individual Value
 */
export const IV = z.number().min(0).max(31).brand<'IV'>();
export type IV = z.infer<typeof IV>;
/**
 * Effort Value
 */
export const EV = z.number().min(0).max(255).brand<'EV'>();
export type EV = z.infer<typeof EV>;
/**
 * Nature Value
 */
export const NV = z.union([z.literal(1), z.literal(1.1), z.literal(0.9)]).brand<'NV'>();
export type NV = z.infer<typeof NV>;

/**
 * ポケモンの能力値を計算する関数群
 */

export type StatValues<V, H = V> = [/* H */ H, /* A */ V, /* B */ V, /* C */ V, /* D */ V, /* S */ V];

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
  nature: StatValues<NV, 1>,
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

  const mat = math
    .chain(math.matrix(vector([0, 0, 0, 0, 0, 0])))
    .add(math.multiply(vector(effort), 1 / 4))
    .map((v) => math.floor(v))
    .add(D)
    .multiply(level / 100)
    .map((v) => math.floor(v))
    .add(B)
    .multiply(math.diag(nature))
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
  nature: StatValues<NV, 1>,
): StatValues<number> {
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

  const mat = math
    .chain(math.matrix(vector([0, 0, 0, 0, 0, 0])))
    .add(vector(stats))
    .multiply(math.diag(nature.map((v) => math.inv(v))))
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

function vector(values: number[]) {
  return math.matrix([values]);
}
