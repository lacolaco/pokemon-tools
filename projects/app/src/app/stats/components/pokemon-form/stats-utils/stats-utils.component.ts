import { formatNumber } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppStrokedButton } from '@app/shared/ui/buttons';
import { MAX_EV_TOTAL } from '@lib/stats';
import { PokemonStats } from '../../../models/pokemon-state';

@Component({
  selector: 'stats-utils',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTooltipModule, AppStrokedButton],
  template: `
    <div class="flex flex-col gap-y-1">
      <div class="flex flex-col items-start">
        <div>
          努力値合計: <span class="{{ isTooHigh ? 'text-red-500 font-bold' : '' }}">{{ state.usedEVs }}</span> /
          <span>{{ maxEVTotal }}</span>
        </div>
        <div>
          総合耐久指数: <span>{{ defenseFactorString }}</span>
        </div>
      </div>
      <div class="flex flex-row items-center justify-start gap-x-1">
        <button
          app-stroked-button
          class="text-sm"
          (click)="resetEVs.emit()"
          matTooltip="すべての努力値をリセットします"
        >
          リセット
        </button>
        <button
          app-stroked-button
          class="text-sm"
          (click)="optimizeDefenseEVs.emit()"
          matTooltip="総合耐久指数が最大になるように努力値を配分します"
        >
          耐久最適化
        </button>
      </div>
    </div>
  `,
  host: {
    class: 'block',
  },
})
export class StatUtilsComponent {
  @Input() state!: PokemonStats;
  @Output() resetEVs = new EventEmitter<void>();
  @Output() optimizeDefenseEVs = new EventEmitter<void>();

  get isTooHigh() {
    return this.state.usedEVs > MAX_EV_TOTAL;
  }

  get defenseFactorString() {
    return this.state.defenseFactor ? formatNumber(this.state.defenseFactor, 'en-US', '1.0-0') : '-';
  }

  readonly maxEVTotal = MAX_EV_TOTAL;
}
