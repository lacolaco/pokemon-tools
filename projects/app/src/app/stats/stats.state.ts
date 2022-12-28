import { Injectable } from '@angular/core';
import { calcEVs, calcStats, optimizeDurability } from '@lib/calc';
import { naturesMap, PokemonData, pokemonsMap } from '@lib/data';
import { ev, EV, iv, IV, Nature, Stat, StatValues } from '@lib/model';
import { RxState } from '@rx-angular/state';
import { combineLatest, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { distinctUntilArrayChanged } from '../utitilites/rx';

type State = {
  pokemon: PokemonData;
  level: number;
  nature: Nature;
  ivs: StatValues<IV>;
  evs: StatValues<EV>;
};

@Injectable()
export class StatsComponentState extends RxState<State> {
  readonly stats$ = combineLatest([
    this.select('pokemon').pipe(distinctUntilChanged()),
    this.select('level').pipe(distinctUntilChanged()),
    this.select('nature').pipe(distinctUntilChanged()),
    this.select('ivs').pipe(distinctUntilArrayChanged()),
    this.select('evs').pipe(distinctUntilArrayChanged()),
  ]).pipe(
    debounceTime(50),
    map(([pokemon, level, nature, ivs, evs]) => calcStats(pokemon.baseStats, level, nature, ivs, evs)),
    distinctUntilArrayChanged(),
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
        level: 50,
        nature: naturesMap['いじっぱり'],
        evs: [ev(0), ev(0), ev(0), ev(0), ev(0), ev(0)],
        ivs: [iv(31), iv(31), iv(31), iv(31), iv(31), iv(31)],
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
    this.set({ evs: calcEVs(baseStats, level, nature, ivs, stats) });
  }

  resetEVs() {
    this.set({ evs: [ev(0), ev(0), ev(0), ev(0), ev(0), ev(0)] });
  }

  optimizeDurability() {
    const {
      pokemon: { baseStats },
      level,
      nature,
      ivs,
      evs,
    } = this.get();
    this.set({ evs: optimizeDurability(baseStats, level, nature, ivs, evs) });
  }
}
