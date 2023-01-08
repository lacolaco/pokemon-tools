import { Nature } from './primitives';

export const naturesMap = {
  さみしがり: { name: 'さみしがり', up: 'A', down: 'B' },
  いじっぱり: { name: 'いじっぱり', up: 'A', down: 'C' },
  やんちゃ: { name: 'やんちゃ', up: 'A', down: 'D' },
  ゆうかん: { name: 'ゆうかん', up: 'A', down: 'S' },
  ずぶとい: { name: 'ずぶとい', up: 'B', down: 'A' },
  わんぱく: { name: 'わんぱく', up: 'B', down: 'C' },
  のうてんき: { name: 'のうてんき', up: 'B', down: 'D' },
  のんき: { name: 'のんき', up: 'B', down: 'S' },
  ひかえめ: { name: 'ひかえめ', up: 'C', down: 'A' },
  おっとり: { name: 'おっとり', up: 'C', down: 'B' },
  うっかりや: { name: 'うっかりや', up: 'C', down: 'D' },
  れいせい: { name: 'れいせい', up: 'C', down: 'S' },
  おだやか: { name: 'おだやか', up: 'D', down: 'A' },
  おとなしい: { name: 'おとなしい', up: 'D', down: 'B' },
  しんちょう: { name: 'しんちょう', up: 'D', down: 'C' },
  なまいき: { name: 'なまいき', up: 'D', down: 'S' },
  おくびょう: { name: 'おくびょう', up: 'S', down: 'A' },
  せっかち: { name: 'せっかち', up: 'S', down: 'B' },
  ようき: { name: 'ようき', up: 'S', down: 'C' },
  むじゃき: { name: 'むじゃき', up: 'S', down: 'D' },
  てれや: { name: 'てれや', noop: true },
  がんばりや: { name: 'がんばりや', noop: true },
  すなお: { name: 'すなお', noop: true },
  きまぐれ: { name: 'きまぐれ', noop: true },
  まじめ: { name: 'まじめ', noop: true },
} as const;

export type NatureName = keyof typeof naturesMap;

export const natures: ReadonlyArray<Nature> = Object.values(naturesMap);
