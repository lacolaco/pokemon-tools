import { EV, EVs, Level, Nature, Stats } from '@lib/model';

export function formatStats(pokemon: { name: string }, level: Level, nature: Nature, stats: Stats, evs: EVs): string {
  const formatEV = (ev: EV) => (ev === 0 ? '' : `(${ev})`);
  const statsArray = [stats.H, stats.B, stats.A, stats.C, stats.D, stats.S];
  const evsArray = [evs.H, evs.B, evs.A, evs.C, evs.D, evs.S];
  const statsString = statsArray.map((stat, i) => `${stat}${formatEV(evsArray[i])}`).join('-');

  return `${pokemon.name} ${nature.name} ${statsString}`;
}
