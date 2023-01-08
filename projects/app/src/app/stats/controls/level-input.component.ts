import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { asLevel, Level } from '@lib/stats';
import { SimpleControlValueAccessor } from '../../utitilites/forms';

@Component({
  selector: 'level-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <input
      type="number"
      min="1"
      max="100"
      required
      [formControl]="formControl"
      (click)="onTouched()"
      class="form-input"
    />
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
