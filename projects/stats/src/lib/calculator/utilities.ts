import { StatValues } from '../models/stat-values';

export function sumOfStatValues<V extends number>(values: StatValues<V>): number {
  return [values.H, values.A, values.B, values.C, values.D, values.S].reduce((a, b) => a + b, 0);
}
