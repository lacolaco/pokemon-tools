import { inject, Injectable } from '@angular/core';
import type { Pokemon, PokemonName } from '@lacolaco/pokemon-data';
import {
  asEV,
  asIV,
  asLevel,
  compareStatValues,
  EV,
  IV,
  Level,
  Nature,
  NatureName,
  natures,
  StatValues,
} from '@lib/stats';
import { RxState, stateful } from '@rx-angular/state';
import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { combineLatest, distinctUntilChanged, map, shareReplay } from 'rxjs';
import { PokemonData } from '../shared/pokemon-data';
import { debug, filterNonNullable } from '../utitilites/rx';

export type PokemonState = {
  pokemon: Pokemon;
  level: Level;
  nature: Nature;
  ivs: StatValues<IV | null>;
  evs: StatValues<EV>;
};

type PokemonStateJSON = {
  pokemon: PokemonName;
  level: number;
  nature: NatureName;
  ivs: StatValues<number | null>;
  evs: StatValues<number>;
};

function comparePokemonState(a: PokemonState, b: PokemonState): boolean {
  return (
    a.pokemon === b.pokemon &&
    a.level === b.level &&
    a.nature === b.nature &&
    compareStatValues(a.ivs, b.ivs) &&
    compareStatValues(a.evs, b.evs)
  );
}

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

  constructor() {
    super();
  }

  initialize() {
    this.set({
      pokemons: [createPokemonState(this.pokemonData.getPokemonByName('ガブリアス'))],
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

  update(index: number, input: PokemonStateInput) {
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
      const pokemon = pokemons[0]?.pokemon ?? this.pokemonData.getPokemonByName('ガブリアス');
      return [...pokemons, createPokemonState(pokemon)];
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
    const serialized = pokemons.map((item, index) => {
      const { pokemon, level, nature, ivs, evs } = item;
      return [index, { pokemon: pokemon.name, level, nature: nature.name, ivs, evs } as PokemonStateJSON];
    });
    const token = compressToBase64(JSON.stringify(serialized));
    return token;
  }

  deserialize(token: string) {
    const data: Array<[unknown, PokemonStateJSON]> = JSON.parse(decompressFromBase64(token) ?? '[]');
    if (data.length === 0) {
      return;
    }
    const pokemons = data.map(([, item]) => ({
      pokemon: this.pokemonData.getPokemonByName(item.pokemon),
      level: asLevel(item.level),
      nature: natures[item.nature],
      ivs: item.ivs as StatValues<IV | null>,
      evs: item.evs as StatValues<EV>,
    }));
    this.set({ pokemons });
  }
}

export type PokemonStateInput = Partial<PokemonState>;

function createPokemonState(pokemon: Pokemon): PokemonState {
  return {
    pokemon,
    level: asLevel(50),
    nature: natures['いじっぱり'],
    evs: { H: asEV(0), A: asEV(0), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(0) },
    ivs: { H: asIV(31), A: asIV(31), B: asIV(31), C: asIV(31), D: asIV(31), S: asIV(31) },
  };
}
