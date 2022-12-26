import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { iv, IV } from '@lib/model';
import { SimpleControlValueAccessor } from '../utitilites/forms';

@Component({
  selector: 'iv-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <input type="number" min="0" max="31" required [formControl]="formControl" (click)="onTouched()" />
    <div class="buttons">
      <button (click)="onTouched(); setValue(31)" [disabled]="formControl.disabled">31</button>
      <button (click)="onTouched(); setValue(0)" [disabled]="formControl.disabled">0</button>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: row;
        column-gap: 4px;
      }
      input {
        width: 3em;
      }
      button {
        padding: 0 4px;
        font-size: 0.85em;
      }
      .buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 4px;
      }
    `,
  ],
})
export class IVInputComponent extends SimpleControlValueAccessor<IV> {
  readonly formControl = new FormControl(iv(0), { nonNullable: true });

  constructor() {
    super();
    this.formControl.valueChanges.pipe(this.takeUntilDestroyed()).subscribe((value) => {
      this.onChange(value);
    });
  }

  override writeValue(value: IV): void {
    this.formControl.setValue(value, { emitEvent: false });
  }

  override setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  setValue(value: number): void {
    this.formControl.setValue(iv(value));
  }
}
