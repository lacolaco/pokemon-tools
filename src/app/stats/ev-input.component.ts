import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ev, EV } from '@lib/calc';
import { SimpleControlValueAccessor } from '../utitilites/forms';

@Component({
  selector: 'ev-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <input type="number" min="0" max="252" step="4" required [formControl]="formControl" (click)="onTouched()" />
    <div class="buttons">
      <button (click)="onTouched(); setValue(formControl.value + 4)" [disabled]="formControl.disabled || isMax">
        ▲
      </button>
      <button (click)="onTouched(); setValue(formControl.value - 4)" [disabled]="formControl.disabled || isMin">
        ▼
      </button>
      <button (click)="onTouched(); setValue(252)" [disabled]="formControl.disabled">252</button>
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
        width: 3.75em;
      }
      button {
        padding: 0 4px;
      }
      .buttons {
        display: grid;
        grid-template-columns: repeat(4, auto);
        column-gap: 4px;
      }
    `,
  ],
})
export class EVInputComponent extends SimpleControlValueAccessor<EV> {
  readonly formControl = new FormControl(ev(0), { nonNullable: true });

  get isMax(): boolean {
    return this.formControl.value < 252;
  }
  get isMin(): boolean {
    return this.formControl.value > 0;
  }

  constructor() {
    super();
    this.formControl.valueChanges.pipe(this.takeUntilDestroyed()).subscribe((value) => {
      this.onChange(value);
    });
  }

  override writeValue(value: EV): void {
    this.formControl.setValue(value, { emitEvent: false });
  }

  override setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  setValue(value: number): void {
    this.formControl.setValue(ev(value));
  }
}
