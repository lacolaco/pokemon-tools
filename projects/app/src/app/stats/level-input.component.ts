import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SimpleControlValueAccessor } from '../utitilites/forms';

@Component({
  selector: 'level-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <input type="number" min="1" max="100" required [formControl]="formControl" (click)="onTouched()" />
    <div class="buttons">
      <button (click)="onTouched(); setValue(50)" [disabled]="formControl.disabled">50</button>
      <button (click)="onTouched(); setValue(100)" [disabled]="formControl.disabled">100</button>
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
export class LevelInputComponent extends SimpleControlValueAccessor<number> {
  readonly formControl = new FormControl(1, { nonNullable: true });

  constructor() {
    super();
    this.formControl.valueChanges.pipe(this.takeUntilDestroyed()).subscribe((value) => {
      this.onChange(value);
    });
  }

  override writeValue(value: number): void {
    this.formControl.setValue(value, { emitEvent: false });
  }

  override setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  setValue(value: number): void {
    this.formControl.setValue(value);
  }
}
