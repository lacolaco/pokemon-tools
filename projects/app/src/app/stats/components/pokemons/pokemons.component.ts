import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppStrokedButton } from '@app/shared/ui/buttons';
import { StatsState } from '../../state';
import { StatsPokemonsItemComponent } from './pokemons-item.component';

@Component({
  selector: 'stats-pokemons',
  standalone: true,
  imports: [CommonModule, CdkAccordionModule, StatsPokemonsItemComponent, MatIconModule, AppStrokedButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <cdk-accordion class="flex flex-col gap-y-2" multi>
      <cdk-accordion-item
        *ngFor="let item of state.$pokemons(); trackBy: trackByIndex; let index = index"
        #cdkAccordionItem="cdkAccordionItem"
        expanded
      >
        <stats-pokemons-item [$state]="item" [cdkAccordionItem]="cdkAccordionItem" (remove)="state.remove(index)" />
      </cdk-accordion-item>

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

  trackByIndex(index: number) {
    return index;
  }
}
