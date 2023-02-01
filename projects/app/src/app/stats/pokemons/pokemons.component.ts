import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppStrokedButton } from '@app/shared/ui/buttons';
import { StatsState } from '../stats.state';
import { StatsPokemonsItemComponent } from './pokemons-item.component';

@Component({
  selector: 'stats-pokemons',
  standalone: true,
  imports: [CommonModule, CdkAccordionModule, StatsPokemonsItemComponent, MatIconModule, AppStrokedButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="state$ | async as state">
      <cdk-accordion class="flex flex-col gap-y-2" multi>
        <cdk-accordion-item
          *ngFor="let item of state.pokemons; trackBy: trackByIndex; let index = index"
          #cdkAccordionItem="cdkAccordionItem"
          expanded
        >
          <stats-pokemons-item [index]="index" [cdkAccordionItem]="cdkAccordionItem" (remove)="remove(index)">
          </stats-pokemons-item>
        </cdk-accordion-item>

        <button
          app-stroked-button
          class="hover:bg-blue-50 flex gap-x-2 justify-center items-center cursor-pointer text-gray-700"
          (click)="addPokemon()"
        >
          <mat-icon fontIcon="add_circle_outline"></mat-icon>
          <span>ポケモンを追加</span>
        </button>
      </cdk-accordion>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      button {
        padding-top: 1em;
        padding-bottom: 1em;
      }
    `,
  ],
})
export class StatsPokemonsComponent {
  private readonly state = inject(StatsState);
  readonly state$ = this.state.state$;

  addPokemon() {
    this.state.addPokemon();
  }

  remove(index: number) {
    this.state.remove(index);
  }

  trackByIndex(index: number) {
    return index;
  }
}
