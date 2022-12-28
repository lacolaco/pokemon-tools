import { naturesMap } from '@lib/data';
import { ev, iv, stat } from '@lib/model';
import { calcEVs, calcStats, createNatureValues } from './stats';

it('ガブリアス Lv50 6V 無補正 無振り', () => {
  const stats = calcStats(
    [108, 130, 95, 80, 85, 102],
    50,
    naturesMap['きまぐれ'],
    [iv(31), iv(31), iv(31), iv(31), iv(31), iv(31)],
    [ev(0), ev(0), ev(0), ev(0), ev(0), ev(0)],
  );
  expect(stats as number[]).toEqual([183, 150, 115, 100, 105, 122]);
});

it('マリルリ Lv50 6V いじっぱり HA252S4', () => {
  const stats = calcStats(
    [100, 50, 80, 60, 80, 50],
    50,
    naturesMap['いじっぱり'],
    [iv(31), iv(31), iv(31), iv(31), iv(31), iv(31)],
    [ev(252), ev(252), ev(0), ev(0), ev(0), ev(4)],
  );
  expect(stats as number[]).toEqual([207, 112, 100, 72, 100, 71]);
});

it('ガブリアス Lv50 まじめ 183-150-115-100-105-122', () => {
  const stats = calcEVs(
    [108, 130, 95, 80, 85, 102],
    50,
    naturesMap['きまぐれ'],
    [iv(31), iv(31), iv(31), iv(31), iv(31), iv(31)],
    [stat(183), stat(150), stat(115), stat(100), stat(105), stat(122)],
  );
  expect(stats as number[]).toEqual([0, 0, 0, 0, 0, 0]);
});

it('マリルリ Lv50 いじっぱり 207(252)-112(252)-100-72-100-71(4)', () => {
  const evs = calcEVs(
    [100, 50, 80, 60, 80, 50],
    50,
    naturesMap['いじっぱり'],
    [iv(31), iv(31), iv(31), iv(31), iv(31), iv(31)],
    [stat(207), stat(112), stat(100), stat(72), stat(100), stat(71)],
  );
  expect(evs as number[]).toEqual([252, 252, 0, 0, 0, 4]);
});

it('いじっぱり', () => {
  expect(createNatureValues(naturesMap['いじっぱり'])).toEqual([1, 1.1, 1, 0.9, 1, 1]);
});
