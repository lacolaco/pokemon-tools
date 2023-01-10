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
    return this.core.getSpriteURL(pokemon);
  }
}
