import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { Pokemon } from '@lacolaco/pokemon-data';
import { JoinPipe, JoinStatValuesPipe } from '../utitilites/pipes';

@Component({
  selector: 'pokemon-base-info',
  standalone: true,
  imports: [CommonModule, JoinStatValuesPipe, JoinPipe],
  template: `
    <div class="flex flex-row flex-wrap items-center gap-2 text-sm leading-none text-gray-500">
      <span>{{ pokemon.baseStats | joinStatValues }}</span>
      <span>({{ pokemon.baseStatsTotal }})</span>
      <span>{{ pokemon.types | join : '/' }}</span>
      <a [href]="pokemon.meta.url" target="_blank" title="ポケモン徹底攻略で{{ pokemon.name }}を見る">
        <img src="assets/images/yakkun-32x32.png" width="16px" height="16px" />
      </a>
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
