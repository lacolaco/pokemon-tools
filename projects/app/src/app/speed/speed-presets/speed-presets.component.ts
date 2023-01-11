import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SpeedPresetKey, speedPresets } from '../speed-presets';
import { SpeedPageState } from '../speed.state';

@Component({
  selector: 'speed-presets',
  standalone: true,
  template: `
    <div class="flex flex-row items-center gap-x-1">
      <button class="text-sm leading-none p-1" (click)="usePreset('fastest')">最速</button>
      <button class="text-sm leading-none p-1" (click)="usePreset('fast')">準速</button>
      <button class="text-sm leading-none p-1" (click)="usePreset('none')">無振</button>
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

  usePreset(preset: SpeedPresetKey) {
    const { ev, iv, nature } = speedPresets[preset];
    this.state.set({
      stats: { ev, iv, nature },
    });
  }
}
