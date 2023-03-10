import { Directive, inject, OnDestroy } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, ValidatorFn } from '@angular/forms';
import { filter, map, Observable, pipe, Subject, takeUntil, tap } from 'rxjs';
import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

@Directive()
export abstract class SimpleControlValueAccessor<T> implements ControlValueAccessor, OnDestroy {
  protected onChange: (_: T) => void = noop;
  protected onTouched: () => void = noop;

  protected readonly ngControl = inject(NgControl, { optional: true });
  private readonly onDestroy$ = new Subject<void>();
  protected readonly takeUntilDestroyed = <T>() => pipe<Observable<T>, Observable<T>>(takeUntil(this.onDestroy$));

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  abstract setDisabledState(isDisabled: boolean): void;

  abstract writeValue(value: T): void;

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  registerOnChange(fn: (_: T) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}

export function getValidValueChanges<T>(control: AbstractControl<unknown, T>): Observable<T> {
  return control.valueChanges.pipe(
    tap(() => control.updateValueAndValidity({ emitEvent: false })),
    filter(() => control.valid),
    map(() => control.getRawValue()),
  );
}

export function zodTypeValidator<T extends z.ZodType>(zodType: T): ValidatorFn {
  return (control: AbstractControl) => {
    // zod のスキーマ定義から使ってバリデーションする
    const value = zodType.safeParse(control.value);
    if (!value.success) {
      // zod のエラーコードでバリデーションエラーを返す
      return {
        type_error: value.error.message,
      };
    }
    return null;
  };
}
