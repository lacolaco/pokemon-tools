import { StatValues } from '@lib/stats';

/**
 * カタカナをひらがなに変換する
 */
export function kataToHira(str: string): string {
  return str.replace(/[\u30A1-\u30FA]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

export function joinStatValues(value: StatValues<number | null>, delimiter = '-'): string {
  return [value.H, value.A, value.B, value.C, value.D, value.S].map((v) => v ?? 'x').join(delimiter);
}
