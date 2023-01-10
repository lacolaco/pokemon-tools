import { inject, Injectable } from '@angular/core';
import type { Pokemon } from '@lacolaco/pokemon-data';
import {
  asEV,
  asIV,
  asLevel,
  asStat,
  calculateEVForNonHP,
  calculateStatForNonHP,
  EV,
  IV,
  Level,
  NatureValue,
  Stat,
} from '@lib/stats';
import { RxState, stateful } from '@rx-angular/state';
import { combineLatest, distinctUntilChanged, map, Observable, shareReplay } from 'rxjs';
import { PokemonData } from '../shared/pokemon-data';
import { debug, filterNonNullable } from '../utitilites/rx';

type State = {
  pokemon: Pokemon | null;
  level: Level;
  stats: {
    iv: IV;
    ev: EV;
    nature: NatureValue;
  };
};

@Injectable()
export class SpeedPageState extends RxState<State> {
  private readonly pokemonData = inject(PokemonData);

  private readonly stat$: Observable<Stat> = combineLatest([
    this.select('pokemon').pipe(stateful(debug('pokemon'), filterNonNullable())),
    this.select('level').pipe(stateful(debug('level'))),
    this.select('stats').pipe(stateful(debug('stats'))),
  ]).pipe(
    map(([pokemon, level, stats]) => {
      return calculateStatForNonHP(asStat(pokemon.baseStats.S), level, stats.iv, stats.ev, stats.nature);
    }),
    distinctUntilChanged(),
    debug('stat'),
    shareReplay(1),
  );

  readonly state$ = combineLatest([this.stat$]).pipe(
    map(([stat]) => {
      const { pokemon, level, stats } = this.get();
      return { pokemon, level, stats: { ...stats, stat } };
    }),
    debug('state'),
    shareReplay(1),
  );

  constructor() {
    super();

    this.resetPokemon(this.pokemonData.getPokemonByName('ガブリアス'));
  }

  resetPokemon(pokemon: Pokemon) {
    this.set({ pokemon, level: asLevel(50), stats: { iv: asIV(31), ev: asEV(252), nature: 'up' } });
  }

  calculateEV(stat: Stat) {
    const {
      pokemon,
      level,
      stats: { iv, nature },
    } = this.get();
    if (pokemon) {
      this.set((state) => ({
        ...state,
        stats: { ...state.stats, ev: calculateEVForNonHP(pokemon.baseStats.S as Stat, level, iv, stat, nature) },
      }));
    }
  }
}
