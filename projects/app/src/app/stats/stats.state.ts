import { Injectable } from '@angular/core';
import { calculateEVs, calculateStats, optimizeDurability, sumOfStatValues } from '@lib/calc';
import { naturesMap, PokemonData, Pokemons } from '@lib/data';
import { asEV, asIV, asLevel, asStats, EVs, IVs, Level, Nature, Stat, StatValues } from '@lib/model';
import { RxState, stateful } from '@rx-angular/state';
import { combineLatest, filter, map, shareReplay, take } from 'rxjs';
import { pokemons$ } from '../shared/pokemons';
import { debug, distinctUntilStatValuesChanged } from '../utitilites/rx';
import { formatStats } from './formatter';

type State = {
  pokemons: Pokemons;
  pokemon: PokemonData;
  level: Level;
  nature: Nature;
  ivs: IVs;
  evs: EVs;
};

@Injectable()
export class StatsComponentState extends RxState<State> {
  private readonly stats$ = combineLatest([
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
      const { pokemons, pokemon, level, nature, ivs, evs } = this.get();
      const usedEVs = sumOfStatValues(evs);
      const statsText = formatStats(pokemon, level, nature, stats, evs);
      return { pokemons, pokemon, level, nature, ivs, evs, stats, usedEVs, statsText };
    }),
    debug('[change] state'),
    shareReplay(1),
  );

  constructor() {
    super();
    this.connect('pokemons', pokemons$);
    this.select('pokemons')
      .pipe(stateful(take(1)))
      .subscribe((pokemons) => this.resetPokemon(pokemons['ガブリアス']));
  }

  resetPokemon(pokemon: PokemonData) {
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
