import { StatValues } from '../models/stat-values';

export function floor(value: number): number {
  return Math.floor(value);
}

export function ceil(value: number): number {
  return Math.ceil(value);
}

export function sum(a: number, b: number): number {
  return a + b;
}

export function fmul(a: number, b: number): number {
  return floor(a * b);
}

export function cmul(a: number, b: number): number {
  return ceil(a * b);
}

export function sumOfStatValues<V extends number>(values: StatValues<V>): number {
  return [values.H, values.A, values.B, values.C, values.D, values.S].reduce((a, b) => a + b, 0);
}
