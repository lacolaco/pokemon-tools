import { Injectable } from '@angular/core';
import { RxState, stateful } from '@rx-angular/state';
import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { map, shareReplay } from 'rxjs';
import { v4 } from 'uuid';
import { debug } from '../utitilites/rx';

export type PokemonStateKey = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StatsChildState<T = any> = {
  serialize: () => T;
  deserialize: (serialized: T) => void;
};

type State = {
  /**
   * [key, restored state]
   */
  pokemons: [PokemonStateKey, unknown | null][];
};

@Injectable()
export class StatsState extends RxState<State> {
  private readonly childStateMap = new Map<PokemonStateKey, StatsChildState>();
  readonly state$ = this.select().pipe(
    stateful(
      map((state) => ({
        pokemons: state.pokemons.map(([key]) => key),
      })),
    ),
    debug('[change] state'),
    shareReplay(1),
  );

  constructor() {
    super();

    this.set({
      pokemons: [['default', null]],
    });
  }

  addPokemon() {
    this.set({
      pokemons: [...this.get().pokemons, [v4(), null]],
    });
  }

  removePokemon(key: PokemonStateKey) {
    this.set({
      pokemons: this.get().pokemons.filter(([k]) => k !== key),
    });
    this.childStateMap.delete(key);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerChild(key: PokemonStateKey, state: StatsChildState) {
    const { pokemons } = this.get();
    const [, serialized] = pokemons.find(([k]) => k === key) ?? [];
    if (serialized) {
      state.deserialize(serialized);
    }
    this.childStateMap.set(key, state);
  }

  serialize() {
    const { pokemons } = this.get();
    const serialized = pokemons.map(([key]) => {
      const state = this.childStateMap.get(key);
      if (!state) {
        throw new Error(`No child state for key: ${key}`);
      }
      return [key, state.serialize()];
    });
    const token = compressToBase64(JSON.stringify(serialized));
    return token;
  }

  deserialize(token: string) {
    const pokemons = JSON.parse(decompressFromBase64(token) ?? '[]');
    if (pokemons.length === 0) {
      return;
    }
    this.set({ pokemons });
  }
}
