import { Nature } from '../models/natures';
import { asEV, asStat, EV, IV, Level, Stat } from '../models/primitives';
import { StatValues } from '../models/stat-values';
import { calculateEVForHP, calculateEVForNonHP, calculateStatForHP, calculateStatForNonHP } from './stats';
import { sumOfStatValues } from './utilities';

/**
 * 総合耐久指数が最大になるように努力値を振り分ける
 * 参考: ニンフィア・カミツルギの耐久調整 ―― 総合耐久指数 \- 机上論は強い http://firefly1987.blog.fc2.com/blog-entry-5.html
 */
export function optimizeDefenseEVs(
  base: Readonly<StatValues<Stat>>,
  level: Level,
  ivs: StatValues<IV | null>,
  evs: StatValues<EV>,
  nature: Nature,
): StatValues<EV> {
  const { H: ivH, B: ivB, D: ivD } = ivs;
  if (ivH === null || ivB === null || ivD === null) {
    return evs;
  }

  const tempEVs = { ...evs, H: asEV(0), B: asEV(0), D: asEV(0) };
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const freeEV = 508 - sumOfStatValues(tempEVs);
    if (freeEV <= 0) {
      break;
    }
    const H = calculateStatForHP(base.H, level, ivH, tempEVs.H);
    const B = calculateStatForNonHP(base.B, level, ivB, tempEVs.B, nature.values.B ?? 'neutral');
    const D = calculateStatForNonHP(base.D, level, ivD, tempEVs.D, nature.values.D ?? 'neutral');

    let { dSdH, dSdB, dSdD } = getDerivatives(H, B, D);
    // dSdH, dSdB, dSdDのうち最大のステータスを+1できるかチェックする
    // +1するのに必要な努力値を逆算し、それが残りの努力値を超えていたら+1できないため偏微分を0にする
    // また、+1前後で必要な努力値が変わらない場合は上限に達しているため偏微分を0にする
    const nextEVs = {
      H: calculateEVForHP(base.H, level, ivH, asStat(H + 1)),
      B: calculateEVForNonHP(base.B, level, ivB, asStat(B + 1), nature.values.B ?? 'neutral'),
      D: calculateEVForNonHP(base.D, level, ivD, asStat(D + 1), nature.values.D ?? 'neutral'),
    };
    if (nextEVs.H === tempEVs.H || nextEVs.H - tempEVs.H > freeEV) {
      dSdH = 0;
    }
    if (nextEVs.B === tempEVs.B || nextEVs.B - tempEVs.B > freeEV) {
      dSdB = 0;
    }
    if (nextEVs.D === tempEVs.D || nextEVs.D - tempEVs.D > freeEV) {
      dSdD = 0;
    }
    // dSdH, dSdB, dSdDのうち最大のステータスを+1する
    if (dSdH > dSdB && dSdH > dSdD) {
      tempEVs.H = nextEVs.H;
    } else if (dSdB > dSdD) {
      tempEVs.B = nextEVs.B;
    } else if (dSdD > 0) {
      tempEVs.D = nextEVs.D;
    } else {
      // すべての傾きが0になっているので中断する
      break;
    }
  }

  return tempEVs;
}

/**
 * S を H, B, D で偏微分した値を返す
 * S = (H * B * D) / (B + D)
 * dSdH = (B * D) / (B + D)
 * dSdB = (H * D^2) / (B + D)^2
 * dSdD = (H * B^2) / (B + D)^2
 */
function getDerivatives(H: Stat, B: Stat, D: Stat): { dSdH: number; dSdB: number; dSdD: number } {
  return {
    dSdH: (B * D) / (B + D),
    dSdB: (H * Math.pow(D, 2)) / Math.pow(B + D, 2),
    dSdD: (H * Math.pow(B, 2)) / Math.pow(B + D, 2),
  };
}
