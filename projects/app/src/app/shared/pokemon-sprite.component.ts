import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import type { Pokemon } from '@lacolaco/pokemon-data';
import { PokemonData } from './pokemon-data';

@Component({
  selector: 'pokemon-sprite',
  standalone: true,
  template: `<img [src]="src" />`,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        aspect-ratio: 1/1;
      }
      img {
        width: 100%;
        height: 100%;
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
