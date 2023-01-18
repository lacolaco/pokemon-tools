import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SpeedPresetKey, speedPresets } from '../speed-presets';
import { SpeedPageState } from '../speed.state';

@Component({
  selector: 'speed-presets',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="grid grid-flow-col items-center gap-x-1">
      <button mat-stroked-button class="text-sm leading-none p-1" (click)="usePreset('fastest')">最速</button>
      <button mat-stroked-button class="text-sm leading-none p-1" (click)="usePreset('fast')">準速</button>
      <button mat-stroked-button class="text-sm leading-none p-1" (click)="usePreset('none')">無振</button>
      <button mat-stroked-button class="text-sm leading-none p-1" (click)="usePreset('slowest')">最遅</button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      button {
        padding-top: 0.5em;
        padding-bottom: 0.5em;
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
