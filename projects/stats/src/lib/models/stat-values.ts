export type StatValues<V> = { H: V; A: V; B: V; C: V; D: V; S: V };

export function compareStatValues<V>(a: StatValues<V>, b: StatValues<V>): boolean {
  return a.H === b.H && a.A === b.A && a.B === b.B && a.C === b.C && a.D === b.D && a.S === b.S;
}

export function serializeStatValues<V extends number>(values: StatValues<V>): string {
  return `${values.H}-${values.A}-${values.B}-${values.C}-${values.D}-${values.S}`;
}

export function deserializeStatValues<V extends number>(value: string): StatValues<V> {
  const [H, A, B, C, D, S] = value.split('-').map((v) => Number(v) as V);
  return { H, A, B, C, D, S };
}
