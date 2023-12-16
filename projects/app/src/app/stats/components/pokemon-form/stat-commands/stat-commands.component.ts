import { ChangeDetectionStrategy, Component, computed, inject, Input, Signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AppStrokedButton } from '@app/shared/ui/buttons';
import { EV_STEP, MAX_EV_TOTAL, MAX_EV_VALUE, StatKey } from '@lib/stats';
import * as commands from '../../../commands';
import { PokemonState, PokemonStats } from '../../../models/pokemon-state';
import { StatsState } from '../../../state';

@Component({
  selector: 'stat-commands',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, AppStrokedButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white p-2 rounded border border-solid border-gray-500 shadow">
      <div class="grid grid-flow-row gap-y-1">
        <button app-stroked-button class="w-16" (click)="maximize()" [disabled]="status().isMax || status().isIgnored">
          <span class="flex"><mat-icon fontIcon="keyboard_double_arrow_up" inline></mat-icon></span>
        </button>
        <button app-stroked-button class="w-16" (click)="increment()" [disabled]="status().isMax || status().isIgnored">
          <span class="flex"><mat-icon fontIcon="add" inline></mat-icon></span>
        </button>
        <button app-stroked-button class="w-16" (click)="decrement()" [disabled]="status().isMin || status().isIgnored">
          <span class="flex"><mat-icon fontIcon="remove" inline></mat-icon></span>
        </button>
        <button app-stroked-button class="w-16" (click)="minimize()" [disabled]="status().isMin || status().isIgnored">
          <span class="flex">0</span>
        </button>
        <button app-stroked-button class="w-16" (click)="toggleIgnored()">
          <span class="flex"><mat-icon [fontIcon]="status().isIgnored ? 'refresh' : 'close'" inline></mat-icon></span>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      mat-icon {
        min-width: unset;
        margin: 0;
        font-weight: bold;
      }
    `,
  ],
  host: {
    class: 'block',
  },
})
export class StatCommandsComponent {
  readonly state = inject(StatsState);

  @Input({ required: true }) $state!: WritableSignal<PokemonState>;
  @Input({ required: true }) $stats!: Signal<PokemonStats>;
  @Input({ required: true }) key!: StatKey;

  readonly status = computed(() => {
    const { ivs, evs } = this.$state();
    const { usedEVs } = this.$stats();

    return {
      isMax: MAX_EV_TOTAL - usedEVs < EV_STEP || evs[this.key] === MAX_EV_VALUE,
      isMin: evs[this.key] === 0,
      isIgnored: ivs[this.key] === null,
    };
  });

  maximize() {
    commands.maximizeStat(this.$state, this.key);
  }

  minimize() {
    commands.minimizeStat(this.$state, this.key);
  }

  increment() {
    commands.incrementStat(this.$state, this.key);
  }

  decrement() {
    commands.decrementStat(this.$state, this.key);
  }

  toggleIgnored() {
    commands.toggleIgnored(this.$state, this.key);
  }
}
