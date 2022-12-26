import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAX_EV_TOTAL } from '@lib/data';

@Component({
  selector: 'ev-total-control',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="values">
      <span [class.error]="isTooHigh">{{ usedEVs }}</span> / <span>{{ maxEVTotal }}</span>
    </div>
    <div class="buttons">
      <button (click)="reset.emit()">Reset</button>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        justify-content: space-between;
        column-gap: 0.5em;
      }
      .values {
        display: flex;
        column-gap: 0.25em;
      }
      .error {
        color: red;
        font-weight: bold;
      }
      button {
        padding: 0 4px;
        font-size: 0.75rem;
      }
    `,
  ],
})
export class EVTotalControlComponent {
  @Input() usedEVs = 0;
  @Output() readonly reset = new EventEmitter<void>();

  readonly maxEVTotal = MAX_EV_TOTAL;

  get isTooHigh(): boolean {
    return this.usedEVs > this.maxEVTotal;
  }
}
