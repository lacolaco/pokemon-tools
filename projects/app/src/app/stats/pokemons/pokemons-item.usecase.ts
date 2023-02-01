import { inject, Injectable } from '@angular/core';
import type { Pokemon } from '@lacolaco/pokemon-data';
import {
  asEV,
  asIV,
  asStat,
  calculateAllEVs,
  calculateAllStats,
  calculateDecrementedEVForHP,
  calculateDecrementedEVForNonHP,
  calculateIncrementedEVForHP,
  calculateIncrementedEVForNonHP,
  compareStatValues,
  MAX_EV_TOTAL,
  MAX_EV_VALUE,
  optimizeDefenseEVs,
  Stat,
  StatKey,
  StatValues,
  sumOfStatValues,
} from '@lib/stats';
import { distinctUntilChanged, map, Observable, shareReplay } from 'rxjs';
import { debug } from '../../shared/utitilites/rx';
import { comparePokemonState, PokemonState } from '../models/pokemon-state';
import { StatsState } from '../stats.state';

export type PokemonsItemState = PokemonState & {
  index: number;
  usedEVs: number;
  stats: StatValues<Stat | null>;
};

@Injectable()
export class PokemonsItemUsecase {
  private readonly state = inject(StatsState);
  private readonly computedStateCache = new Map<number, Observable<PokemonsItemState>>();

  selectComputedState$(index: number): Observable<PokemonsItemState> {
    if (this.computedStateCache.has(index)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.computedStateCache.get(index)!;
    }
    const obs = this.state.selectByIndex(index).pipe(
      map((state) => {
        const { pokemon, evs, ivs, level, nature } = state;
        const stats = calculateAllStats(pokemon.baseStats as StatValues<Stat>, level, ivs, evs, nature);
        const usedEVs = sumOfStatValues(evs);
        return { ...state, index, stats, usedEVs };
      }),
      distinctUntilChanged((a, b) => {
        return comparePokemonState(a, b) && compareStatValues(a.stats, b.stats);
      }),
      debug('[change] computed state'),
      shareReplay(1),
    );
    this.computedStateCache.set(index, obs);
    return obs;
  }

  getState(index: number) {
    return this.state.getByIndex(index);
  }

  reset(index: number, pokemon: Pokemon) {
    this.state.reset(index, pokemon);
  }

  update(index: number, input: Partial<PokemonState>) {
    this.state.update(index, input);
  }

  updateByStats(index: number, stats: StatValues<Stat | null>) {
    const { pokemon, level, ivs, evs, nature } = this.getState(index);
    const newEVs = calculateAllEVs(pokemon.baseStats as StatValues<Stat>, level, ivs, stats, nature);
    if (compareStatValues(evs, newEVs)) {
      return;
    }
    this.state.update(index, { evs: newEVs });
  }

  maximize(index: number, key: StatKey) {
    const { evs } = this.getState(index);
    const free = MAX_EV_TOTAL - sumOfStatValues(evs);
    const max = Math.min(evs[key] + free, MAX_EV_VALUE);
    this.update(index, { evs: { ...evs, [key]: asEV(max) } });
  }

  minimize(index: number, key: StatKey) {
    const { evs } = this.getState(index);
    this.update(index, { evs: { ...evs, [key]: asEV(0) } });
  }

  increment(index: number, key: StatKey) {
    const { pokemon, level, nature, ivs, evs } = this.getState(index);
    const iv = ivs[key];
    if (iv === null) {
      return;
    }
    const base = asStat(pokemon.baseStats[key]);
    if (key === 'H') {
      const newEV = calculateIncrementedEVForHP(base, level, iv, evs[key]);
      this.update(index, { evs: { ...evs, [key]: newEV } });
    } else {
      const newEV = calculateIncrementedEVForNonHP(base, level, iv, evs[key], nature.values[key]);
      this.update(index, { evs: { ...evs, [key]: newEV } });
    }
  }

  decrement(index: number, key: StatKey) {
    const { pokemon, level, nature, ivs, evs } = this.getState(index);
    const iv = ivs[key];
    if (iv === null) {
      return;
    }
    const base = asStat(pokemon.baseStats[key]);
    if (key === 'H') {
      const newEV = calculateDecrementedEVForHP(base, level, iv, evs[key]);
      this.update(index, { evs: { ...evs, [key]: newEV } });
    } else {
      const newEV = calculateDecrementedEVForNonHP(base, level, iv, evs[key], nature.values[key]);
      this.update(index, { evs: { ...evs, [key]: newEV } });
    }
  }

  toggleIgnored(index: number, key: StatKey) {
    const { ivs, evs } = this.getState(index);
    const isIgnored = ivs[key] === null;
    this.update(index, {
      ivs: { ...ivs, [key]: isIgnored ? asIV(31) : null },
      evs: { ...evs, [key]: asEV(0) },
    });
  }

  resetEVs(index: number) {
    this.update(index, { evs: { H: asEV(0), A: asEV(0), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(0) } });
  }

  optimizeDefenseEVs(index: number) {
    const { pokemon, level, nature, ivs, evs } = this.getState(index);
    const newEVs = optimizeDefenseEVs(pokemon.baseStats as StatValues<Stat>, level, ivs, evs, nature);
    this.update(index, { evs: newEVs });
  }
}
