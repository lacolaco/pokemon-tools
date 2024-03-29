import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { asLevel, Level } from '@lib/stats';
import { FormFieldModule } from './forms/form-field.component';
import { SimpleControlValueAccessor } from './utitilites/forms';

@Component({
  selector: 'level-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormFieldModule],
  template: `
    <app-form-field label="レベル" [showLabel]="true">
      <input app-form-control type="number" min="1" max="100" [formControl]="formControl" (click)="onTouched()" />
    </app-form-field>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      app-form-field {
        width: calc(4em);
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
