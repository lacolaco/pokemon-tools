import { inject, Injectable } from '@angular/core';
import type { Pokemon } from '@lacolaco/pokemon-data';
import {
  asStat,
  calculateStatForNonHP,
  isNoopSpeedModifier,
  Level,
  modifySpeed,
  SpeedModifier,
  Stat,
} from '@lib/stats';
import { RxState, stateful } from '@rx-angular/state';
import { combineLatest, distinctUntilChanged, map, Observable, shareReplay } from 'rxjs';
import { PokemonData } from '../../shared/pokemon-data';
import { SpeedPresetKey, speedPresets } from '../speed-presets';
import { SpeedPageState } from '../speed.state';
import { comparisonTargetPokemons } from './comparison-targets';
import { getSpeedModifierLabel } from './speed-modifier-label';

export const defaultSpeedModifier: SpeedModifier = {
  rank: 0,
  item: null,
  ability: null,
  condition: { paralysis: false, tailwind: false },
};

export type SpeedComparisonGroup = {
  label: string;
  pokemons: Pokemon[];
  modifier?: SpeedModifier;
};

export type SpeedComparisonTableRow = {
  stat: Stat;
  groups: SpeedComparisonGroup[];
  isAlly?: boolean;
};

function calculateSpeedStat(pokemon: Pokemon, level: Level, preset: SpeedPresetKey): Stat {
  const { iv, ev, nature } = speedPresets[preset];
  return calculateStatForNonHP(asStat(pokemon.baseStats.S), level, iv, ev, nature);
}

const speedPresetLabels = [
  ['fastest', '最速'],
  ['fast', '準速'],
  ['none', '無振'],
  ['slowest', '最遅'],
] as const;

@Injectable()
export class SpeedComparisonTableState extends RxState<{
  opponents: Pokemon[];
  ally: {
    pokemon: Pokemon;
    level: Level;
    stat: Stat;
  };
  allyModifier: SpeedModifier;
  opponentModifier: SpeedModifier;
}> {
  private readonly pageState = inject(SpeedPageState);
  private readonly pokemonData = inject(PokemonData);

  private readonly allyStat$ = combineLatest([
    this.select('ally').pipe(stateful()),
    this.select('allyModifier').pipe(stateful()),
  ]).pipe(
    map(([ally, modifier]) => ({
      stat: modifySpeed(ally.stat, modifier),
      modifier,
    })),
    distinctUntilChanged(),
  );

  private readonly opponentsWithStats$ = combineLatest([
    this.select('ally').pipe(stateful(map((ally) => ally.level))),
    this.select('opponents').pipe(stateful()),
  ]).pipe(
    map(([level, opponents]) => {
      return opponents.map((pokemon) => ({
        pokemon,
        stats: {
          fastest: calculateSpeedStat(pokemon, level, 'fastest'),
          fast: calculateSpeedStat(pokemon, level, 'fast'),
          none: calculateSpeedStat(pokemon, level, 'none'),
          slowest: calculateSpeedStat(pokemon, level, 'slowest'),
        },
      }));
    }),
  );

  private readonly opponentRows$: Observable<SpeedComparisonTableRow[]> = combineLatest([
    this.opponentsWithStats$,
    this.select('opponentModifier').pipe(stateful()),
  ]).pipe(
    map(([opponents, modifier]) => {
      const statGroupsMap = new Map<Stat, SpeedComparisonGroup[]>();
      function insert(stat: Stat, label: string, pokemon: Pokemon, modifier?: SpeedModifier) {
        const groups = statGroupsMap.get(stat) ?? [];
        const group = groups.find((group) => group.label === label);
        if (group) {
          group.pokemons.push(pokemon);
        } else {
          groups.push({ label, pokemons: [pokemon], modifier });
        }
        statGroupsMap.set(stat, groups);
      }
      for (const opponent of opponents) {
        for (const [presetKey, presetLabel] of speedPresetLabels) {
          const stat = opponent.stats[presetKey];
          const groupLabel = `${presetLabel}${opponent.pokemon.baseStats.S}族`;
          insert(stat, groupLabel, opponent.pokemon);

          if (!isNoopSpeedModifier(modifier)) {
            insert(
              modifySpeed(stat, modifier),
              `${groupLabel} ${getSpeedModifierLabel(modifier)}`,
              opponent.pokemon,
              modifier,
            );
          }
        }
      }
      return [...statGroupsMap.entries()].map(([stat, groups]) => ({ stat, groups }));
    }),
  );

  readonly rows$: Observable<SpeedComparisonTableRow[]> = combineLatest([this.allyStat$, this.opponentRows$]).pipe(
    map(([ally, opponents]) => {
      const sameStatIndex = opponents.findIndex((row) => row.stat === ally.stat);
      if (sameStatIndex >= 0) {
        return [
          ...opponents.slice(0, sameStatIndex),
          { ...opponents[sameStatIndex], isAlly: true },
          ...opponents.slice(sameStatIndex + 1),
        ];
      }
      return [...opponents, { stat: ally.stat, groups: [], modifier: ally.modifier, isAlly: true }];
    }),
    map((rows) => {
      return [...rows].sort((a, b) => {
        const byStat = b.stat - a.stat;
        if (byStat !== 0) {
          return byStat;
        }
        return b.isAlly ? -1 : 1;
      });
    }),
    shareReplay(1),
  );

  constructor() {
    super();

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
      opponents: comparisonTargetPokemons.map((name) => this.pokemonData.getPokemonByName(name)),
      allyModifier: defaultSpeedModifier,
      opponentModifier: defaultSpeedModifier,
    });
  }
}
