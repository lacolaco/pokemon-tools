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
  const tempEVs: StatValues<EV> = [ev(0), evs[1], ev(0), evs[3], ev(0), evs[5]];
  while (sum(tempEVs) + 4 < 510) {
    const [H, , B, , D] = calcStats(level, baseStats, ivs, tempEVs, nature);
    let { dSdH, dSdB, dSdD } = getDifferentialS(H, B, D);
    // もう振れない場合は微分値を0にする
    dSdH = tempEVs[0] >= 252 ? 0 : dSdH;
    dSdB = tempEVs[2] >= 252 ? 0 : dSdB;
    dSdD = tempEVs[4] >= 252 ? 0 : dSdD;
    /**
     * - Hの寄与が最大でまだ振れるならHを振る
     * - Hに振らなかった場合、Bの寄与が最大でまだ振れるならBを振る
     * - H, Bに振らなかった場合、Dを振る
     * - Dにも振れなかったら終了
     */
    if (dSdH > dSdB && dSdH > dSdD) {
      tempEVs[0] = ev(tempEVs[0] + 4);
    } else if (dSdB > dSdD) {
      tempEVs[2] = ev(tempEVs[2] + 4);
    } else if (dSdD > 0) {
      tempEVs[4] = ev(tempEVs[4] + 4);
    } else {
      break;
    }
  }

  return tempEVs;
}

/**
 * S を H, B, D で偏微分する
 * S = (H * B * D) / (B + D)
 * dSdH = (B * D) / (B + D)
 * dSdB = (H * D^2) / (B + D)^2
 * dSdD = (H * B^2) / (B + D)^2
 */
function getDifferentialS(H: number, B: number, D: number): { dSdH: number; dSdB: number; dSdD: number } {
  return {
    dSdH: (B * D) / (B + D),
    dSdB: (H * Math.pow(D, 2)) / Math.pow(B + D, 2),
    dSdD: (H * Math.pow(B, 2)) / Math.pow(B + D, 2),
  };
}
