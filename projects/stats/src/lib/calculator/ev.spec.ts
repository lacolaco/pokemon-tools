import { getPokemonByName } from '@lacolaco/pokemon-data';
import { natures } from '../models/natures';
import { Stat, asLevel, asIV, asStat, asEV } from '../models/primitives';
import { StatValues } from '../models/stat-values';
import {
  calculateAllEVs,
  calculateEVForNonHP,
  calculateDecrementedEVForHP,
  calculateDecrementedEVForNonHP,
  calculateIncrementedEVForHP,
  calculateIncrementedEVForNonHP,
} from './ev';

it('ガブリアス Lv50 まじめ 183-150-115-100-105-122', () => {
  const evs = calculateAllEVs(
    getPokemonByName('ガブリアス').baseStats as StatValues<Stat>,
    asLevel(50),
    { H: asIV(31), A: asIV(31), B: asIV(31), C: asIV(31), D: asIV(31), S: asIV(31) },
    { H: asStat(183), A: asStat(150), B: asStat(115), C: asStat(100), D: asStat(105), S: asStat(122) },
    natures['きまぐれ'],
  );
  expect(evs).toEqual({
    H: asEV(0),
    A: asEV(0),
    B: asEV(0),
    C: asEV(0),
    D: asEV(0),
    S: asEV(0),
  });
});

[
  { stat: 200, ev: 252 },
  { stat: 199, ev: 244 },
  { stat: 198, ev: 236 },
  { stat: 197, ev: 236 },
  { stat: 196, ev: 228 },
].forEach(({ stat, ev }) => {
  it(`ガブリアス Lv50 A補正 stat=${stat} ev=${ev}`, () => {
    const result = calculateEVForNonHP(
      getPokemonByName('ガブリアス').baseStats.A as Stat,
      asLevel(50),
      asIV(31),
      asStat(stat),
      'up',
    );
    expect(result as number).toEqual(ev);
  });
});

it('マリルリ Lv50 いじっぱり 207(252)-112(252)-x-72-100-71(4)', () => {
  const evs = calculateAllEVs(
    getPokemonByName('マリルリ').baseStats as StatValues<Stat>,
    asLevel(50),
    { H: asIV(31), A: asIV(31), B: asIV(31), C: null, D: asIV(31), S: asIV(31) },
    { H: asStat(207), A: asStat(112), B: asStat(100), C: null, D: asStat(100), S: asStat(71) },
    natures['いじっぱり'],
  );
  expect(evs).toEqual({
    H: asEV(252),
    A: asEV(252),
    B: asEV(0),
    C: asEV(0),
    D: asEV(0),
    S: asEV(4),
  });
});

describe('calculateIncrementedEV', () => {
  it('ガブリアス Lv50 H 0 -> 4', () => {
    const result = calculateIncrementedEVForHP(
      getPokemonByName('ガブリアス').baseStats.H as Stat,
      asLevel(50),
      asIV(31),
      asEV(0),
    );
    expect(result as number).toEqual(4);
  });

  it('ガブリアス Lv50 A上昇補正 0 -> 4', () => {
    const result = calculateIncrementedEVForNonHP(
      getPokemonByName('ガブリアス').baseStats.A as Stat,
      asLevel(50),
      asIV(31),
      asEV(0),
      'up',
    );
    expect(result as number).toEqual(4);
  });

  it('ガブリアス Lv50 A上昇補正 4 -> 12', () => {
    const result = calculateIncrementedEVForNonHP(
      getPokemonByName('ガブリアス').baseStats.A as Stat,
      asLevel(50),
      asIV(31),
      asEV(4),
      'up',
    );
    expect(result as number).toEqual(12);
  });

  it('ガブリアス Lv50 C下降補正 90(0) -> 91(12)', () => {
    const result = calculateIncrementedEVForNonHP(
      getPokemonByName('ガブリアス').baseStats.C as Stat,
      asLevel(50),
      asIV(31),
      asEV(0),
      'down',
    );
    expect(result as number).toEqual(12);
  });
});

describe('calculateDecrementedEV', () => {
  it('ガブリアス Lv50 H 4 -> 0', () => {
    const result = calculateDecrementedEVForHP(
      getPokemonByName('ガブリアス').baseStats.H as Stat,
      asLevel(50),
      asIV(31),
      asEV(4),
    );
    expect(result as number).toEqual(0);
  });

  it('ガブリアス Lv50 A上昇補正 4 -> 0', () => {
    const result = calculateDecrementedEVForNonHP(
      getPokemonByName('ガブリアス').baseStats.A as Stat,
      asLevel(50),
      asIV(31),
      asEV(4),
      'up',
    );
    expect(result as number).toEqual(0);
  });

  it('ガブリアス Lv50 A上昇補正 12 -> 4', () => {
    const result = calculateDecrementedEVForNonHP(
      getPokemonByName('ガブリアス').baseStats.A as Stat,
      asLevel(50),
      asIV(31),
      asEV(12),
      'up',
    );
    expect(result as number).toEqual(4);
  });

  it('ガブリアス Lv50 A上昇補正 198(236) -> 196(228)', () => {
    const result = calculateDecrementedEVForNonHP(
      getPokemonByName('ガブリアス').baseStats.A as Stat,
      asLevel(50),
      asIV(31),
      asEV(236),
      'up',
    );
    expect(result as number).toEqual(228);
  });

  it('ガブリアス Lv50 C下降補正 91(12) -> 90(0)', () => {
    const result = calculateDecrementedEVForNonHP(
      getPokemonByName('ガブリアス').baseStats.C as Stat,
      asLevel(50),
      asIV(31),
      asEV(12),
      'down',
    );
    expect(result as number).toEqual(0);
  });
});
