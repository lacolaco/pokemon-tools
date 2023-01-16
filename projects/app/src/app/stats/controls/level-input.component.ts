import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { asLevel, Level } from '@lib/stats';
import { SimpleControlValueAccessor } from '../../utitilites/forms';

@Component({
  selector: 'level-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule],
  template: `
    <mat-form-field
      appearance="outline"
      floatLabel="always"
      hideRequiredMarker
      subscriptSizing="dynamic"
      class="w-full text-sm"
    >
      <mat-label>レベル</mat-label>
      <input
        matInput
        type="number"
        min="1"
        max="100"
        aria-label="レベル"
        required
        [formControl]="formControl"
        (click)="onTouched()"
      />
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
export class LevelInputComponent extends SimpleControlValueAccessor<Level> {
  readonly formControl = new FormControl(asLevel(1), { nonNullable: true });

  protected get value() {
    return this.formControl.value;
  }

  constructor() {
    super();
    this.formControl.valueChanges.pipe(this.takeUntilDestroyed()).subscribe((value) => {
      this.onChange(value);
    });
  }

  override writeValue(value: Level): void {
    if (this.value !== value) {
      this.formControl.setValue(value, { emitEvent: false });
    }
  }

  override setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  setValue(value: number): void {
    this.formControl.setValue(asLevel(value));
  }
}
