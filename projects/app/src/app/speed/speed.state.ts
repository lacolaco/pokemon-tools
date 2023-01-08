import { Injectable } from '@angular/core';
import { getPokemonByName, Pokemon } from '@lacolaco/pokemon-data';
import { RxState, stateful } from '@rx-angular/state';
import { combineLatest, map, shareReplay } from 'rxjs';

type State = {
  pokemon: Pokemon | null;
};

@Injectable()
export class SpeedPageState extends RxState<State> {
  readonly state$ = combineLatest([this.select('pokemon').pipe(stateful())]).pipe(
    map(([pokemon]) => ({ pokemon })),
    shareReplay(1),
  );

  constructor() {
    super();

    this.set({
      pokemon: getPokemonByName('ガブリアス'),
    });
  }
}
