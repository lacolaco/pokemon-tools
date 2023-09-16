import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AppStrokedButton } from '@app/shared/ui/buttons';
import { EV_STEP, MAX_EV_TOTAL, MAX_EV_VALUE, StatKey } from '@lib/stats';
import { PokemonWithStats } from '../../models/pokemon-state';
import { PokemonsItemUsecase } from '../../pokemons/pokemons-item.usecase';

@Component({
  selector: 'stat-commands',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, AppStrokedButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white p-2 rounded border border-solid border-gray-500 shadow">
      <div class="grid grid-flow-row gap-y-1">
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
  private readonly usecase = inject(PokemonsItemUsecase);

  @Input({ required: true }) index!: number;
  @Input({ required: true }) pokemon!: PokemonWithStats;
  @Input({ required: true }) key!: StatKey;

  get state() {
    return {
      isMax: MAX_EV_TOTAL - this.pokemon.usedEVs < EV_STEP || this.pokemon.evs[this.key] === MAX_EV_VALUE,
      isMin: this.pokemon.evs[this.key] === 0,
      isIgnored: this.pokemon.ivs[this.key] === null,
    };
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
