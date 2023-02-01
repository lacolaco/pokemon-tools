import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AppStrokedButton } from '@app/shared/ui/buttons';
import { EV_STEP, MAX_EV_TOTAL, MAX_EV_VALUE, StatKey } from '@lib/stats';
import { map } from 'rxjs';
import { PokemonsItemUsecase } from '../../pokemons/pokemons-item.usecase';
import { StatsPokemonFormComponent } from '../stats-form.component';

@Component({
  selector: 'stat-commands',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, AppStrokedButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="state$ | async as state">
      <div class="bg-white p-2 rounded border border-solid border-gray-500 shadow">
        <div class="grid grid-flow-row gap-y-2">
          <button app-stroked-button class="w-16" (click)="maximize()" [disabled]="state.isMax || state.isIgnored">
            <span class="flex"><mat-icon fontIcon="keyboard_double_arrow_up" inline></mat-icon></span>
          </button>
          <button app-stroked-button class="w-16" (click)="increment()" [disabled]="state.isMax || state.isIgnored">
            <span class="flex"><mat-icon fontIcon="add" inline></mat-icon></span>
          </button>
          <button app-stroked-button class="w-16" (click)="decrement()" [disabled]="state.isMin || state.isIgnored">
            <span class="flex"><mat-icon fontIcon="remove" inline></mat-icon></span>
          </button>
          <button app-stroked-button class="w-16" (click)="minimize()" [disabled]="state.isMin || state.isIgnored">
            <span class="flex">0</span>
          </button>
          <button app-stroked-button class="w-16" (click)="toggleIgnored()">
            <span class="flex"><mat-icon [fontIcon]="state.isIgnored ? 'refresh' : 'close'" inline></mat-icon></span>
          </button>
        </div>
      </div>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      mat-icon {
        min-width: unset;
        margin: 0;
        font-weight: bold;
      }
    `,
  ],
})
export class StatCommandsComponent {
  private readonly context = inject(StatsPokemonFormComponent);
  private readonly usecase = inject(PokemonsItemUsecase);

  @Input() key!: StatKey;

  get index() {
    return this.context.index;
  }

  get state$() {
    return this.context.state$.pipe(
      map((state) => ({
        ...state,
        isMax: MAX_EV_TOTAL - state.usedEVs < EV_STEP || state.evs[this.key] === MAX_EV_VALUE,
        isMin: state.evs[this.key] === 0,
        isIgnored: state.ivs[this.key] === null,
      })),
    );
  }

  maximize() {
    this.usecase.maximize(this.index, this.key);
  }

  minimize() {
    this.usecase.minimize(this.index, this.key);
  }

  increment() {
    this.usecase.increment(this.index, this.key);
  }

  decrement() {
    this.usecase.decrement(this.index, this.key);
  }

  toggleIgnored() {
    this.usecase.toggleIgnored(this.index, this.key);
  }
}
