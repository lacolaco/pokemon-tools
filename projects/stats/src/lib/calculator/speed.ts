import { asStat, Stat } from '../models/primitives';
import { getRankFactor, StatRank } from './rank';

export type SpeedModifier = {
  rank: StatRank;
  item: SpeedItem | null;
  ability: SpeedAbility | null;
  condition: SpeedCondition;
};

export function isNoopSpeedModifier(modifier: SpeedModifier): boolean {
  return (
    modifier.rank === 0 &&
    modifier.item === null &&
    modifier.ability === null &&
    !modifier.condition.paralysis &&
    !modifier.condition.tailwind
  );
}

export type SpeedItem = 'こだわりスカーフ' | 'くろいてっきゅう';

export function getSpeedItemFactor(item: SpeedItem): number {
  switch (item) {
    case 'こだわりスカーフ':
      return 1.5;
    case 'くろいてっきゅう':
      return 0.5;
    default:
      return 1;
  }
}
export type SpeedAbility =
  | 'かるわざ'
  | 'すいすい'
  | 'すなかき'
  | 'ゆきかき'
  | 'はやあし'
  | 'サーフテール'
  | 'スロースタート'
  | 'ようりょくそ';

export function getSpeedAvilityFactor(ability: SpeedAbility): number {
  switch (ability) {
    case 'かるわざ':
    case 'すいすい':
    case 'すなかき':
    case 'ゆきかき':
    case 'ようりょくそ':
    case 'サーフテール':
      return 2;
    case 'はやあし':
      return 1.5;
    case 'スロースタート':
      return 0.5;
    default:
      return 1;
  }
}

export type SpeedCondition = {
  /**
   * まひ状態
   */
  paralysis: boolean;
  /**
   * おいかぜ状態
   */
  tailwind: boolean;
};

export function getSpeedConditionFactor({ paralysis, tailwind }: SpeedCondition): number {
  const paralysisFactor = paralysis ? 0.5 : 1;
  const tailwindFactor = tailwind ? 2 : 1;
  return paralysisFactor * tailwindFactor;
}

export function modifySpeed(stat: Stat, { rank, item, ability, condition }: SpeedModifier): Stat {
  const rankModifier = getRankFactor(rank);
  const itemModifier = item ? getSpeedItemFactor(item) : 1;
  const abilityModifier = ability ? getSpeedAvilityFactor(ability) : 1;
  const conditionModifier = getSpeedConditionFactor(condition);
  return asStat(multiply(multiply(multiply(stat, rankModifier), itemModifier * abilityModifier), conditionModifier));
}

function multiply(a: number, b: number): number {
  return Math.floor(a * b);
}
