import { ev, EV, IV, Nature, StatValues } from '@lib/model';
import { calcStats } from './stats';
import { sum } from './utilities';

/**
 * 総合耐久指数が最大になるように努力値を振り分ける
 * 参考: ニンフィア・カミツルギの耐久調整 ―― 総合耐久指数 \- 机上論は強い http://firefly1987.blog.fc2.com/blog-entry-5.html
 */
export function optimizeDurability(
  baseStats: Readonly<StatValues<number>>,
  level: number,
  nature: Nature,
  ivs: StatValues<IV>,
  evs: StatValues<EV>,
): StatValues<EV> {
  const optimizedEVs: StatValues<EV> = [ev(0), evs[1], ev(0), evs[3], ev(0), evs[5]];
  while (sum(optimizedEVs) < 508) {
    const [H, , B, , D] = calcStats(baseStats, level, nature, ivs, optimizedEVs);
    let { dSdH, dSdB, dSdD } = getDerivatives(H, B, D);
    // もう振れない場合は微分値を0にする
    dSdH = optimizedEVs[0] >= 252 ? 0 : dSdH;
    dSdB = optimizedEVs[2] >= 252 ? 0 : dSdB;
    dSdD = optimizedEVs[4] >= 252 ? 0 : dSdD;
    // dSdH, dSdB, dSdDのうち最大のパラメータに+4する
    // すべての傾きが0になったら中断する
    if (dSdH > dSdB && dSdH > dSdD) {
      optimizedEVs[0] = ev(optimizedEVs[0] + 4);
    } else if (dSdB > dSdD) {
      optimizedEVs[2] = ev(optimizedEVs[2] + 4);
    } else if (dSdD > 0) {
      optimizedEVs[4] = ev(optimizedEVs[4] + 4);
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
function getDerivatives(H: number, B: number, D: number): { dSdH: number; dSdB: number; dSdD: number } {
  return {
    dSdH: (B * D) / (B + D),
    dSdB: (H * Math.pow(D, 2)) / Math.pow(B + D, 2),
    dSdD: (H * Math.pow(B, 2)) / Math.pow(B + D, 2),
  };
}
