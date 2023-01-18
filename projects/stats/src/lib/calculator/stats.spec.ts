import { getPokemonByName } from '@lacolaco/pokemon-data';
import { natures } from '../models/natures';
import { asEV, asIV, asLevel, asStat, Stat } from '../models/primitives';
import { StatValues } from '../models/stat-values';
import { calculateAllStats, calculateStatForNonHP } from './stats';

it('ガブリアス Lv50 6V 無補正 無振り', () => {
  const stats = calculateAllStats(
    getPokemonByName('ガブリアス').baseStats as StatValues<Stat>,
    asLevel(50),
    { H: asIV(31), A: asIV(31), B: asIV(31), C: asIV(31), D: asIV(31), S: asIV(31) },
    { H: asEV(0), A: asEV(0), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(0) },
    natures['きまぐれ'],
  );
  expect(stats).toEqual({
    H: asStat(183),
    A: asStat(150),
    B: asStat(115),
    C: asStat(100),
    D: asStat(105),
    S: asStat(122),
  });
});

it('マリルリ Lv50 C抜け5V いじっぱり HA252S4', () => {
  const stats = calculateAllStats(
    getPokemonByName('マリルリ').baseStats as StatValues<Stat>,
    asLevel(50),
    { H: asIV(31), A: asIV(31), B: asIV(31), C: null, D: asIV(31), S: asIV(31) },
    { H: asEV(252), A: asEV(252), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(4) },
    natures['いじっぱり'],
  );
  expect(stats).toEqual({
    H: asStat(207),
    A: asStat(112),
    B: asStat(100),
    C: null,
    D: asStat(100),
    S: asStat(71),
  });
});

describe('下降補正', () => {
  [
    [0, 90],
    [4, 90],
    [8, 90],
    [12, 91],
  ].forEach(([ev, stat]) => {
    it(`ガブリアス Lv50 C下降補正 ${ev} => ${stat}`, () => {
      const result = calculateStatForNonHP(
        getPokemonByName('ガブリアス').baseStats.C as Stat,
        asLevel(50),
        asIV(31),
        asEV(ev),
        'down',
      );
      expect(result).toBe(asStat(stat));
    });
  });
});
