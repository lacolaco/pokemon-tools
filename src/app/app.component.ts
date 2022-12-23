import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StatsComponent } from './stats/stats.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: ` <app-stats></app-stats> `,
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, StatsComponent],
})
export class AppComponent {
  title = 'pokemon-tool';
}
