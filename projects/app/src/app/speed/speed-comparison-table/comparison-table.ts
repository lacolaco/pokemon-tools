import { inject, Injectable } from '@angular/core';
import type { Pokemon } from '@lacolaco/pokemon-data';
import {
  asEV,
  asIV,
  asStat,
  calculateStatForNonHP,
  isNoopSpeedModifier,
  Level,
  modifySpeed,
  SpeedAbility,
  SpeedModifier,
  Stat,
} from '@lib/stats';
import { RxState, stateful } from '@rx-angular/state';
import { combineLatest, distinctUntilChanged, map, Observable, shareReplay } from 'rxjs';
import { PokemonData } from '../../shared/pokemon-data';
import { SpeedPageState } from '../speed.state';
import { comparisonTargetPokemons } from './comparison-targets';
import { getSpeedModifierLabel } from './speed-modifier-label';

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
    distinctUntilChanged((a, b) => a.stat === b.stat && a.modifier === b.modifier),
  );

  private readonly opponentsWithStats$ = combineLatest([
    this.select('ally').pipe(stateful(map((ally) => ally.level))),
    this.select('opponents').pipe(stateful()),
  ]).pipe(
    map(([level, opponents]) => {
      return opponents.map((pokemon) => ({
        pokemon,
        stats: getDefaultSpeedStats(pokemon, level),
      }));
    }),
  );

  private readonly opponentRows$: Observable<SpeedComparisonTableRow[]> = combineLatest([
    this.opponentsWithStats$,
    this.select('opponentModifier').pipe(stateful()),
  ]).pipe(
    map(([opponents, modifier]) => {
      const statGroupsMap = new Map<Stat, SpeedComparisonGroup[]>();

      for (const { pokemon, stats } of opponents) {
        for (const { stat, label } of stats) {
          insertPokemonToMap(statGroupsMap, stat, label, pokemon);

          if (!isNoopSpeedModifier(modifier)) {
            insertPokemonToMap(
              statGroupsMap,
              modifySpeed(stat, modifier),
              `${label} ${getSpeedModifierLabel(modifier)}`,
              pokemon,
              modifier,
            );
          }
        }
      }
      return Array.from(statGroupsMap.entries()).map(([stat, groups]) => ({ stat, groups }));
    }),
  );

  readonly rows$: Observable<SpeedComparisonTableRow[]> = combineLatest([this.allyStat$, this.opponentRows$]).pipe(
    map(([ally, opponents]) => {
      const sameStatIndex = opponents.findIndex((row) => row.stat === ally.stat);
      if (sameStatIndex >= 0) {
        const sameStatRow = opponents[sameStatIndex];
        return [
          ...opponents.slice(0, sameStatIndex),
          { ...sameStatRow, isAlly: true },
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
      this.pageState.state$.pipe(
        map((state) => ({
          ally: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            pokemon: state.pokemon!,
            level: state.level,
            stat: state.stats.stat,
          },
          allyModifier: state.allyModifier,
          opponentModifier: state.opponentModifier,
        })),
      ),
    );
    this.set({
      opponents: comparisonTargetPokemons.map((name) => this.pokemonData.getPokemonByName(name)),
    });
  }
}

function insertPokemonToMap(
  map: Map<Stat, SpeedComparisonGroup[]>,
  stat: Stat,
  label: string,
  pokemon: Pokemon,
  modifier?: SpeedModifier,
) {
  const groups = map.get(stat) ?? [];
  const group = groups.find((group) => group.label === label);
  if (group) {
    group.pokemons.push(pokemon);
  } else {
    groups.push({ label, pokemons: [pokemon], modifier });
  }
  map.set(stat, groups);
}

const doubleSpeedAbilities: SpeedAbility[] = ['すいすい', 'すなかき', 'ゆきかき', 'ようりょくそ'];
const rankUpAbilities = ['こだいかっせい', 'クォークチャージ'] as const;

function getDefaultSpeedStats(pokemon: Pokemon, level: Level): { stat: Stat; label: string }[] {
  const stats: { stat: Stat; label: string }[] = [];
  const baseStat = pokemon.baseStats.S as Stat;
  const doubleSpeedAbility = doubleSpeedAbilities.find((a) => [...pokemon.abilities].includes(a));
  const rankUpAbility = rankUpAbilities.find((a) => [...pokemon.abilities].includes(a));

  // 最遅: 80族未満のみ
  if (baseStat < 80) {
    const stat = calculateStatForNonHP(asStat(baseStat), level, asIV(0), asEV(0), 'down');
    stats.push({ stat, label: `最遅${baseStat}族` });
  }
  // 無振り: すべて
  {
    const stat = calculateStatForNonHP(asStat(baseStat), level, asIV(31), asEV(0), 'neutral');
    stats.push({ stat, label: `無振${baseStat}族` });
  }
  // 準速: 50族以上
  if (baseStat >= 50) {
    const stat = calculateStatForNonHP(asStat(baseStat), level, asIV(31), asEV(252), 'neutral');
    stats.push({ stat, label: `準速${baseStat}族` });
    if (doubleSpeedAbility) {
      const modified = modifySpeed(stat, {
        item: null,
        rank: 0,
        condition: { paralysis: false, tailwind: false },
        ability: doubleSpeedAbility,
      });
      stats.push({ stat: modified, label: `準速${baseStat}族 (×2)` });
    }
    if (rankUpAbility) {
      const modified = modifySpeed(stat, {
        item: null,
        rank: 1,
        condition: { paralysis: false, tailwind: false },
        ability: null,
      });
      stats.push({ stat: modified, label: `準速${baseStat}族 (×1.5)` });
    }
  }
  // 最速: 50族以上
  if (baseStat >= 50) {
    const stat = calculateStatForNonHP(asStat(baseStat), level, asIV(31), asEV(252), 'up');
    stats.push({ stat, label: `最速${baseStat}族` });
    if (doubleSpeedAbility) {
      const modified = modifySpeed(stat, {
        item: null,
        rank: 0,
        condition: { paralysis: false, tailwind: false },
        ability: doubleSpeedAbility,
      });
      stats.push({ stat: modified, label: `最速${baseStat}族 (×2)` });
    }
    if (rankUpAbility) {
      const modified = modifySpeed(stat, {
        item: null,
        rank: 1,
        condition: { paralysis: false, tailwind: false },
        ability: null,
      });
      stats.push({ stat: modified, label: `最速${baseStat}族 (×1.5)` });
    }
  }

  return stats;
}
