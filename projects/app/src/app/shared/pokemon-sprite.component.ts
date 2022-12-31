import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { getSpriteURL, Pokemon } from '@lacolaco/pokemon-data';

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
  @Input() pokemon!: Pokemon;

  get src() {
    return getSpriteURL(this.pokemon);
  }
}
