import { StatValues } from '@lib/model';

export type PokemonData = {
  url: string;
  name: string;
  icon: string;
  types: readonly string[];
  abilities: readonly string[];
  baseStats: Readonly<StatValues<number>>;
};
