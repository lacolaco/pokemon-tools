import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ev, EV, iv, IV, stat, Stat } from '@lib/calc';
import { combineLatest, filter, map, merge, Observable } from 'rxjs';

export function getValidValues<T>(control: AbstractControl<T>): Observable<T> {
  return combineLatest([control.valueChanges, control.statusChanges]).pipe(
    filter(([, status]) => status === 'VALID'),
    map(([value]) => value),
  );
}

export function createEVControl(defaultValue: EV = ev(0)): FormControl<EV> {
  return new FormControl<EV>(defaultValue, {
    validators: [
      Validators.required,
      (control: FormControl) => {
        const value = EV.safeParse(control.value);
        if (!value.success) {
          return { invalid: true };
        }
        return null;
      },
    ],
    nonNullable: true,
  });
}

export function createIVControl(defaultValue: IV = iv(0)): FormControl<IV> {
  return new FormControl<IV>(defaultValue, {
    validators: [
      Validators.required,
      (control: FormControl) => {
        const value = IV.safeParse(control.value);
        if (!value.success) {
          return { invalid: true };
        }
        return null;
      },
    ],
    nonNullable: true,
  });
}

export function createStatControl(defaultValue: Stat = stat(0)): FormControl<Stat> {
  return new FormControl<Stat>(defaultValue, {
    validators: [
      Validators.required,
      (control: FormControl) => {
        const value = Stat.safeParse(control.value);
        if (!value.success) {
          return { invalid: true };
        }
        return null;
      },
    ],
    nonNullable: true,
  });
}

type StatFormGroup = FormGroup<{
  stat: FormControl<Stat>;
  iv: FormControl<IV>;
  ev: FormControl<EV>;
}>;

export function createStatControlGroup(): StatFormGroup {
  return new FormGroup({
    stat: createStatControl(),
    iv: createIVControl(),
    ev: createEVControl(),
  });
}

export function getStatParamsChanges(group: StatFormGroup): Observable<unknown> {
  return merge(getValidValues(group.controls.ev), getValidValues(group.controls.iv));
}

export function getStatValueChanges(group: StatFormGroup): Observable<unknown> {
  return merge(getValidValues(group.controls.stat));
}
