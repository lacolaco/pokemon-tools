import { Component } from '@angular/core';
import { SpeedStatFormComponent } from './speed-stat-form/speed-stat-form.component';
import { SpeedPageState } from './speed.state';

@Component({
  selector: 'app-speed',
  standalone: true,
  imports: [SpeedStatFormComponent],
  providers: [SpeedPageState],
  template: `
    <h1 class="text-xl font-bold mb-4">すばやさ調整</h1>

    <div class="w-full flex flex-col gap-y-2">
      <speed-stat-form></speed-stat-form>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SpeedPageComponent {}
