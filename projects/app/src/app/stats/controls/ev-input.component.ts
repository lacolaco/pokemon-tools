import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { asEV, EV, MAX_EV_TOTAL, MAX_EV_VALUE } from '@lib/stats';
import { SimpleControlValueAccessor } from '../../utitilites/forms';

const STEP = 4;

@Component({
  selector: 'ev-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <input
      type="number"
      min="0"
      max="252"
      step="4"
      required
      [formControl]="formControl"
      (click)="onTouched()"
      class="form-input"
    />
    <div class="grid grid-flow-col grid-rows-2 sm:grid-rows-1 gap-1">
      <button (click)="onTouched(); increment()" [disabled]="formControl.disabled || isMax">
        <mat-icon fontIcon="add" inline></mat-icon>
      </button>
      <button (click)="onTouched(); decrement()" [disabled]="formControl.disabled || isMin">
        <mat-icon fontIcon="remove" inline></mat-icon>
      </button>
      <button (click)="onTouched(); setMaxValue()" [disabled]="formControl.disabled || isMax">
        <mat-icon fontIcon="keyboard_double_arrow_up" inline></mat-icon>
      </button>
      <button (click)="onTouched(); setZero()" [disabled]="formControl.disabled || isMin">0</button>
    </div>
  `,
  styleUrls: ['./ev-input.component.scss'],
})
export class EVInputComponent extends SimpleControlValueAccessor<EV> {
  readonly formControl = new FormControl(asEV(0), { nonNullable: true });

  @Input() usedEVs = 0;

  get max(): number {
    const free = MAX_EV_TOTAL - this.usedEVs;
    return Math.min(this.formControl.value + free, MAX_EV_VALUE);
  }

  get isMax(): boolean {
    return this.max - this.formControl.value < STEP;
  }

  get isMin(): boolean {
    return this.formControl.value <= 0;
  }

  protected get value() {
    return this.formControl.value;
  }

  constructor() {
    super();
    this.formControl.valueChanges.pipe(this.takeUntilDestroyed()).subscribe((value) => {
      this.onChange(value);
    });
  }

  override writeValue(value: EV): void {
    if (this.value !== value) {
      this.formControl.setValue(value, { emitEvent: false });
    }
  }

  override setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  increment() {
    this.formControl.setValue(asEV(this.formControl.value + STEP));
  }

  decrement() {
    this.formControl.setValue(asEV(this.formControl.value - STEP));
  }

  setMaxValue() {
    this.formControl.setValue(asEV(this.max));
  }

  setZero() {
    this.formControl.setValue(asEV(0));
  }
}
