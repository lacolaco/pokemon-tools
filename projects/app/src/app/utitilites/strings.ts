/**
 * カタカナをひらがなに変換する
 */
export function kataToHira(str: string): string {
  return str.replace(/[\u30A1-\u30FA]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}
