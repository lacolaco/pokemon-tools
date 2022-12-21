import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ev, EV } from '@lib/calc';

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
