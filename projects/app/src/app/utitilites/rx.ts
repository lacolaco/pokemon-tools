import { StatValues } from '@lib/model';
import { distinctUntilSomeChanged } from '@rx-angular/state';
import { MonoTypeOperatorFunction, pipe } from 'rxjs';

export function distinctUntilStatValuesChanged<V extends number>(): MonoTypeOperatorFunction<StatValues<V>> {
  return pipe(distinctUntilSomeChanged(['H', 'A', 'B', 'C', 'D', 'S']));
}
