import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { StatsComponent } from './stats/stats.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <header></header>
    <main>
      <app-stats></app-stats>
    </main>
    <footer>
      <app-footer></app-footer>
    </footer>
  `,
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, StatsComponent, FooterComponent],
})
export class AppComponent {}
