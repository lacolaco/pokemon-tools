import { Injectable } from '@angular/core';
import type { Pokemon, PokemonName, Pokemons } from '@lacolaco/pokemon-data';

@Injectable({ providedIn: 'root' })
export class PokemonData {
  private core!: typeof import('@lacolaco/pokemon-data');

  async initialize() {
    this.core = await import('@lacolaco/pokemon-data');
  }

  getPokemons(): Pokemons {
    return this.core.getPokemons();
  }

  getPokemonByName(name: PokemonName): Pokemon {
    return this.core.getPokemonByName(name);
  }

  findPokemonByName(name: string): Pokemon | null {
    return this.core.findPokemonByName(name);
  }

  getSpriteURL(pokemon: Pokemon): string {
    const url = this.core.getSpriteURL(pokemon);
    if (!url) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.core.getSpriteURL(this.core.getPokemonByName('メタモン'))!;
    }
    return url;
  }
}
