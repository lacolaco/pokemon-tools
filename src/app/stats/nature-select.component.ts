import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ControlValueAccessor, NgControl } from '@angular/forms';
import { natures, Nature } from '@lib/calc';

@Component({
  selector: 'nature-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <select [disabled]="disabled" (click)="onTouched()" [ngModel]="value" (ngModelChange)="onChange($event)">
      <option *ngFor="let option of options" [ngValue]="option">
        {{ option.name }}
      </option>
    </select>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class NatureSelectComponent implements ControlValueAccessor {
  private readonly ngControl = inject(NgControl, { optional: true });

  protected readonly options = natures;

  disabled = false;
  value: Nature | null = null;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (_: Nature) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: Nature | null): void {
    this.value = value;
  }

  registerOnChange(fn: (_: Nature | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
