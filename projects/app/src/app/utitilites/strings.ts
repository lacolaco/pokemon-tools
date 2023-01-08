import { StatValues } from '@lib/stats';

/**
 * カタカナをひらがなに変換する
 */
export function kataToHira(str: string): string {
  return str.replace(/[\u30A1-\u30FA]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

export function joinStatValues(value: StatValues<number>, delimiter = '-'): string {
  return `${value.H}${delimiter}${value.A}${delimiter}${value.B}${delimiter}${value.C}${delimiter}${value.D}${delimiter}${value.S}`;
}
