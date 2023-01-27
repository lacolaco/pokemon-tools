import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import type { Pokemon } from '@lacolaco/pokemon-data';
import { PokemonData } from './pokemon-data';

@Component({
  selector: 'pokemon-sprite',
  standalone: true,
  template: `<img [attr.src]="src" loading="lazy" />`,
  styles: [
    `
      :host {
        display: block;
        aspect-ratio: 1/1;
      }
      img {
        width: 100%;
        height: 100%;
        margin-top: -12%;
        object-fit: contain;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonSpriteComponent {
  private readonly pokemonData = inject(PokemonData);

  @Input() pokemon!: Pokemon;

  get src() {
    return this.pokemonData.getSpriteURL(this.pokemon);
  }
}
