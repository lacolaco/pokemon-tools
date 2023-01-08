import { Injectable } from '@angular/core';
import { getPokemonByName, Pokemon } from '@lacolaco/pokemon-data';
import { calculateEVs, calculateStats, optimizeDurability, sumOfStatValues } from '@lib/calc';
import { naturesMap } from '@lib/data';
import { asEV, asIV, asLevel, asStats, EVs, IVs, Level, Nature, Stat, Stats, StatValues } from '@lib/model';
import { RxState, stateful } from '@rx-angular/state';
import { combineLatest, filter, map, Observable, shareReplay } from 'rxjs';
import { debug, distinctUntilStatValuesChanged } from '../utitilites/rx';

type State = {
  pokemon: Pokemon | null;
  level: Level;
  nature: Nature;
  ivs: IVs;
  evs: EVs;
};

@Injectable()
export class StatsPageState extends RxState<State> {
  private readonly stats$: Observable<Stats> = combineLatest([
    this.select('pokemon').pipe(stateful(debug('[change] pokemon'))),
    this.select('level').pipe(stateful(debug('[change] level'))),
    this.select('nature').pipe(stateful(debug('[change] nature'))),
    this.select('ivs').pipe(stateful(distinctUntilStatValuesChanged(), debug('[change] ivs'))),
    this.select('evs').pipe(stateful(distinctUntilStatValuesChanged(), debug('[change] evs'))),
  ]).pipe(
    filter(([pokemon]) => !!pokemon),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    map(([pokemon, level, nature, ivs, evs]) => calculateStats(asStats(pokemon!.baseStats), level, nature, ivs, evs)),
    distinctUntilStatValuesChanged(),
    debug('[change] stats'),
    shareReplay(1),
  );

  readonly state$ = combineLatest([this.stats$]).pipe(
    map(([stats]) => {
      const { pokemon, level, nature, ivs, evs } = this.get();
      const usedEVs = sumOfStatValues(evs);
      return { pokemon, level, nature, ivs, evs, stats, usedEVs };
    }),
    debug('[change] state'),
    shareReplay(1),
  );

  constructor() {
    super();
    this.resetPokemon(getPokemonByName('ガブリアス'));
  }

  resetPokemon(pokemon: Pokemon) {
    this.set({
      pokemon,
      level: asLevel(50),
      nature: naturesMap['いじっぱり'],
      evs: { H: asEV(0), A: asEV(0), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(0) },
      ivs: { H: asIV(31), A: asIV(31), B: asIV(31), C: asIV(31), D: asIV(31), S: asIV(31) },
    });
  }

  updateWithStats(stats: StatValues<Stat>) {
    const { level, pokemon, ivs, nature } = this.get();
    if (pokemon) {
      this.set({ evs: calculateEVs(asStats(pokemon.baseStats), level, nature, ivs, stats) });
    }
  }

  resetEVs() {
    this.set({ evs: { H: asEV(0), A: asEV(0), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(0) } });
  }

  optimizeDurability() {
    const { pokemon, level, nature, ivs, evs } = this.get();
    if (pokemon) {
      this.set({ evs: optimizeDurability(asStats(pokemon.baseStats), level, nature, ivs, evs) });
    }
  }
}
