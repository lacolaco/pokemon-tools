import { Pokemon, PokemonName } from '@lacolaco/pokemon-data';
import {
  asEV,
  asIV,
  asLevel,
  calculateAllStats,
  calculateDefenseFactor,
  compareStatValues,
  EV,
  IV,
  Level,
  Nature,
  NatureName,
  natures,
  Stat,
  StatValues,
  sumOfStatValues,
} from '@lib/stats';

export type PokemonState = {
  pokemon: Pokemon;
  level: Level;
  nature: Nature;
  ivs: StatValues<IV | null>;
  evs: StatValues<EV>;
};

export function comparePokemonState(a: PokemonState, b: PokemonState): boolean {
  return (
    a.pokemon === b.pokemon &&
    a.level === b.level &&
    a.nature === b.nature &&
    compareStatValues(a.ivs, b.ivs) &&
    compareStatValues(a.evs, b.evs)
  );
}

export function createPokemonState(pokemon: Pokemon): PokemonState {
  return {
    pokemon,
    level: asLevel(50),
    nature: natures['いじっぱり'],
    evs: { H: asEV(0), A: asEV(0), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(0) },
    ivs: { H: asIV(31), A: asIV(31), B: asIV(31), C: asIV(31), D: asIV(31), S: asIV(31) },
  };
}

export function clonePokemonState(pokemonState: PokemonState): PokemonState {
  return {
    pokemon: pokemonState.pokemon,
    level: pokemonState.level,
    nature: pokemonState.nature,
    evs: { ...pokemonState.evs },
    ivs: { ...pokemonState.ivs },
  };
}

export type PokemonStateJSON = {
  pokemon: PokemonName;
  level: number;
  nature: NatureName;
  ivs: StatValues<number | null>;
  evs: StatValues<number>;
};

export function serializePokemonState(state: PokemonState): PokemonStateJSON {
  const { pokemon, level, nature, ivs, evs } = state;
  return { pokemon: pokemon.name, level, nature: nature.name, ivs, evs };
}

export function deserializePokemonState(
  json: PokemonStateJSON,
  pokemonResolver: (name: PokemonName) => Pokemon,
): PokemonState {
  return {
    pokemon: pokemonResolver(json.pokemon),
    level: asLevel(json.level),
    nature: natures[json.nature],
    ivs: json.ivs as StatValues<IV | null>,
    evs: json.evs as StatValues<EV>,
  };
}

export type PokemonStats = {
  usedEVs: number;
  defenseFactor: number | null;
  values: StatValues<Stat | null>;
};

export function calculatePokemonStats(state: PokemonState): PokemonStats {
  const { pokemon, evs, ivs, level, nature } = state;
  const stats = calculateAllStats(pokemon.baseStats as StatValues<Stat>, level, ivs, evs, nature);
  const usedEVs = sumOfStatValues(evs);
  const defenseFactor = calculateDefenseFactor(stats.H, stats.B, stats.D);
  return { values: stats, usedEVs, defenseFactor };
}
