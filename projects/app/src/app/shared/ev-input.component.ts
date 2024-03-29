import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { asEV, EV, MAX_EV_TOTAL, MAX_EV_VALUE } from '@lib/stats';
import { FormFieldModule } from './forms/form-field.component';
import { SimpleControlValueAccessor } from './utitilites/forms';

const STEP = 4;

@Component({
  selector: 'ev-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormFieldModule],
  template: `
    <app-form-field class="w-full" label="努力値" [showLabel]="showLabel">
      <input
        app-form-control
        type="number"
        min="0"
        max="252"
        step="4"
        required
        [formControl]="formControl"
        (click)="onTouched()"
      />
    </app-form-field>
  `,
  host: {
    class: 'block',
  },
})
export class EVInputComponent extends SimpleControlValueAccessor<EV> {
  readonly formControl = new FormControl(asEV(0), { nonNullable: true });

  @Input({ transform: booleanAttribute }) showLabel = false;
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
