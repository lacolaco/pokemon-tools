import { inject } from '@angular/core';
import { ScreenTrackingService } from '@angular/fire/analytics';
import { TraceService } from '@sentry/angular-ivy';
import { PokemonData } from './shared/pokemon-data';

export const appInitializer = () => {
  // start performance monitoring
  inject(TraceService);
  // start screen tracking
  inject(ScreenTrackingService);
  const pokemonData = inject(PokemonData);

  return async () => {
    await pokemonData.initialize();
  };
};
