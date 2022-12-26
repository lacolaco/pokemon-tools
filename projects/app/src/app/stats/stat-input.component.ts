import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { stat, Stat } from '@lib/model';
import { SimpleControlValueAccessor } from '../utitilites/forms';

@Component({
  selector: 'stat-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <input type="number" min="1" max="999" required [formControl]="formControl" (click)="onTouched()" />
    <div class="buttons">
      <button (click)="onTouched(); setValue(formControl.value + 1)" [disabled]="formControl.disabled || isMax">
        ▲
      </button>
      <button (click)="onTouched(); setValue(formControl.value - 1)" [disabled]="formControl.disabled || isMin">
        ▼
      </button>
    </div>
  `,
  styleUrls: ['./stat-input.component.scss'],
})
export class StatInputComponent extends SimpleControlValueAccessor<Stat> {
  readonly formControl = new FormControl(stat(1), { nonNullable: true });

  @Input() isMin = false;
  @Input() isMax = false;

  constructor() {
    super();
    this.formControl.valueChanges.pipe(this.takeUntilDestroyed()).subscribe((value) => {
      this.onChange(value);
    });
  }

  override writeValue(value: Stat): void {
    this.formControl.setValue(value, { emitEvent: false });
  }

  override setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  setValue(value: number): void {
    this.formControl.setValue(stat(value));
  }
}
