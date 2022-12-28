import { distinctUntilChanged, MonoTypeOperatorFunction, pipe } from 'rxjs';

export function distinctUntilArrayChanged<T extends unknown[]>(): MonoTypeOperatorFunction<T> {
  return pipe(
    distinctUntilChanged((a, b) => {
      if (a.length !== b.length) {
        return false;
      }
      return a.every((value, index) => value === b[index]);
    }),
  );
}
