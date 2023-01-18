import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StatsFormComponent } from './stats-form/stats-form.component';
import { StatsTextareaComponent } from './stats-textarea/stats-textarea.component';
import { StatsState } from './stats.state';

@Component({
  selector: 'app-stats',
  standalone: true,
  providers: [StatsState],
  template: `
    <h1 class="text-xl font-bold mb-4">ステータス計算ツール</h1>

    <div class="w-full flex flex-col gap-y-2 text-sm">
      <app-stats-form class="w-full"></app-stats-form>
      <app-stats-textarea class="w-full"></app-stats-textarea>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [CommonModule, StatsFormComponent, StatsTextareaComponent],
})
export class StatsPageComponent {}
