import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { asIV, IV } from '@lib/stats';
import { distinctUntilChanged, map } from 'rxjs';
import { FormFieldModule } from './forms/form-field.component';
import { SimpleControlValueAccessor } from './utitilites/forms';

@Component({
  selector: 'iv-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, FormFieldModule],
  template: `
    <app-form-field class="w-full" label="個体値" [showLabel]="showLabel">
      <input
        app-form-control
        type="number"
        min="0"
        max="31"
        [formControl]="formControl"
        (click)="onTouched(); dispatchChange.emit()"
        (blur)="dispatchChange.emit()"
      />
    </app-form-field>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class IVInputComponent extends SimpleControlValueAccessor<IV | null> {
  @Input() showLabel = false;
  @Input() disableNull = false;

  protected readonly dispatchChange = new EventEmitter<void>();
  readonly formControl = new FormControl<IV | null>(asIV(0), { nonNullable: true });

  protected get value() {
    return this.formControl.value;
  }

  ngOnInit() {
    // 編集中には値の変更を通知しない
    this.dispatchChange
      .pipe(
        this.takeUntilDestroyed(),
        map(() => this.value),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        this.onChange(value);
      });
  }

  override writeValue(value: IV): void {
    if (this.value !== value) {
      this.formControl.setValue(value, { emitEvent: false });
    }
  }

  override setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  setValue(value: number | null): void {
    this.formControl.setValue(value === null ? null : asIV(value));
  }
}
