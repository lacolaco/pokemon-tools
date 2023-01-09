import { isDevMode } from '@angular/core';
import { compareStatValues, StatValues } from '@lib/stats';
import { distinctUntilChanged, filter, MonoTypeOperatorFunction, OperatorFunction, pipe, tap } from 'rxjs';

export function distinctUntilStatValuesChanged<V>(): MonoTypeOperatorFunction<StatValues<V>> {
  return pipe(
    distinctUntilChanged((a, b) => {
      return compareStatValues(a, b);
    }),
  );
}

export function debug<T>(label: string): MonoTypeOperatorFunction<T> {
  if (!isDevMode()) {
    return (source) => source;
  }
  return pipe(
    tap((value) => {
      console.log(label, value);
    }),
  );
}

export function filterNonNullable<T>(): OperatorFunction<T | null | undefined, T> {
  return (source) => source.pipe(filter(isNonNullable));
}

function isNonNullable<T>(value: T | null | undefined): value is T {
  return value != null;
}
