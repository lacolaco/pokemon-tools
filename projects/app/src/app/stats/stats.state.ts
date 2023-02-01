import { inject, Injectable } from '@angular/core';
import type { Pokemon } from '@lacolaco/pokemon-data';
import { RxState, stateful } from '@rx-angular/state';
import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { combineLatest, distinctUntilChanged, map, shareReplay } from 'rxjs';
import { PokemonData } from '../shared/pokemon-data';
import { debug, filterNonNullable } from '../shared/utitilites/rx';
import {
  clonePokemonState,
  comparePokemonState,
  createPokemonState,
  deserializePokemonState,
  PokemonState,
  PokemonStateJSON,
  serializePokemonState,
} from './models/pokemon-state';

type State = {
  pokemons: PokemonState[];
};

@Injectable()
export class StatsState extends RxState<State> {
  private readonly pokemonData = inject(PokemonData);
  readonly state$ = combineLatest([this.select('pokemons').pipe(stateful())]).pipe(
    map(([pokemons]) => ({ pokemons })),
    distinctUntilChanged(),
    debug('[change] state'),
    shareReplay(1),
  );

  initialize() {
    this.set({
      pokemons: [createPokemonState(this.getDefaultPokemon())],
    });
  }

  selectByIndex(index: number) {
    return this.state$.pipe(
      stateful(
        map((state) => state.pokemons[index]),
        filterNonNullable(),
        distinctUntilChanged(comparePokemonState),
        debug(`[change] pokemon ${index}`),
      ),
    );
  }

  getByIndex(index: number) {
    return this.get().pokemons[index];
  }

  reset(index: number, pokemon: Pokemon) {
    const current = this.getByIndex(index);
    if (current.pokemon === pokemon) {
      return;
    }
    this.set('pokemons', ({ pokemons }) => {
      const newPokemons = [...pokemons];
      newPokemons[index] = createPokemonState(pokemon);
      return newPokemons;
    });
  }

  update(index: number, input: Partial<PokemonState>) {
    const current = this.getByIndex(index);
    const next = { ...current, ...input };
    if (comparePokemonState(current, next)) {
      return;
    }
    this.set('pokemons', ({ pokemons }) => {
      const newPokemons = [...pokemons];
      newPokemons[index] = next;
      return newPokemons;
    });
  }

  addPokemon() {
    this.set('pokemons', ({ pokemons }) => {
      const base = pokemons[pokemons.length - 1] ?? createPokemonState(this.getDefaultPokemon());
      return [...pokemons, clonePokemonState(base)];
    });
  }

  remove(index: number) {
    this.set('pokemons', ({ pokemons }) => {
      const newPokemons = [...pokemons];
      newPokemons.splice(index, 1);
      return newPokemons;
    });
  }

  serialize() {
    const { pokemons } = this.get();
    const serialized = pokemons.map((item, index) => [index, serializePokemonState(item)]);
    const token = compressToBase64(JSON.stringify(serialized));
    return token;
  }

  deserialize(token: string) {
    const data: Array<[unknown, PokemonStateJSON]> = JSON.parse(decompressFromBase64(token) ?? '[]');
    if (data.length === 0) {
      return;
    }
    const pokemons = data.map(([, item]) =>
      deserializePokemonState(item, (name) => this.pokemonData.getPokemonByName(name)),
    );
    this.set({ pokemons });
  }

  private getDefaultPokemon(): Pokemon {
    return this.pokemonData.getPokemonByName('ガブリアス');
  }
}
