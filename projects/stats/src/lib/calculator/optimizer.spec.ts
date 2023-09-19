import { getPokemonByName } from '@lacolaco/pokemon-data';
import { natures } from '../models/natures';
import { Stat, asLevel, asIV, asEV, asStat } from '../models/primitives';
import { StatValues } from '../models/stat-values';
import { optimizeDefenseEVs } from './optimizer';

describe('optimizeDefenseEVs', () => {
  it('ニンフィア ひかえめ C252 残り耐久', () => {
    const pokemon = getPokemonByName('ニンフィア');
    const result = optimizeDefenseEVs(
      pokemon.baseStats as StatValues<Stat>,
      asLevel(50),
      { H: asIV(31), A: asIV(31), B: asIV(31), C: asIV(31), D: asIV(31), S: asIV(31) },
      { H: asEV(0), A: asEV(0), B: asEV(0), C: asEV(252), D: asEV(0), S: asEV(0) },
      natures['ひかえめ'],
    );

    expect(result).toEqual({
      H: asEV(84),
      A: asEV(0),
      B: asEV(172),
      C: asEV(252),
      D: asEV(0),
      S: asEV(0),
    });
  });

  it('カミツルギ ようき A252 残り耐久', () => {
    const result = optimizeDefenseEVs(
      { H: asStat(59), A: asStat(181), B: asStat(131), C: asStat(59), D: asStat(31), S: asStat(109) },
      asLevel(50),
      { H: asIV(31), A: asIV(31), B: asIV(31), C: asIV(31), D: asIV(31), S: asIV(31) },
      { H: asEV(0), A: asEV(252), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(0) },
      natures['ようき'],
    );
    expect(result).toEqual({
      H: asEV(4),
      A: asEV(252),
      B: asEV(0),
      C: asEV(0),
      D: asEV(252),
      S: asEV(0),
    });
  });

  it('ドリュウズ ようき A252 S4 残り耐久', () => {
    const result = optimizeDefenseEVs(
      { H: asStat(110), A: asStat(135), B: asStat(60), C: asStat(50), D: asStat(65), S: asStat(88) },
      asLevel(50),
      { H: asIV(31), A: asIV(31), B: asIV(31), C: asIV(31), D: asIV(31), S: asIV(31) },
      { H: asEV(0), A: asEV(252), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(4) },
      natures['ようき'],
    );
    expect(result).toEqual({
      H: asEV(44),
      A: asEV(252),
      B: asEV(124),
      C: asEV(0),
      D: asEV(84),
      S: asEV(4),
    });
  });

  it('コノヨザル いじっぱり 201(124)-165(116)-104(28)-63-111(4)-140(236)', () => {
    const result = optimizeDefenseEVs(
      getPokemonByName('コノヨザル').baseStats as StatValues<Stat>,
      asLevel(50),
      { H: asIV(31), A: asIV(31), B: asIV(31), C: asIV(31), D: asIV(31), S: asIV(31) },
      { H: asEV(0), A: asEV(116), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(236) },
      natures['いじっぱり'],
    );
    expect(result).toEqual({
      H: asEV(124),
      A: asEV(116),
      B: asEV(28),
      C: asEV(0),
      D: asEV(4),
      S: asEV(236),
    });
  });

  it('オーガポン いじっぱり 171(124)-176(116)-105(4)-72-117(4)-158(220)', () => {
    const result = optimizeDefenseEVs(
      getPokemonByName('オーガポン').baseStats as StatValues<Stat>,
      asLevel(50),
      { H: asIV(31), A: asIV(31), B: asIV(31), C: asIV(31), D: asIV(31), S: asIV(31) },
      { H: asEV(0), A: asEV(156), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(220) },
      natures['いじっぱり'],
    );
    expect(result).toEqual({
      H: asEV(124),
      A: asEV(156),
      B: asEV(4),
      C: asEV(0),
      D: asEV(4),
      S: asEV(220),
    });
  });
});
