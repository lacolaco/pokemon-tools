import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatsState } from '../stats.state';
import { StatsPokemonsItemComponent } from './pokemons-item.component';

@Component({
  selector: 'stats-pokemons',
  standalone: true,
  imports: [CommonModule, CdkAccordionModule, StatsPokemonsItemComponent, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="state$ | async as state">
      <cdk-accordion class="flex flex-col gap-y-2">
        <cdk-accordion-item
          *ngFor="let item of state.pokemons; trackBy: trackByIndex; let index = index"
          #cdkAccordionItem="cdkAccordionItem"
          expanded
        >
          <stats-pokemons-item [index]="index" [cdkAccordionItem]="cdkAccordionItem" (remove)="remove(index)">
          </stats-pokemons-item>
        </cdk-accordion-item>

        <button
          mat-stroked-button
          class="hover:bg-blue-50 flex gap-x-2 justify-center items-center cursor-pointer"
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
