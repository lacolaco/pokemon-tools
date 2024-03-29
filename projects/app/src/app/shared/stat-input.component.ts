import { Component, EventEmitter, Input, OnInit, booleanAttribute } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormFieldModule } from '@app/shared/forms/form-field.component';
import { SimpleControlValueAccessor } from '@app/shared/utitilites/forms';
import { asStat, Stat } from '@lib/stats';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'stat-input',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldModule],
  template: `
    <app-form-field class="w-full" [label]="label" [showLabel]="showLabel">
      <input
        app-form-control
        type="number"
        min="1"
        max="999"
        [formControl]="formControl"
        (click)="onTouched(); dispatchChange.emit()"
        (blur)="dispatchChange.emit()"
      />
    </app-form-field>
  `,
  host: {
    class: 'block',
  },
})
export class StatInputComponent extends SimpleControlValueAccessor<Stat> implements OnInit {
  readonly formControl = new FormControl(asStat(1), { nonNullable: true });

  @Input() label = '能力値';
  @Input({ transform: booleanAttribute }) showLabel = false;
  @Input() isMin = false;
  @Input() isMax = false;

  protected readonly dispatchChange = new EventEmitter<void>();

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

  override writeValue(value: Stat): void {
    if (value !== this.value) {
      this.formControl.setValue(value, { emitEvent: false });
    }
    this.setDisabledState(this.value === null);
  }

  override setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  increment() {
    if (this.value === null) {
      return;
    }
    this.setValue(this.value + 1);
  }

  decrement() {
    if (this.value === null) {
      return;
    }
    this.setValue(this.value - 1);
  }

  private setValue(value: number): void {
    this.formControl.setValue(asStat(value));
    this.dispatchChange.emit();
  }
}
