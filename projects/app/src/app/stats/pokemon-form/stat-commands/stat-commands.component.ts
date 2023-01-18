import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  asEV,
  asIV,
  asStat,
  calculateDecrementedEVForHP,
  calculateDecrementedEVForNonHP,
  calculateIncrementedEVForHP,
  calculateIncrementedEVForNonHP,
  EV,
  MAX_EV_TOTAL,
  MAX_EV_VALUE,
  StatKey,
  sumOfStatValues,
} from '@lib/stats';
import { map } from 'rxjs';
import { StatsPokemonState } from '../../pokemon-state';

@Component({
  selector: 'stat-commands',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="state$ | async as state">
      <div class="grid grid-flow-row gap-y-1 py-1">
        <button mat-stroked-button (click)="maximize()" [disabled]="state.isMax || state.isIgnored">
          <span class="flex"><mat-icon fontIcon="keyboard_double_arrow_up" inline></mat-icon></span>
        </button>
        <button mat-stroked-button (click)="increment()" [disabled]="state.isMax || state.isIgnored">
          <span class="flex"><mat-icon fontIcon="add" inline></mat-icon></span>
        </button>
        <button mat-stroked-button (click)="decrement()" [disabled]="state.isMin || state.isIgnored">
          <span class="flex"><mat-icon fontIcon="remove" inline></mat-icon></span>
        </button>
        <button mat-stroked-button (click)="minimize()" [disabled]="state.isMin || state.isIgnored">
          <span class="flex">0</span>
        </button>
        <button mat-stroked-button (click)="toggleIgnored()">
          <span class="flex"><mat-icon [fontIcon]="state.isIgnored ? 'refresh' : 'close'" inline></mat-icon></span>
        </button>
      </div>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      button {
        min-width: unset;
        padding-top: 0.25em;
        padding-bottom: 0.25em;
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
  private readonly state = inject(StatsPokemonState);

  readonly state$ = this.state.state$.pipe(
    map((state) => {
      return {
        isMax: state.evs[this.key] === MAX_EV_VALUE,
        isMin: state.evs[this.key] === 0,
        isIgnored: state.ivs[this.key] === null,
      };
    }),
  );

  @Input() key!: StatKey;

  maximize() {
    const { evs } = this.state.get();
    const free = MAX_EV_TOTAL - sumOfStatValues(evs);
    const max = Math.min(evs[this.key] + free, MAX_EV_VALUE);
    this.setEV(asEV(max));
  }

  minimize() {
    this.setEV(asEV(0));
  }

  increment() {
    const {
      pokemon,
      level,
      nature,
      ivs: { [this.key]: iv },
      evs: { [this.key]: ev },
    } = this.state.get();
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const base = asStat(pokemon!.baseStats[this.key]);
    if (this.key === 'H') {
      const increamented = calculateIncrementedEVForHP(base, level, iv!, ev);
      this.setEV(increamented);
    } else {
      const increamented = calculateIncrementedEVForNonHP(base, level, iv!, ev, nature.values[this.key]);
      this.setEV(increamented);
    }
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
  }

  decrement() {
    const {
      pokemon,
      level,
      nature,
      ivs: { [this.key]: iv },
      evs: { [this.key]: ev },
    } = this.state.get();
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const base = asStat(pokemon!.baseStats[this.key]);
    if (this.key === 'H') {
      const decremented = calculateDecrementedEVForHP(base, level, iv!, ev);
      this.setEV(decremented);
    } else {
      const decremented = calculateDecrementedEVForNonHP(base, level, iv!, ev, nature.values[this.key]);
      this.setEV(decremented);
    }
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
  }

  toggleIgnored() {
    const { ivs, evs } = this.state.get();
    const isIgnored = ivs[this.key] === null;
    this.state.set({
      ivs: { ...ivs, [this.key]: isIgnored ? asIV(31) : null },
      evs: { ...evs, [this.key]: asEV(0) },
    });
  }

  private setEV(value: EV) {
    const { evs } = this.state.get();
    this.state.set({ evs: { ...evs, [this.key]: value } });
  }
}
