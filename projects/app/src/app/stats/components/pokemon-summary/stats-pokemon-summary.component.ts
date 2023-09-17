import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PokemonBaseInfoComponent } from '@app/shared/pokemon-base-info.component';
import { PokemonDecoratedStatsComponent } from '../../../shared/pokemon-decorated-stats.component';
import { PokemonSpriteComponent } from '../../../shared/pokemon-sprite.component';
import { PokemonState, PokemonStats } from '../../models/pokemon-state';

@Component({
  selector: 'stats-pokemon-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PokemonSpriteComponent, PokemonDecoratedStatsComponent, PokemonBaseInfoComponent],
  template: `
    <div class="grid grid-cols-[auto_auto] justify-start items-end gap-x-1 pb-1">
      <pokemon-sprite [pokemon]="state.pokemon" class="w-10" [size]="40"></pokemon-sprite>
      <div class="flex flex-col">
        <span class="text-lg font-bold leading-none">{{ state.pokemon.name }}</span>
        <pokemon-base-info [pokemon]="state.pokemon" class="text-xs text-gray-500"></pokemon-base-info>
      </div>
    </div>
    <div>
      <pokemon-decorated-stats [stats]="stats.values" [nature]="state.nature" [evs]="state.evs" class="text-sm">
      </pokemon-decorated-stats>
    </div>
  `,
  host: {
    class: 'block',
  },
})
export class StatsSummaryComponent {
  @Input({ required: true }) state!: PokemonState;
  @Input({ required: true }) stats!: PokemonStats;
}
