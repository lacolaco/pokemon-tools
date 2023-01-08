import { getPokemons } from '@lacolaco/pokemon-data';
import { naturesMap } from '@lib/data';
import { asEV, asIV, asLevel, asStat, Stats } from '@lib/model';
import { calculateEVs, calculateStats } from './stats';

const pokemons = getPokemons();

it('ガブリアス Lv50 6V 無補正 無振り', () => {
  const stats = calculateStats(
    pokemons['ガブリアス'].baseStats as Stats,
    asLevel(50),
    naturesMap['きまぐれ'],
    { H: asIV(31), A: asIV(31), B: asIV(31), C: asIV(31), D: asIV(31), S: asIV(31) },
    { H: asEV(0), A: asEV(0), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(0) },
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
  const stats = calculateStats(
    pokemons['マリルリ'].baseStats as Stats,
    asLevel(50),
    naturesMap['いじっぱり'],
    { H: asIV(31), A: asIV(31), B: asIV(31), C: asIV(null), D: asIV(31), S: asIV(31) },
    { H: asEV(252), A: asEV(252), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(4) },
  );
  expect(stats).toEqual({
    H: asStat(207),
    A: asStat(112),
    B: asStat(100),
    C: asStat(null),
    D: asStat(100),
    S: asStat(71),
  });
});

it('ガブリアス Lv50 まじめ 183-150-115-100-105-122', () => {
  const evs = calculateEVs(
    pokemons['ガブリアス'].baseStats as Stats,
    asLevel(50),
    naturesMap['きまぐれ'],
    { H: asIV(31), A: asIV(31), B: asIV(31), C: asIV(31), D: asIV(31), S: asIV(31) },
    { H: asStat(183), A: asStat(150), B: asStat(115), C: asStat(100), D: asStat(105), S: asStat(122) },
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

it('マリルリ Lv50 いじっぱり 207(252)-112(252)-x-72-100-71(4)', () => {
  const evs = calculateEVs(
    pokemons['マリルリ'].baseStats as Stats,
    asLevel(50),
    naturesMap['いじっぱり'],
    { H: asIV(31), A: asIV(31), B: asIV(31), C: asIV(null), D: asIV(31), S: asIV(31) },
    { H: asStat(207), A: asStat(112), B: asStat(100), C: asStat(null), D: asStat(100), S: asStat(71) },
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
