import { asEV, asIV } from '@lib/stats';

export const speedPresets = {
  fastest: {
    ev: asEV(252),
    iv: asIV(31),
    nature: 'up',
  },
  fast: {
    ev: asEV(252),
    iv: asIV(31),
    nature: 'neutral',
  },
  four: {
    ev: asEV(4),
    iv: asIV(31),
    nature: 'neutral',
  },
  none: {
    ev: asEV(0),
    iv: asIV(31),
    nature: 'neutral',
  },
  slowest: {
    ev: asEV(0),
    iv: asIV(0),
    nature: 'down',
  },
} as const;

export type SpeedPresetKey = keyof typeof speedPresets;
