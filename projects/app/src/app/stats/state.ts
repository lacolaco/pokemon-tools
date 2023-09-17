import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import type { Pokemon } from '@lacolaco/pokemon-data';
import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { PokemonData } from '../shared/pokemon-data';
import {
  clonePokemonState,
  comparePokemonState,
  createPokemonState,
  deserializePokemonState,
  PokemonState,
  PokemonStateJSON,
  serializePokemonState,
} from './models/pokemon-state';

@Injectable()
export class StatsState {
  readonly #pokemonData = inject(PokemonData);

  $pokemons = signal<WritableSignal<PokemonState>[]>([], { equal: Object.is });

  constructor() {
    effect(() => {
      console.log(
        `[change] pokemons`,
        this.$pokemons().map((item) => item()),
      );
    });
  }

  initialize() {
    this.$pokemons.set([createPokemonStateSignal(createPokemonState(this.#getDefaultPokemon()))]);
  }

  addPokemon() {
    this.$pokemons.update((pokemons) => {
      // copy the last pokemon
      const base = pokemons[pokemons.length - 1] ?? signal(createPokemonState(this.#getDefaultPokemon()));
      return [...pokemons, createPokemonStateSignal(clonePokemonState(base()))];
    });
  }

  remove(index: number) {
    this.$pokemons.update((pokemons) => {
      const newPokemons = [...pokemons];
      newPokemons.splice(index, 1);
      return newPokemons;
    });
  }

  serialize() {
    const pokemons = this.$pokemons().map((item) => item());
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
      deserializePokemonState(item, (name) => this.#pokemonData.getPokemonByName(name)),
    );
    this.$pokemons.set(pokemons.map((item) => createPokemonStateSignal(item)));
  }

  #getDefaultPokemon(): Pokemon {
    return this.#pokemonData.getPokemonByName('ガブリアス');
  }
}

export function createPokemonStateSignal(state: PokemonState): WritableSignal<PokemonState> {
  return signal(state, { equal: comparePokemonState });
}
