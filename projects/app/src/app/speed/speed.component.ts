import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeedPageState } from './speed.state';

@Component({
  selector: 'app-speed',
  standalone: true,
  imports: [CommonModule],
  providers: [SpeedPageState],
  template: `
    <h1 class="text-xl font-bold">すばやさ比較表</h1>

    <div class="w-full flex flex-col gap-y-2"></div>
  `,
  styleUrls: ['./speed.component.scss'],
})
export class SpeedPageComponent {}
