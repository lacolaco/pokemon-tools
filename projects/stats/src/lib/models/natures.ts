export type NatureStat = 'A' | 'B' | 'C' | 'D' | 'S';
export type NatureValue = 'up' | 'down' | undefined;
export type NatureValues = {
  [key in NatureStat]?: NatureValue;
};

export type Nature = { name: string; values: NatureValues };

export const natures = {
  // A up
  さみしがり: { name: 'さみしがり', values: { A: 'up', B: 'down' } },
  いじっぱり: { name: 'いじっぱり', values: { A: 'up', C: 'down' } },
  やんちゃ: { name: 'やんちゃ', values: { A: 'up', D: 'down' } },
  ゆうかん: { name: 'ゆうかん', values: { A: 'up', S: 'down' } },
  // B up
  ずぶとい: { name: 'ずぶとい', values: { B: 'up', A: 'down' } },
  わんぱく: { name: 'わんぱく', values: { B: 'up', C: 'down' } },
  のうてんき: { name: 'のうてんき', values: { B: 'up', D: 'down' } },
  のんき: { name: 'のんき', values: { B: 'up', S: 'down' } },
  // C up
  ひかえめ: { name: 'ひかえめ', values: { C: 'up', A: 'down' } },
  おっとり: { name: 'おっとり', values: { C: 'up', B: 'down' } },
  うっかりや: { name: 'うっかりや', values: { C: 'up', D: 'down' } },
  れいせい: { name: 'れいせい', values: { C: 'up', S: 'down' } },
  // D up
  おだやか: { name: 'おだやか', values: { D: 'up', A: 'down' } },
  おとなしい: { name: 'おとなしい', values: { D: 'up', B: 'down' } },
  しんちょう: { name: 'しんちょう', values: { D: 'up', C: 'down' } },
  なまいき: { name: 'なまいき', values: { D: 'up', S: 'down' } },
  // S up
  おくびょう: { name: 'おくびょう', values: { S: 'up', A: 'down' } },
  せっかち: { name: 'せっかち', values: { S: 'up', B: 'down' } },
  ようき: { name: 'ようき', values: { S: 'up', C: 'down' } },
  むじゃき: { name: 'むじゃき', values: { S: 'up', D: 'down' } },
  // Neutral
  てれや: { name: 'てれや', values: {} },
  がんばりや: { name: 'がんばりや', values: {} },
  すなお: { name: 'すなお', values: {} },
  きまぐれ: { name: 'きまぐれ', values: {} },
  まじめ: { name: 'まじめ', values: {} },
} as const;

export type NatureName = keyof typeof natures;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _typecheck: Record<string, Nature> = natures;
