import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';

@Component({
  selector: 'level-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <input
      type="number"
      min="1"
      max="100"
      required
      [ngModel]="value"
      (ngModelChange)="setValue($event)"
      (click)="onTouched()"
      [disabled]="disabled"
    />
    <div class="buttons">
      <button (click)="onTouched(); setValue(50)" [disabled]="disabled">50</button>
      <button (click)="onTouched(); setValue(100)" [disabled]="disabled">100</button>
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
        width: 3.75em;
      }
      button {
        padding: 0 4px;
      }
      .buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 4px;
      }
    `,
  ],
})
export class LevelInputComponent implements ControlValueAccessor {
  private readonly ngControl = inject(NgControl, { optional: true });

  disabled = false;
  value = 0;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (_: number) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  setValue(value: number): void {
    this.value = value;
    this.onChange(value);
  }

  writeValue(value: number): void {
    this.value = value;
  }
  registerOnChange(fn: (_: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
