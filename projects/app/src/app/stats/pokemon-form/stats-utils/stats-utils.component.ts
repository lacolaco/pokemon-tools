import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAX_EV_TOTAL } from '@lib/stats';
import { PokemonsItemState } from '../../pokemons/pokemons-item.usecase';

@Component({
  selector: 'stats-utils',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatTooltipModule, MatButtonModule],
  template: `
    <div class="grid grid-flow-row gap-y-1">
      <div class="flex flex-row items-center gap-x-1">
        努力値合計: <span class="{{ isTooHigh ? 'text-red-500 font-bold' : '' }}">{{ state.usedEVs }}</span> /
        <span>{{ maxEVTotal }}</span>
      </div>
      <div class="grid grid-flow-col justify-start items-center gap-x-1">
        <button mat-stroked-button class="py-1" (click)="resetEVs.emit()" matTooltip="すべての努力値をリセットします">
          リセット
        </button>
        <button
          mat-stroked-button
          (click)="optimizeDefenseEVs.emit()"
          matTooltip="総合耐久指数が最大になるように努力値を配分します"
        >
          耐久最適化
        </button>
      </div>
    </div>
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
})
export class StatUtilsComponent {
  @Input() state!: PokemonsItemState;
  @Output() resetEVs = new EventEmitter<void>();
  @Output() optimizeDefenseEVs = new EventEmitter<void>();

  get isTooHigh() {
    return this.state.usedEVs > MAX_EV_TOTAL;
  }
  readonly maxEVTotal = MAX_EV_TOTAL;
}
