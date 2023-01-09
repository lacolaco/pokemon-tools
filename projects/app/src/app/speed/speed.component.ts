import { Component } from '@angular/core';
import { SpeedComparisonTableComponent } from './speed-comparison-table/speed-comparison-table.component';
import { SpeedStatFormComponent } from './speed-stat-form/speed-stat-form.component';
import { SpeedPageState } from './speed.state';

@Component({
  selector: 'app-speed',
  standalone: true,
  imports: [SpeedStatFormComponent, SpeedComparisonTableComponent],
  providers: [SpeedPageState],
  template: `
    <h1 class="text-xl font-bold mb-4">すばやさ調整</h1>

    <div class="w-full flex flex-col gap-y-2 overflow-auto">
      <speed-stat-form></speed-stat-form>
      <speed-comparison-table class="flex-auto overflow-auto"></speed-comparison-table>
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
