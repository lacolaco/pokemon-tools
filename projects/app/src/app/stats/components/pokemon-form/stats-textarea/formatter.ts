import { EV, Level, Nature, NatureValue, Stat, StatValues } from '@lib/stats';

const UNDEFINED_SYMBOL = 'x';

export function formatStats(
  pokemon: { name: string },
  level: Level,
  nature: Nature,
  stats: StatValues<Stat | null>,
  evs: StatValues<EV>,
): string {
  const formatNature = (nature: NatureValue) => (nature === 'up' ? '+' : nature === 'down' ? '-' : '');
  const formatEV = (ev: EV, nature: NatureValue) => {
    if (ev === 0 && nature === 'neutral') {
      return '';
    }
    return `(${ev || ''}${formatNature(nature)})`;
  };
  const keys = ['H', 'A', 'B', 'C', 'D', 'S'] as const;
  const statsString = keys
    .map((key) =>
      stats[key] ? `${stats[key]}${formatEV(evs[key], nature.values[key] ?? 'neutral')}` : UNDEFINED_SYMBOL,
    )
    .join('-');

  return `${pokemon.name} ${nature.name} ${statsString}`;
}
