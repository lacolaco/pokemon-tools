import type { pokemons, PokemonData, PokemonName } from '@lacolaco/pokemon-data';

type Pokemons = typeof pokemons;

export { Pokemons, PokemonData, PokemonName };

export const loadPokemons = (): Promise<Pokemons> => import('@lacolaco/pokemon-data').then((module) => module.pokemons);
