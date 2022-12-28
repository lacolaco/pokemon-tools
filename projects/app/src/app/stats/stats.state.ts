import { Injectable } from '@angular/core';
import { calcEVs, calcStats, optimizeDurability } from '@lib/calc';
import { naturesMap, PokemonData, pokemonsMap } from '@lib/data';
import { equalsStatValues, ev, EV, iv, IV, Nature, Stat, StatValues } from '@lib/model';
import { RxState } from '@rx-angular/state';
import { combineLatest, distinctUntilChanged } from 'rxjs';

const distinctUntilChangedStatValues = distinctUntilChanged(equalsStatValues);

@Injectable()
export class StatsComponentState extends RxState<{
  pokemon: PokemonData;
  level: number;
  nature: Nature;
  ivs: StatValues<IV>;
  evs: StatValues<EV>;
  stats: StatValues<Stat>;
}> {
  constructor() {
    super();
    // Reset stats when pokemon changes
    this.select('pokemon').subscribe(() => {
      this.set({
        evs: [ev(0), ev(0), ev(0), ev(0), ev(0), ev(0)],
        ivs: [iv(31), iv(31), iv(31), iv(31), iv(31), iv(31)],
      });
    });
    // Calculate stats
    combineLatest([
      this.select('level'),
      this.select('nature'),
      this.select('ivs').pipe(distinctUntilChangedStatValues),
      this.select('evs').pipe(distinctUntilChangedStatValues),
    ]).subscribe(() => {
      const {
        pokemon: { baseStats },
        level,
        ivs,
        evs,
        nature,
      } = this.get();
      const stats = calcStats(level, baseStats, ivs, evs, nature);
      if (!this.get().stats || !equalsStatValues(stats, this.get().stats)) {
        this.set({ stats });
      }
    });

    const pokemon = pokemonsMap['ガブリアス'];

    this.set({
      pokemon,
      level: 50,
      nature: naturesMap['いじっぱり'],
    });
  }

  updateStats(stats: StatValues<Stat>) {
    const {
      level,
      pokemon: { baseStats },
      ivs,
      nature,
    } = this.get();
    const evs = calcEVs(level, stats, baseStats, ivs, nature);
    if (!this.get().evs || !equalsStatValues(evs, this.get().evs)) {
      this.set({ evs });
    }
  }

  resetEVs() {
    this.set({ evs: [0, 0, 0, 0, 0, 0] as StatValues<EV> });
  }

  optimizeDurability() {
    const {
      pokemon: { baseStats },
      level,
      nature,
      ivs,
      evs,
    } = this.get();
    const optimized = optimizeDurability(baseStats, level, nature, ivs, evs);
    if (!equalsStatValues(optimized, evs)) {
      this.set({ evs: optimized });
    }
  }
}
