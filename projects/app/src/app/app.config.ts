import { ApplicationConfig, ErrorHandler, NgZone, inject } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NavigationEnd, Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { TraceService, createErrorHandler } from '@sentry/angular-ivy';
import { provideAppInitializer } from './app-initializer';
import { routes } from './app-routing';
import { PokemonData } from './shared/pokemon-data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: ErrorHandler,
      useValue: createErrorHandler(),
    },
    TraceService,
    provideAppInitializer(() => {
      // start performance monitoring
      inject(TraceService);
    }),
    provideAppInitializer(() => {
      const ngZone = inject(NgZone);
      const router = inject(Router);
      router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          ngZone.runOutsideAngular(() => {
            // wait for the next tick to ensure the title is updated
            setTimeout(() => {
              gtag('event', 'page_view', {
                page_title: document.title,
                page_location: document.location.href,
              });
            }, 0);
          });
        }
      });
    }),
    provideAppInitializer(async () => {
      const pokemonData = inject(PokemonData);
      await pokemonData.initialize();
    }),
  ],
};
