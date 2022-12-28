import Matrix from 'ml-matrix';

export function vector(values: number[]) {
  return new Matrix([values]);
}

export function sum(value: number[]): number {
  return value.reduce((a, b) => a + b, 0);
}
