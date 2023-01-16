import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Nature, natures } from '@lib/stats';
import { SimpleControlValueAccessor } from '../../utitilites/forms';

@Component({
  selector: 'nature-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule],
  template: `
    <mat-form-field
      appearance="outline"
      floatLabel="always"
      hideRequiredMarker
      subscriptSizing="dynamic"
      class="w-full text-sm"
    >
      <mat-label>性格</mat-label>
      <mat-select [formControl]="formControl" (click)="onTouched()">
        <mat-option *ngFor="let option of options; trackBy: trackNature" [value]="option" class="text-sm">
          {{ option.name }}
        </mat-option>
      </mat-select>
    </mat-form-field>
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
