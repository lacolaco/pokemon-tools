import { isDevMode } from '@angular/core';
import { compareStatValues, StatValues } from '@lib/stats';
import { distinctUntilChanged, MonoTypeOperatorFunction, pipe, tap } from 'rxjs';

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
