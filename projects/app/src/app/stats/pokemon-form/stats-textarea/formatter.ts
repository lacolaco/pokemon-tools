import { EV, Level, Nature, Stat, StatValues } from '@lib/stats';

const UNDEFINED_SYMBOL = 'x';

export function formatStats(
  pokemon: { name: string },
  level: Level,
  nature: Nature,
  stats: StatValues<Stat | null>,
  evs: StatValues<EV>,
): string {
  const formatEV = (ev: EV) => (ev === 0 ? '' : `(${ev})`);
  const statsArray = [stats.H, stats.A, stats.B, stats.C, stats.D, stats.S];
  const evsArray = [evs.H, evs.A, evs.B, evs.C, evs.D, evs.S];
  const statsString = statsArray.map((stat, i) => `${stat ?? UNDEFINED_SYMBOL}${formatEV(evsArray[i])}`).join('-');

  return `${pokemon.name} ${nature.name} ${statsString}`;
}
