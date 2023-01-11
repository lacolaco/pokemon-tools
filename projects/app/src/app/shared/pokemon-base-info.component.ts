import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { Pokemon } from '@lacolaco/pokemon-data';
import { JoinPipe, JoinStatValuesPipe } from '../utitilites/pipes';
import { PokemonYakkunLinkComponent } from './pokemon-yakkun-link.component';

@Component({
  selector: 'pokemon-base-info',
  standalone: true,
  imports: [CommonModule, PokemonYakkunLinkComponent, JoinStatValuesPipe, JoinPipe],
  template: `
    <div class="flex flex-row flex-wrap items-center gap-2 text-sm leading-none text-gray-500">
      <span>{{ pokemon.baseStats | joinStatValues }}</span>
      <span>({{ pokemon.baseStatsTotal }})</span>
      <span>{{ pokemon.types | join : '/' }}</span>
      <pokemon-yakkun-link [pokemon]="pokemon"></pokemon-yakkun-link>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonBaseInfoComponent {
  @Input() pokemon!: Pokemon;
}
