import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PokemonBaseInfoComponent } from '@app/shared/pokemon-base-info.component';
import { RxState } from '@rx-angular/state';
import { PokemonDecoratedStatsComponent } from '../../shared/pokemon-decorated-stats.component';
import { PokemonSpriteComponent } from '../../shared/pokemon-sprite.component';
import { PokemonWithStats } from '../models/pokemon-state';

@Component({
  selector: 'stats-pokemon-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PokemonSpriteComponent, PokemonDecoratedStatsComponent, PokemonBaseInfoComponent],
  template: `
    <div class="grid grid-cols-[auto_auto] justify-start items-end gap-x-1 pb-1">
      <pokemon-sprite [pokemon]="pokemon.pokemon" class="w-10" [size]="40"></pokemon-sprite>
      <div class="flex flex-col">
        <span class="text-lg font-bold leading-none">{{ pokemon.pokemon.name }}</span>
        <pokemon-base-info [pokemon]="pokemon.pokemon" class="text-xs text-gray-500"></pokemon-base-info>
      </div>
    </div>
    <div>
      <pokemon-decorated-stats [stats]="pokemon.stats" [nature]="pokemon.nature" [evs]="pokemon.evs" class="text-sm">
      </pokemon-decorated-stats>
    </div>
  `,
  host: {
    class: 'block',
  },
})
export class StatsSummaryComponent {
  private readonly inputs$ = new RxState<{ index: number }>();
  @Input() set index(value: number) {
    this.inputs$.set({ index: value });
  }
  get index() {
    return this.inputs$.get().index;
  }
  @Input({ required: true }) pokemon!: PokemonWithStats;
}
