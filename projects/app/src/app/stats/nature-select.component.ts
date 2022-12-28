import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { natures } from '@lib/data';
import { Nature } from '@lib/model';
import { SimpleControlValueAccessor } from '../utitilites/forms';

@Component({
  selector: 'nature-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <select [formControl]="formControl" (click)="onTouched()">
      <option *ngFor="let option of options; trackBy: trackNature" [ngValue]="option">
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NatureSelectComponent extends SimpleControlValueAccessor<Nature> {
  readonly options = [...natures].sort((a, b) => a.name.localeCompare(b.name));
  readonly formControl = new FormControl(natures[0], { nonNullable: true });

  constructor() {
    super();
    this.formControl.valueChanges.pipe(this.takeUntilDestroyed()).subscribe((value) => {
      this.onChange(value);
    });
  }

  override writeValue(value: Nature): void {
    this.formControl.setValue(value, { emitEvent: false });
  }

  override setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  trackNature(index: number, nature: Nature): string {
    return nature.name;
  }
}
