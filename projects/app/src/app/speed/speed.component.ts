import { Component } from '@angular/core';
import { SpeedModifierFormComponent } from './modifier-form/speed-modifier-form.component';
import { SpeedComparisonTableComponent } from './speed-comparison-table/speed-comparison-table.component';
import { SpeedStatFormComponent } from './speed-stat-form/speed-stat-form.component';
import { SpeedPageState } from './speed.state';

@Component({
  selector: 'app-speed',
  standalone: true,
  imports: [SpeedStatFormComponent, SpeedModifierFormComponent, SpeedComparisonTableComponent],
  providers: [SpeedPageState],
  template: `
    <h1 class="text-xl font-bold mb-4">すばやさ比較調整ツール</h1>

    <div class="w-full flex flex-col gap-y-2 overflow-auto">
      <speed-stat-form></speed-stat-form>
      <div class="flex-auto w-full grid grid-cols-auto-1fr gap-x-2 overflow-auto">
        <speed-modifier-form class="max-h-full"></speed-modifier-form>
        <speed-comparison-table class="max-h-full flex-auto overflow-auto"></speed-comparison-table>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100%;
      }
    `,
  ],
})
export class SpeedPageComponent {}
