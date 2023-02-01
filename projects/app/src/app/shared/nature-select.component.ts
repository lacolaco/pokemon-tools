import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Nature, natures } from '@lib/stats';
import { FormFieldModule } from './forms/form-field.component';
import { SimpleControlValueAccessor } from './utitilites/forms';

@Component({
  selector: 'nature-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, FormFieldModule],
  template: `
    <app-form-field label="性格" [showLabel]="true">
      <select app-form-control [formControl]="formControl" (click)="onTouched()">
        <option *ngFor="let option of options; trackBy: trackNature" [ngValue]="option">
          {{ option.name }}
        </option>
      </select>
    </app-form-field>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      app-form-field {
        width: calc(5em + 48px);
      }
    `,
  ],
})
export class NatureSelectComponent extends SimpleControlValueAccessor<Nature> {
  readonly options = Object.values(natures).sort((a, b) => a.name.localeCompare(b.name));
  readonly formControl = new FormControl<Nature>(natures['いじっぱり'], { nonNullable: true });

  protected get value() {
    return this.formControl.value;
  }

  constructor() {
    super();
    this.formControl.valueChanges.pipe(this.takeUntilDestroyed()).subscribe((value) => {
      this.onChange(value);
    });
  }

  override writeValue(value: Nature): void {
    if (this.value !== value) {
      this.formControl.setValue(value, { emitEvent: false });
    }
  }

  override setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  trackNature(index: number, nature: Nature): string {
    return nature.name;
  }
}
