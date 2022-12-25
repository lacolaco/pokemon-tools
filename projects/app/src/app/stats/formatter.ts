import { StatValues, EV, Nature } from '@lib/model';

export function formatStats(
  pokemon: { name: string },
  level: number,
  nature: Nature,
  stats: StatValues<number>,
  evs: StatValues<EV>,
): string {
  const formatEV = (ev: EV) => (ev === 0 ? '' : `(${ev})`);
  const statsString = stats.map((stat, i) => `${stat}${formatEV(evs[i])}`).join('-');

  return `${pokemon.name} ${nature.name} ${statsString}`;
}
