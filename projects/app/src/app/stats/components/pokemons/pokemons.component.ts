import { CdkAccordionModule } from '@angular/cdk/accordion';

import { ChangeDetectionStrategy, Component, ElementRef, NgZone, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppStrokedButton } from '@app/shared/ui/buttons';
import { StatsState } from '../../state';
import { StatsPokemonsItemComponent } from './pokemons-item.component';

@Component({
  selector: 'stats-pokemons',
  standalone: true,
  imports: [CdkAccordionModule, StatsPokemonsItemComponent, MatIconModule, AppStrokedButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <cdk-accordion class="flex flex-col gap-y-2" multi>
      @for (item of state.$pokemons(); track item; let index = $index) {
        <cdk-accordion-item #cdkAccordionItem="cdkAccordionItem" expanded>
          <stats-pokemons-item [$state]="item" [cdkAccordionItem]="cdkAccordionItem" (remove)="state.remove(index)" />
        </cdk-accordion-item>
      }

      <button
        app-stroked-button
        class="hover:bg-blue-50 flex gap-x-2 justify-center items-center cursor-pointer text-gray-700 py-4"
        (click)="state.addPokemon()"
      >
        <mat-icon fontIcon="add_circle_outline"></mat-icon>
        <span>ポケモンを追加</span>
      </button>
    </cdk-accordion>
  `,
  host: {
    class: 'block',
  },
})
export class StatsPokemonsComponent {
  readonly state = inject(StatsState);
  readonly #ngZone = inject(NgZone);
  readonly #hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  scrollByIndex(index: number) {
    this.#ngZone.runOutsideAngular(() => {
      const elements = this.#hostElement.querySelectorAll(`stats-pokemons-item`);
      const element = elements.item(index);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
}
