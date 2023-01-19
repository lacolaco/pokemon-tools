import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { asIV, IV } from '@lib/stats';
import { SimpleControlValueAccessor } from '../../utitilites/forms';

@Component({
  selector: 'iv-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule],
  template: `
    <mat-form-field appearance="outline" hideRequiredMarker subscriptSizing="dynamic" class="w-full">
      <mat-label *ngIf="showLabel">個体値</mat-label>
      <input matInput type="number" min="0" max="31" [formControl]="formControl" (click)="onTouched()" />
    </mat-form-field>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class IVInputComponent extends SimpleControlValueAccessor<IV | null> {
  @Input() showLabel = false;
  @Input() disableNull = false;

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
