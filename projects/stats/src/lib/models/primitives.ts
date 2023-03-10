import { z } from 'zod';

export const Stat = z.number().int().positive().brand('Stat');
export type Stat = z.infer<typeof Stat>;
export function asStat(value: number): Stat {
  return Stat.parse(value);
}

export const IV = z.number().int().min(0).max(31).brand('IV');
export type IV = z.infer<typeof IV>;
export function asIV(value: number): IV {
  return IV.parse(value);
}

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

export const Level = z.number().int().min(1).max(100).brand('Level');
export type Level = z.infer<typeof Level>;
export function asLevel(value: number): Level {
  return Level.parse(value);
}
