import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { asIV, IV } from '@lib/model';
import { SimpleControlValueAccessor } from '../../utitilites/forms';

@Component({
  selector: 'iv-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <input
      type="number"
      min="0"
      max="31"
      required
      [formControl]="formControl"
      (click)="onTouched()"
      class="form-input"
    />
    <div class="buttons">
      <button (click)="onTouched(); setValue(31)" [disabled]="formControl.disabled">31</button>
      <button (click)="onTouched(); setValue(0)" [disabled]="formControl.disabled">0</button>
      <button (click)="onTouched(); setValue(null)" [disabled]="formControl.disabled">
        <mat-icon fontIcon="close" inline></mat-icon>
      </button>
    </div>
  `,
  styleUrls: ['./iv-input.component.scss'],
})
export class IVInputComponent extends SimpleControlValueAccessor<IV | null> {
  readonly formControl = new FormControl<IV | null>(asIV(0), { nonNullable: true });

  protected get value() {
    return this.formControl.value;
  }

  constructor() {
    super();
    this.formControl.valueChanges.pipe(this.takeUntilDestroyed()).subscribe((value) => {
      this.onChange(value);
    });
  }

  override writeValue(value: IV): void {
    if (this.value !== value) {
      this.formControl.setValue(value, { emitEvent: false });
    }
  }

  override setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  setValue(value: number | null): void {
    this.formControl.setValue(value === null ? null : asIV(value));
  }
}
