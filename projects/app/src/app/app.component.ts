import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { StatsPageComponent } from './stats/stats.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <header></header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <footer>
      <app-footer></app-footer>
    </footer>
  `,
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, StatsPageComponent, FooterComponent],
})
export class AppComponent {}
