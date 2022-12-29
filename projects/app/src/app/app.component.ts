import { Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
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
export class AppComponent implements OnInit {
  readonly loc = inject(Location);
  readonly meta = inject(Meta);

  ngOnInit(): void {
    this.loc.onUrlChange(() => {
      this.meta.updateTag({ name: 'og:title', content: document.title });
      this.meta.updateTag({ property: 'og:url', content: location.href });
    });
  }
}
