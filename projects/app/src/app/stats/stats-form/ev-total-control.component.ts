import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAX_EV_TOTAL } from '@lib/data';

@Component({
  selector: 'ev-total-control',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  template: `
    <div class="row">
      <div class="total">
        努力値合計: <span [class.error]="isTooHigh">{{ usedEVs }}</span> / <span>{{ maxEVTotal }}</span>
      </div>
      <button (click)="reset.emit()" matTooltip="すべての努力値を0にリセットします">リセット</button>
      <button (click)="optimizeDurability.emit()" matTooltip="総合耐久指数が最大になるようにH,B,Dの努力値を配分します">
        耐久最適化
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: 1fr;
        row-gap: 4px;
      }
      .row {
        display: flex;
        align-items: center;
        column-gap: 8px;
        width: 100%;
      }
      .total {
        display: flex;
        column-gap: 0.25em;
      }
      .error {
        color: red;
        font-weight: bold;
      }
      button {
        padding: 4px;
        font-size: 0.85rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EVTotalControlComponent {
  @Input() usedEVs = 0;
  @Output() readonly reset = new EventEmitter<void>();
  @Output() readonly optimizeDurability = new EventEmitter<void>();

  readonly maxEVTotal = MAX_EV_TOTAL;

  get isTooHigh(): boolean {
    return this.usedEVs > this.maxEVTotal;
  }
}
