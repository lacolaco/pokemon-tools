import { asEV, EV, IV, Level, Nature, Stat, StatValues } from '@lib/model';
import { calculateAllStats } from './stats';
import { sumOfStatValues } from './utilities';

/**
 * 総合耐久指数が最大になるように努力値を振り分ける
 * 参考: ニンフィア・カミツルギの耐久調整 ―― 総合耐久指数 \- 机上論は強い http://firefly1987.blog.fc2.com/blog-entry-5.html
 */
export function optimizeDurability(
  base: Readonly<StatValues<Stat>>,
  level: Level,
  nature: Nature,
  ivs: StatValues<IV | null>,
  evs: StatValues<EV>,
): StatValues<EV> {
  const optimizedEVs = { ...evs, H: asEV(0), B: asEV(0), D: asEV(0) };
  while (sumOfStatValues(optimizedEVs) < 508) {
    const { H, B, D } = calculateAllStats(base, level, ivs, optimizedEVs, nature);
    if (H === null || B === null || D === null) {
      return evs;
    }
    let { dSdH, dSdB, dSdD } = getDerivatives(H, B, D);
    // もう振れない場合は微分値を0にする
    dSdH = optimizedEVs.H >= 252 ? 0 : dSdH;
    dSdB = optimizedEVs.B >= 252 ? 0 : dSdB;
    dSdD = optimizedEVs.D >= 252 ? 0 : dSdD;
    // dSdH, dSdB, dSdDのうち最大のパラメータに+4する
    // すべての傾きが0になったら中断する
    if (dSdH > dSdB && dSdH > dSdD) {
      optimizedEVs.H = asEV(optimizedEVs.H + 4);
    } else if (dSdB > dSdD) {
      optimizedEVs.B = asEV(optimizedEVs.B + 4);
    } else if (dSdD > 0) {
      optimizedEVs.D = asEV(optimizedEVs.D + 4);
    } else {
      break;
    }
  }

  return optimizedEVs;
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
