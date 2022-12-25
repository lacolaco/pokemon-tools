import pokemonsJSON from './pokemons.generated';
import { PokemonData } from './types';
import { fromEntries } from './utilities';

export const pokemons: Readonly<PokemonData[]> = pokemonsJSON.items;
export type PokemonName = typeof pokemons[number]['name'];
export const pokemonsMap: Record<PokemonName, PokemonData> = fromEntries(pokemons.map((p) => [p.name, p]));
