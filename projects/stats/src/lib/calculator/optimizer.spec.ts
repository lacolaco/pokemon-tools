import { getPokemonByName } from '@lacolaco/pokemon-data';
import { natures } from '../models/natures';
import { Stat, asLevel, asIV, asEV, asStat } from '../models/primitives';
import { StatValues } from '../models/stat-values';
import { optimizeDurability } from './optimizer';

describe('optimizeDurability', () => {
  it('ニンフィア ひかえめ C252 残り耐久', () => {
    const pokemon = getPokemonByName('ニンフィア');
    const result = optimizeDurability(
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
    const result = optimizeDurability(
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
    const result = optimizeDurability(
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
});
