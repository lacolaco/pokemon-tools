import { naturesMap, pokemonsMap } from '@lib/data';
import { ev, iv } from '@lib/model';
import { optimizeDurability } from './optimizer';

describe('optimizeDurability', () => {
  it('ニンフィア ひかえめ C252 残り耐久', () => {
    const pokemon = pokemonsMap['ニンフィア'];
    const result = optimizeDurability(
      pokemon.baseStats,
      50,
      naturesMap['ひかえめ'],
      [iv(31), iv(31), iv(31), iv(31), iv(31), iv(31)],
      [ev(0), ev(0), ev(0), ev(252), ev(0), ev(0)],
    );

    expect(result as number[]).toEqual([84, 0, 172, 252, 0, 0]);
  });

  it('カミツルギ ようき A252 残り耐久', () => {
    const result = optimizeDurability(
      [59, 181, 131, 59, 31, 109],
      50,
      naturesMap['ようき'],
      [iv(31), iv(31), iv(31), iv(31), iv(31), iv(31)],
      [ev(0), ev(252), ev(0), ev(0), ev(0), ev(0)],
    );

    expect(result as number[]).toEqual([4, 252, 0, 0, 252, 0]);
  });

  it('ドリュウズ ようき A252 S4 残り耐久', () => {
    const result = optimizeDurability(
      [110, 135, 60, 50, 65, 88],
      50,
      naturesMap['ようき'],
      [iv(31), iv(31), iv(31), iv(31), iv(31), iv(31)],
      [ev(0), ev(252), ev(0), ev(0), ev(0), ev(4)],
    );

    expect(result as number[]).toEqual([44, 252, 124, 0, 84, 4]);
  });
});
