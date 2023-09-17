import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import type { Pokemon } from '@lacolaco/pokemon-data';
import { PokemonData } from './pokemon-data';

@Component({
  selector: 'pokemon-sprite',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `<img
    class="aspect-square mt-[-10%] mb-[10%]"
    [ngSrc]="src"
    [width]="size"
    [height]="size"
    [alt]="pokemon.name"
  />`,
  host: {
    class: 'block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonSpriteComponent {
  private readonly pokemonData = inject(PokemonData);

  @Input({ required: true }) pokemon!: Pokemon;

  @Input() size = 32;

  get src() {
    return this.pokemonData.getSpriteURL(this.pokemon);
  }
}
