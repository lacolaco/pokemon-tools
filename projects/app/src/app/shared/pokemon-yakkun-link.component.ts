import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { Pokemon } from '@lacolaco/pokemon-data';

@Component({
  selector: 'pokemon-yakkun-link',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a [href]="pokemon.meta.url" target="_blank" title="ポケモン徹底攻略で{{ pokemon.name }}を見る">
      <img src="assets/images/yakkun-32x32.png" width="16px" height="16px" />
    </a>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonYakkunLinkComponent {
  @Input() pokemon!: Pokemon;
}
