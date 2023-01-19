import { inject, Injectable } from '@angular/core';
import type { Pokemon, PokemonName } from '@lacolaco/pokemon-data';
import {
  asEV,
  asIV,
  asLevel,
  calculateAllEVs,
  calculateAllStats,
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
import { RxState, stateful } from '@rx-angular/state';
import { combineLatest, debounceTime, distinctUntilChanged, map, Observable, shareReplay } from 'rxjs';
import { PokemonData } from '../shared/pokemon-data';
import { debug, distinctUntilStatValuesChanged, filterNonNullable } from '../utitilites/rx';
import { StatsChildState } from './stats.state';

type State = {
  pokemon: Pokemon | null;
  level: Level;
  nature: Nature;
  ivs: StatValues<IV | null>;
  evs: StatValues<EV>;
  stats: StatValues<Stat | null>;
};

type SerializedState = {
  pokemon: PokemonName;
  level: Level;
  nature: NatureName;
  ivs: StatValues<IV | null>;
  evs: StatValues<EV>;
};

@Injectable()
export class PokemonState extends RxState<State> implements StatsChildState<SerializedState> {
  private readonly pokemonData = inject(PokemonData);

  private readonly stats$: Observable<StatValues<Stat | null>> = combineLatest([
    this.select('pokemon').pipe(stateful(debug('[change] pokemon'), filterNonNullable())),
    this.select('level').pipe(stateful(debug('[change] level'))),
    this.select('nature').pipe(stateful(debug('[change] nature'))),
    this.select('ivs').pipe(stateful(distinctUntilStatValuesChanged(), debug('[change] ivs'))),
    this.select('evs').pipe(stateful(distinctUntilStatValuesChanged(), debug('[change] evs'))),
  ]).pipe(
    map(([pokemon, level, nature, ivs, evs]) =>
      calculateAllStats(pokemon.baseStats as StatValues<Stat>, level, ivs, evs, nature),
    ),
    distinctUntilStatValuesChanged(),
    debug('[change] stats'),
    shareReplay(1),
  );

  readonly state$ = this.select().pipe(
    stateful(
      map(() => {
        const { pokemon, level, nature, ivs, evs, stats } = this.get();
        const usedEVs = sumOfStatValues(evs);
        return { pokemon, level, nature, ivs, evs, stats, usedEVs };
      }),
    ),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    debounceTime(0),
    debug('[change] state'),
    shareReplay(1),
  );

  constructor() {
    super();
    this.resetPokemon(this.pokemonData.getPokemonByName('ガブリアス'));

    this.connect('stats', this.stats$);
  }

  resetPokemon(pokemon: Pokemon) {
    this.set({
      pokemon,
      level: asLevel(50),
      nature: natures['いじっぱり'],
      evs: { H: asEV(0), A: asEV(0), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(0) },
      ivs: { H: asIV(31), A: asIV(31), B: asIV(31), C: asIV(31), D: asIV(31), S: asIV(31) },
    });
  }

  updateWithStats(stats: StatValues<Stat | null>) {
    const { level, pokemon, ivs, nature } = this.get();
    if (pokemon) {
      this.set({ evs: calculateAllEVs(pokemon.baseStats as StatValues<Stat>, level, ivs, stats, nature) });
    }
  }

  serialize(): SerializedState {
    const { pokemon, level, nature, ivs, evs } = this.get();
    return { pokemon: pokemon?.name ?? 'ガブリアス', level, nature: nature.name, ivs, evs };
  }

  deserialize(serialized: SerializedState) {
    this.set({
      pokemon: this.pokemonData.getPokemonByName(serialized.pokemon),
      level: serialized.level,
      nature: natures[serialized.nature],
      ivs: serialized.ivs,
      evs: serialized.evs,
    });
  }
}
