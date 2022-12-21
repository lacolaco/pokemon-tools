import { calcStats, IV, EV, NV, calcEVs } from './stats';

it('ガブリアス Lv50 6V 無補正 無振り', () => {
  const stats = calcStats(
    50,
    [108, 130, 95, 80, 85, 102],
    [IV.parse(31), IV.parse(31), IV.parse(31), IV.parse(31), IV.parse(31), IV.parse(31)],
    [EV.parse(0), EV.parse(0), EV.parse(0), EV.parse(0), EV.parse(0), EV.parse(0)],
    [1, NV.parse(1), NV.parse(1), NV.parse(1), NV.parse(1), NV.parse(1)],
  );
  expect(stats).toEqual([183, 150, 115, 100, 105, 122]);
});

it('マリルリ Lv50 6V いじっぱり HA252S4', () => {
  const stats = calcStats(
    50,
    [100, 50, 80, 60, 80, 50],
    [IV.parse(31), IV.parse(31), IV.parse(31), IV.parse(31), IV.parse(31), IV.parse(31)],
    [EV.parse(252), EV.parse(252), EV.parse(0), EV.parse(0), EV.parse(0), EV.parse(4)],
    [1, NV.parse(1.1), NV.parse(1), NV.parse(0.9), NV.parse(1), NV.parse(1)],
  );
  expect(stats).toEqual([207, 112, 100, 72, 100, 71]);
});

it('ガブリアス Lv50 まじめ 183-150-115-100-105-122', () => {
  const stats = calcEVs(
    50,
    [183, 150, 115, 100, 105, 122],
    [108, 130, 95, 80, 85, 102],
    [IV.parse(31), IV.parse(31), IV.parse(31), IV.parse(31), IV.parse(31), IV.parse(31)],
    [1, NV.parse(1), NV.parse(1), NV.parse(1), NV.parse(1), NV.parse(1)],
  );
  expect(stats).toEqual([0, 0, 0, 0, 0, 0]);
});

it('マリルリ Lv50 いじっぱり 207(252)-112(252)-100-72-100-71(4)', () => {
  const ev = calcEVs(
    50,
    [207, 112, 100, 72, 100, 71],
    [100, 50, 80, 60, 80, 50],
    [IV.parse(31), IV.parse(31), IV.parse(31), IV.parse(31), IV.parse(31), IV.parse(31)],
    [1, NV.parse(1.1), NV.parse(1), NV.parse(0.9), NV.parse(1), NV.parse(1)],
  );
  expect(ev).toEqual([252, 252, 0, 0, 0, 4]);
});
