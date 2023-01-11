import { SpeedModifier } from '@lib/stats';

export function getSpeedModifierLabel(modifier: SpeedModifier): string {
  const { rank, item, ability, condition } = modifier;
  const labels = [];
  if (rank !== 0) {
    labels.push(`${rank > 0 ? '+' : ''}${rank}`);
  }
  switch (item) {
    case 'こだわりスカーフ':
      labels.push('スカーフ');
      break;
    case 'くろいてっきゅう':
      labels.push('てっきゅう');
      break;
  }
  if (ability) {
    labels.push(ability);
  }
  if (condition.paralysis) {
    labels.push('まひ');
  }
  if (condition.tailwind) {
    labels.push('おいかぜ');
  }
  return `(${labels.join('/')})`;
}
