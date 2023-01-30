import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EV_STEP, MAX_EV_TOTAL, MAX_EV_VALUE, StatKey } from '@lib/stats';
import { PokemonsItemState } from '../../pokemons/pokemons-item.usecase';

@Component({
  selector: 'stat-commands',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-flow-row gap-y-1 py-1">
      <button mat-stroked-button (click)="maximize.emit()" [disabled]="isMax || isIgnored">
        <span class="flex"><mat-icon fontIcon="keyboard_double_arrow_up" inline></mat-icon></span>
      </button>
      <button mat-stroked-button (click)="increment.emit()" [disabled]="isMax || isIgnored">
        <span class="flex"><mat-icon fontIcon="add" inline></mat-icon></span>
      </button>
      <button mat-stroked-button (click)="decrement.emit()" [disabled]="isMin || isIgnored">
        <span class="flex"><mat-icon fontIcon="remove" inline></mat-icon></span>
      </button>
      <button mat-stroked-button (click)="minimize.emit()" [disabled]="isMin || isIgnored">
        <span class="flex">0</span>
      </button>
      <button mat-stroked-button (click)="toggleIgnored.emit()">
        <span class="flex"><mat-icon [fontIcon]="isIgnored ? 'refresh' : 'close'" inline></mat-icon></span>
      </button>
    </div>
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
  @Input() key!: StatKey;
  @Input() state!: PokemonsItemState;

  @Output() maximize = new EventEmitter<void>();
  @Output() minimize = new EventEmitter<void>();
  @Output() increment = new EventEmitter<void>();
  @Output() decrement = new EventEmitter<void>();
  @Output() toggleIgnored = new EventEmitter<void>();

  get isMax() {
    const free = MAX_EV_TOTAL - this.state.usedEVs;
    return free < EV_STEP || this.state.evs[this.key] === MAX_EV_VALUE;
  }

  get isMin() {
    return this.state.evs[this.key] === 0;
  }

  get isIgnored() {
    return this.state.ivs[this.key] === null;
  }
}
