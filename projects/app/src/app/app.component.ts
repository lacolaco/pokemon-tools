import { Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="grid grid-rows-header-main min-h-[100dvh] w-[100vw]">
      <header class="w-full h-16 z-10 shadow bg-gradation-sv text-white">
        <app-header class="container mx-auto px-2 sm:px-4"></app-header>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
    <footer class="w-full">
      <app-footer class="container mx-auto px-2 sm:px-4"></app-footer>
    </footer>
  `,
  host: {
    class: 'block',
  },
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
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
