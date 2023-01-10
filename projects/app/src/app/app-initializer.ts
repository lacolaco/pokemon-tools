import { inject } from '@angular/core';
import { ScreenTrackingService } from '@angular/fire/analytics';
import { Performance } from '@angular/fire/performance';
import { PokemonData } from './shared/pokemon-data';

export const appInitializer = () => {
  // start performance monitoring
  inject(Performance);
  // start screen tracking
  inject(ScreenTrackingService);
  const pokemonData = inject(PokemonData);

  return async () => {
    await pokemonData.initialize();
  };
};
