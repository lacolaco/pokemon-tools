import { Injectable } from '@angular/core';
import { calculateEVs, calculateStats, optimizeDurability, sumOfStatValues } from '@lib/calc';
import { naturesMap, PokemonData, pokemonsMap } from '@lib/data';
import { asEV, asIV, asLevel, asStats, EVs, IVs, Level, Nature, Stat, StatValues } from '@lib/model';
import { RxState, stateful } from '@rx-angular/state';
import { combineLatest, distinctUntilChanged, map, shareReplay, skip } from 'rxjs';
import { debug, distinctUntilStatValuesChanged } from '../utitilites/rx';
import { formatStats } from './formatter';

type State = {
  pokemon: PokemonData;
  level: Level;
  nature: Nature;
  ivs: IVs;
  evs: EVs;
};

@Injectable()
export class StatsComponentState extends RxState<State> {
  readonly state$ = combineLatest([
    this.select('pokemon').pipe(stateful(distinctUntilChanged(), debug('[change] pokemon'))),
    this.select('level').pipe(stateful(distinctUntilChanged(), debug('[change] level'))),
    this.select('nature').pipe(stateful(distinctUntilChanged(), debug('[change] nature'))),
    this.select('ivs').pipe(stateful(distinctUntilStatValuesChanged(), debug('[change] ivs'))),
    this.select('evs').pipe(stateful(distinctUntilStatValuesChanged(), debug('[change] evs'))),
  ]).pipe(
    map(([pokemon, level, nature, ivs, evs]) => calculateStats(asStats(pokemon.baseStats), level, nature, ivs, evs)),
    distinctUntilStatValuesChanged(),
    debug('[change] stats'),
    map((stats) => {
      const { pokemon, level, nature, ivs, evs } = this.get();
      const usedEVs = sumOfStatValues(evs);
      const statsText = formatStats(pokemon, level, nature, stats, evs);
      return { pokemon, level, nature, ivs, evs, stats, usedEVs, statsText };
    }),
    debug('[change] state'),
    shareReplay(1),
  );

  constructor() {
    super();

    // Reset stats when pokemon changes
    this.select('pokemon')
      .pipe(skip(1), distinctUntilChanged())
      .subscribe((pokemon) => {
        this.reset({ pokemon });
      });

    // Set initial state
    this.reset();
  }

  private reset(override: Partial<State> = {}) {
    this.set(
      (): State => ({
        pokemon: pokemonsMap['ガブリアス'],
        level: asLevel(50),
        nature: naturesMap['いじっぱり'],
        evs: { H: asEV(0), A: asEV(0), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(0) },
        ivs: { H: asIV(31), A: asIV(31), B: asIV(31), C: asIV(31), D: asIV(31), S: asIV(31) },
        ...override,
      }),
    );
  }

  updateWithStats(stats: StatValues<Stat>) {
    const { level, pokemon, ivs, nature } = this.get();
    this.set({ evs: calculateEVs(asStats(pokemon.baseStats), level, nature, ivs, stats) });
  }

  resetEVs() {
    this.set({ evs: { H: asEV(0), A: asEV(0), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(0) } });
  }

  optimizeDurability() {
    const { pokemon, level, nature, ivs, evs } = this.get();
    this.set({ evs: optimizeDurability(asStats(pokemon.baseStats), level, nature, ivs, evs) });
  }
}
