import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import type { Pokemon } from '@lacolaco/pokemon-data';
import { PokemonData } from './pokemon-data';

@Component({
  selector: 'pokemon-sprite',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `<img [ngSrc]="src" [width]="size" [height]="size" [alt]="pokemon.name" />`,
  styles: [
    `
      img {
        aspect-ratio: 1/1;
        margin-top: -10%;
      }
    `,
  ],
  host: {
    class: 'block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonSpriteComponent {
  private readonly pokemonData = inject(PokemonData);

  @Input() pokemon!: Pokemon;

  @Input() size = 32;

  get src() {
    return this.pokemonData.getSpriteURL(this.pokemon);
  }
}
