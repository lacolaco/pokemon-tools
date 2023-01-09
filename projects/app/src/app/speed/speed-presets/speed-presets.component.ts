import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { asEV, asIV } from '@lib/stats';
import { SpeedPageState } from '../speed.state';

const presets = {
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

type PresetKey = keyof typeof presets;

@Component({
  selector: 'speed-presets',
  standalone: true,
  template: `
    <div class="flex flex-row items-center gap-x-1">
      <button class="text-sm leading-none p-1" (click)="usePreset('fastest')">最速</button>
      <button class="text-sm leading-none p-1" (click)="usePreset('fast')">準速</button>
      <button class="text-sm leading-none p-1" (click)="usePreset('four')">4振り</button>
      <button class="text-sm leading-none p-1" (click)="usePreset('none')">無振り</button>
      <button class="text-sm leading-none p-1" (click)="usePreset('slowest')">最遅</button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeedPresetsComponent {
  private readonly state = inject(SpeedPageState);

  usePreset(preset: PresetKey) {
    const { ev, iv, nature } = presets[preset];
    this.state.set({
      stats: { ev, iv, nature },
    });
  }
}
