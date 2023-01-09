export type StatRank = -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function getRankFactor(rank: StatRank): number {
  if (rank === 0) {
    return 1;
  }
  if (rank > 0) {
    return (2 + rank) / 2;
  } else {
    return 2 / (2 + Math.abs(rank));
  }
}
