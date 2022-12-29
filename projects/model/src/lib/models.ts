import { z } from 'zod';

export type StatValues<V extends number> = { H: V; A: V; B: V; C: V; D: V; S: V };

export function compareStatValues<V extends number>(a: StatValues<V>, b: StatValues<V>): boolean {
  return a.H === b.H && a.A === b.A && a.B === b.B && a.C === b.C && a.D === b.D && a.S === b.S;
}

export const Stat = z.number().int().min(0).brand('Stat');
export type Stat = z.infer<typeof Stat>;
export function asStat(value: number): Stat {
  return Stat.parse(value);
}
export type Stats = StatValues<Stat>;
export function asStats(value: StatValues<number>): Stats {
  return {
    H: asStat(value.H),
    A: asStat(value.A),
    B: asStat(value.B),
    C: asStat(value.C),
    D: asStat(value.D),
    S: asStat(value.S),
  };
}

export const IV = z.number().int().min(0).max(31).brand('IV');
export type IV = z.infer<typeof IV>;
export function asIV(value: number): IV {
  return IV.parse(value);
}
export type IVs = StatValues<IV>;

export const EV = z
  .number()
  .int()
  .min(0)
  .max(255)
  .transform((v) => Math.floor(v / 4) * 4)
  .brand('EV');
export type EV = z.infer<typeof EV>;
export function asEV(value: number): EV {
  return EV.parse(value);
}
export type EVs = StatValues<EV>;

export const Level = z.number().int().min(1).max(100).brand('Level');
export type Level = z.infer<typeof Level>;
export function asLevel(value: number): Level {
  return Level.parse(value);
}

export type NatureStat = 'A' | 'B' | 'C' | 'D' | 'S';

export type Nature =
  | {
      name: string;
      up: NatureStat;
      down: NatureStat;
      noop?: never;
    }
  | {
      name: string;
      up?: never;
      down?: never;
      noop: true;
    };
