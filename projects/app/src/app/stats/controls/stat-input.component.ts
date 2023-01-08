import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { asStat, Stat } from '@lib/stats';
import { distinctUntilChanged, map } from 'rxjs';
import { SimpleControlValueAccessor } from '../../utitilites/forms';

@Component({
  selector: 'stat-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <input
      type="number"
      min="1"
      max="999"
      required
      [formControl]="formControl"
      (click)="onTouched(); dispatchChange.emit()"
      (blur)="dispatchChange.emit()"
      class="form-input"
    />
    <div class="buttons">
      <button (click)="onTouched(); increment()" [disabled]="formControl.disabled || value === null || isMax">
        <mat-icon fontIcon="add" inline></mat-icon>
      </button>
      <button (click)="onTouched(); decrement()" [disabled]="formControl.disabled || value === null || isMin">
        <mat-icon fontIcon="remove" inline></mat-icon>
      </button>
    </div>
  `,
  styleUrls: ['./stat-input.component.scss'],
})
export class StatInputComponent extends SimpleControlValueAccessor<Stat> implements OnInit {
  readonly formControl = new FormControl(asStat(1), { nonNullable: true });

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
