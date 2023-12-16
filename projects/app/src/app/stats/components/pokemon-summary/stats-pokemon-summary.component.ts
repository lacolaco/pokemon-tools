import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PokemonBaseInfoComponent } from '@app/shared/pokemon-base-info.component';
import { PokemonDecoratedStatsComponent } from '../../../shared/pokemon-decorated-stats.component';
import { PokemonSpriteComponent } from '../../../shared/pokemon-sprite.component';
import { PokemonState, PokemonStats } from '../../models/pokemon-state';

@Component({
  selector: 'stats-pokemon-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PokemonSpriteComponent, PokemonDecoratedStatsComponent, PokemonBaseInfoComponent],
  template: `
    <div class="grid grid-cols-[auto_auto] justify-start gap-1">
      <pokemon-sprite [pokemon]="state.pokemon" [size]="40" />
      <div class="grid grid-rows-[1fr_auto] h-full">
        <div class="flex items-center">
          <span class="text-lg font-bold leading-none">{{ state.pokemon.name }}</span>
        </div>
        <pokemon-base-info [pokemon]="state.pokemon" class="text-xs text-gray-500" />
      </div>
      @if (showStats) {
        <div class="col-start-2">
          <pokemon-decorated-stats [stats]="stats.values" [nature]="state.nature" [evs]="state.evs" />
        </div>
      }
    </div>
  `,
  host: {
    class: 'block',
  },
})
export class StatsSummaryComponent {
  @Input({ required: true }) state!: PokemonState;
  @Input({ required: true }) stats!: PokemonStats;

  @Input() showStats = false;
}
