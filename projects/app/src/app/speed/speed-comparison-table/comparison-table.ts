import { inject, Injectable } from '@angular/core';
import { getPokemons, Pokemon } from '@lacolaco/pokemon-data';
import {
  asStat,
  calculateStatForNonHP,
  EV,
  IV,
  Level,
  modifySpeed,
  NatureValue,
  SpeedModifier,
  Stat,
} from '@lib/stats';
import { RxState, stateful } from '@rx-angular/state';
import { combineLatest, distinctUntilChanged, map, Observable, shareReplay } from 'rxjs';
import { speedPresets } from '../speed-presets';
import { SpeedPageState } from '../speed.state';

export const defaultSpeedModifier: SpeedModifier = {
  rank: 0,
  item: null,
  ability: null,
  condition: { paralysis: false, tailwind: false },
};

export type SpeedComparisonTableRow =
  | {
      stat: Stat;
      baseStat: number;
      pokemons: Pokemon[];
      isAlly?: never;
    }
  | {
      stat: Stat;
      baseStat?: never;
      pokemons?: never;
      isAlly: true;
    };

@Injectable()
export class SpeedComparisonTableState extends RxState<{
  ally: {
    pokemon: Pokemon;
    level: Level;
    stat: Stat;
  };
  allyModifier: SpeedModifier;
  opponent: {
    iv: IV;
    ev: EV;
    nature: NatureValue;
  };
  opponentModifier: SpeedModifier;
}> {
  private readonly pageState = inject(SpeedPageState);

  private readonly allySpeed$: Observable<Stat> = combineLatest([
    this.select('ally').pipe(stateful()),
    this.select('allyModifier').pipe(stateful()),
  ]).pipe(
    map(([ally, modifier]) => {
      return modifySpeed(ally.stat, modifier);
    }),
    distinctUntilChanged(),
  );

  private readonly opponents$ = combineLatest([
    this.select('ally').pipe(stateful(map((ally) => ally.level))),
    this.select('opponent').pipe(stateful()),
    this.select('opponentModifier').pipe(stateful()),
  ]).pipe(
    map(([level, opponent, modifier]) => {
      return this.opponents.map((group) => ({
        stat: modifySpeed(
          calculateStatForNonHP(asStat(group.baseStat), level, opponent.iv, opponent.ev, opponent.nature),
          modifier,
        ),
        baseStat: group.baseStat,
        pokemons: group.pokemons,
      }));
    }),
  );

  readonly rows$: Observable<SpeedComparisonTableRow[]> = combineLatest([this.allySpeed$, this.opponents$]).pipe(
    map(([ally, opponents]) => {
      const allyRow: SpeedComparisonTableRow = {
        isAlly: true,
        stat: ally,
      };
      return [allyRow, ...opponents].sort((a, b) => {
        const byStat = b.stat - a.stat;
        if (byStat !== 0) {
          return byStat;
        }
        return (b.baseStat ?? 0) - (a.baseStat ?? 0);
      });
    }),
    shareReplay(1),
  );

  private readonly opponents: { baseStat: number; pokemons: Pokemon[] }[];

  constructor() {
    super();

    const pokemons = getPokemons();
    const pokemonsBySpeed = new Map<number, Pokemon[]>();
    for (const pokemon of Object.values(pokemons)) {
      const speed = pokemon.baseStats.S;
      if (pokemonsBySpeed.has(speed)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pokemonsBySpeed.get(speed)!.push(pokemon);
      } else {
        pokemonsBySpeed.set(speed, [pokemon]);
      }
    }
    this.opponents = Array.from(pokemonsBySpeed.entries()).map(([baseStat, pokemons]) => ({
      baseStat,
      pokemons: pokemons.sort((a, b) => b.baseStatsTotal - a.baseStatsTotal),
    }));

    this.connect(
      'ally',
      this.pageState.state$.pipe(
        map((state) => ({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          pokemon: state.pokemon!,
          level: state.level,
          stat: state.stats.stat,
        })),
      ),
    );
    this.set({
      allyModifier: defaultSpeedModifier,
      opponent: speedPresets['fastest'],
      opponentModifier: defaultSpeedModifier,
    });
  }
}
