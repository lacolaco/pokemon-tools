import { Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { StatsPageComponent } from './stats/stats.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <header class="w-full z-10 shadow">
      <app-header class="container mx-auto px-2 sm:px-4"></app-header>
    </header>
    <main class="container mx-auto px-2 sm:px-4">
      <router-outlet></router-outlet>
    </main>
    <footer class="w-full">
      <app-footer class="container mx-auto px-2 sm:px-4"></app-footer>
    </footer>
  `,
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, StatsPageComponent, HeaderComponent, FooterComponent],
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
