import { loadPokemons, PokemonData } from '@lib/data';
import { from, shareReplay } from 'rxjs';

const _pokemons$ = from(loadPokemons()).pipe(shareReplay(1));

export const pokemons$ = _pokemons$;

export const emptyPokemon: PokemonData = {
  index: 0,
  name: '',
  baseStats: { H: 0, A: 0, B: 0, C: 0, D: 0, S: 0 },
  types: [],
  abilities: [],
  baseStatsTotal: 0,
  meta: {
    url: '',
  },
};
