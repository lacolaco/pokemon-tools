import { Injectable } from '@angular/core';
import { calculateEVs, calculateStats, optimizeDurability } from '@lib/calc';
import { naturesMap, PokemonData, pokemonsMap } from '@lib/data';
import { asEV, asIV, asLevel, asStats, EVs, IVs, Level, Nature, Stat, StatValues } from '@lib/model';
import { RxState } from '@rx-angular/state';
import { combineLatest, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { distinctUntilStatValuesChanged } from '../utitilites/rx';

type State = {
  pokemon: PokemonData;
  level: Level;
  nature: Nature;
  ivs: IVs;
  evs: EVs;
};

@Injectable()
export class StatsComponentState extends RxState<State> {
  readonly stats$ = combineLatest([
    this.select('pokemon').pipe(distinctUntilChanged()),
    this.select('level').pipe(distinctUntilChanged()),
    this.select('nature').pipe(distinctUntilChanged()),
    this.select('ivs').pipe(distinctUntilStatValuesChanged()),
    this.select('evs').pipe(distinctUntilStatValuesChanged()),
  ]).pipe(
    debounceTime(50),
    map(([{ baseStats }, level, nature, ivs, evs]) => calculateStats(asStats(baseStats), level, nature, ivs, evs)),
    distinctUntilStatValuesChanged(),
  );

  constructor() {
    super();
    // Set initial state
    const pokemon = pokemonsMap['ガブリアス'];
    this.reset({ pokemon });

    // Reset stats when pokemon changes
    this.select('pokemon')
      .pipe(distinctUntilChanged())
      .subscribe((pokemon) => {
        this.reset({ pokemon });
      });
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
    const {
      level,
      pokemon: { baseStats },
      ivs,
      nature,
    } = this.get();
    this.set({ evs: calculateEVs(asStats(baseStats), level, nature, ivs, stats) });
  }

  resetEVs() {
    this.set({ evs: { H: asEV(0), A: asEV(0), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(0) } });
  }

  optimizeDurability() {
    const {
      pokemon: { baseStats },
      level,
      nature,
      ivs,
      evs,
    } = this.get();
    this.set({ evs: optimizeDurability(asStats(baseStats), level, nature, ivs, evs) });
  }
}
