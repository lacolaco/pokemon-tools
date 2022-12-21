import { ev, iv, nature } from './models';
import { calcEVs, calcStats, createNatureValues } from './stats';

it('ガブリアス Lv50 6V 無補正 無振り', () => {
  const stats = calcStats(
    50,
    [108, 130, 95, 80, 85, 102],
    [iv(31), iv(31), iv(31), iv(31), iv(31), iv(31)],
    [ev(0), ev(0), ev(0), ev(0), ev(0), ev(0)],
    null,
  );
  expect(stats).toEqual([183, 150, 115, 100, 105, 122]);
});

it('マリルリ Lv50 6V いじっぱり HA252S4', () => {
  const stats = calcStats(
    50,
    [100, 50, 80, 60, 80, 50],
    [iv(31), iv(31), iv(31), iv(31), iv(31), iv(31)],
    [ev(252), ev(252), ev(0), ev(0), ev(0), ev(4)],
    nature('A', 'C'),
  );
  expect(stats).toEqual([207, 112, 100, 72, 100, 71]);
});

it('ガブリアス Lv50 まじめ 183-150-115-100-105-122', () => {
  const stats = calcEVs(
    50,
    [183, 150, 115, 100, 105, 122],
    [108, 130, 95, 80, 85, 102],
    [iv(31), iv(31), iv(31), iv(31), iv(31), iv(31)],
    null,
  );
  expect(stats as number[]).toEqual([0, 0, 0, 0, 0, 0]);
});

it('マリルリ Lv50 いじっぱり 207(252)-112(252)-100-72-100-71(4)', () => {
  const evs = calcEVs(
    50,
    [207, 112, 100, 72, 100, 71],
    [100, 50, 80, 60, 80, 50],
    [iv(31), iv(31), iv(31), iv(31), iv(31), iv(31)],
    nature('A', 'C'),
  );
  expect(evs as number[]).toEqual([252, 252, 0, 0, 0, 4]);
});

it('いじっぱり', () => {
  expect(createNatureValues(nature('A', 'C'))).toEqual([1, 1.1, 1, 0.9, 1, 1]);
});
