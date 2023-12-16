import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { Pokemon } from '@lacolaco/pokemon-data';
import { JoinPipe, JoinStatValuesPipe } from './utitilites/pipes';

@Component({
  selector: 'pokemon-base-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JoinStatValuesPipe, JoinPipe],
  template: `
    <div class="flex flex-row justify-start items-center gap-x-1 leading-none">
      <span>{{ pokemon.baseStats | joinStatValues }}</span>
      <span>{{ pokemon.types | join: '/' }}</span>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class PokemonBaseInfoComponent {
  @Input() pokemon!: Pokemon;
}
