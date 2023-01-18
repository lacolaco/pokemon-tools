import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { asEV, MAX_EV_TOTAL, optimizeDefenseEVs, Stat, StatValues, sumOfStatValues } from '@lib/stats';
import { map } from 'rxjs';
import { StatsPokemonState } from '../../pokemon-state';

@Component({
  selector: 'stats-utils',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatButtonModule],
  template: `
    <ng-container *ngIf="state$ | async as state">
      <div class="grid grid-flow-row gap-y-1">
        <div class="flex flex-row items-center gap-x-1">
          努力値合計: <span class="{{ state.isTooHigh ? 'text-red-500 font-bold' : '' }}">{{ state.usedEVs }}</span> /
          <span>{{ maxEVTotal }}</span>
        </div>
        <div class="grid grid-flow-col justify-start items-center gap-x-1">
          <button mat-stroked-button class="py-1" (click)="resetEVs()" matTooltip="すべての努力値をリセットします">
            リセット
          </button>
          <button
            mat-stroked-button
            (click)="optimizeDefenseEVs()"
            matTooltip="総合耐久指数が最大になるように努力値を配分します"
          >
            耐久最適化
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
      button {
        padding-top: 0.25em;
        padding-bottom: 0.25em;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatUtilsComponent {
  private readonly state = inject(StatsPokemonState);

  readonly state$ = this.state.state$.pipe(
    map((state) => {
      const usedEVs = sumOfStatValues(state.evs);
      return {
        usedEVs,
        isTooHigh: usedEVs > MAX_EV_TOTAL,
      };
    }),
  );

  readonly maxEVTotal = MAX_EV_TOTAL;

  resetEVs() {
    this.state.set({
      evs: { H: asEV(0), A: asEV(0), B: asEV(0), C: asEV(0), D: asEV(0), S: asEV(0) },
    });
  }

  optimizeDefenseEVs() {
    const { pokemon, level, nature, ivs, evs } = this.state.get();
    if (pokemon) {
      this.state.set({
        evs: optimizeDefenseEVs(pokemon.baseStats as StatValues<Stat>, level, ivs, evs, nature),
      });
    }
  }
}
