import { Injectable } from '@angular/core';
import { RxState, stateful } from '@rx-angular/state';
import { shareReplay } from 'rxjs';
import { v4 } from 'uuid';
import { debug } from '../utitilites/rx';

export type PokemonStateKey = string;

type State = {
  pokemons: PokemonStateKey[];
};

@Injectable()
export class StatsState extends RxState<State> {
  readonly state$ = this.select().pipe(stateful(), debug('[change] state'), shareReplay(1));

  constructor() {
    super();

    this.set({
      pokemons: ['default'],
    });
  }

  addPokemon() {
    this.set({
      pokemons: [...this.get().pokemons, v4()],
    });
  }

  removePokemon(key: PokemonStateKey) {
    this.set({
      pokemons: this.get().pokemons.filter((k) => k !== key),
    });
  }
}
