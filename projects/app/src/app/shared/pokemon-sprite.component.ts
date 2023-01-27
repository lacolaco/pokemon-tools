import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import type { Pokemon } from '@lacolaco/pokemon-data';
import { PokemonData } from './pokemon-data';

@Component({
  selector: 'pokemon-sprite',
  standalone: true,
  template: ``,
  styles: [
    `
      :host {
        display: block;
        aspect-ratio: 1/1;
        background-size: contain;
        background-repeat: no-repeat;
        margin-top: -10%;
      }
    `,
  ],
  host: {
    '[style.background-image]': '"url(" + src + ")"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonSpriteComponent {
  private readonly pokemonData = inject(PokemonData);

  @Input() pokemon!: Pokemon;

  get src() {
    return this.pokemonData.getSpriteURL(this.pokemon);
  }
}
