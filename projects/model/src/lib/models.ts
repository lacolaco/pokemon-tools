import { z } from 'zod';

export type StatValues<V> = [/* H */ V, /* A */ V, /* B */ V, /* C */ V, /* D */ V, /* S */ V];

export function equalsStatValues<V>(a: StatValues<V>, b: StatValues<V>): boolean {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

export const Stat = z.number().min(0).brand('Stat');
export type Stat = z.infer<typeof Stat>;
export function stat(value: number): Stat {
  return Stat.parse(value);
}

export const IV = z.number().min(0).max(31).brand('IV');
export type IV = z.infer<typeof IV>;
export function iv(value: number): IV {
  return IV.parse(value);
}

export const EV = z
  .number()
  .int()
  .min(0)
  .max(255)
  .transform((v) => {
    return Math.floor(v / 4) * 4;
  })
  .brand('EV');
export type EV = z.infer<typeof EV>;
export function ev(value: number): EV {
  return EV.parse(value);
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
