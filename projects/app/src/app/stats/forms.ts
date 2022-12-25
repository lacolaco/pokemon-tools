import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ev, EV, iv, IV, stat, Stat } from '@lib/model';
import { PokemonData } from '@lib/data';
import { merge, Observable } from 'rxjs';
import { createZodTypeControl, getValidValueChanges } from '../utitilites/forms';

export function createPokemonControl(defaultValue: PokemonData): FormControl<PokemonData> {
  return new FormControl(defaultValue, {
    validators: [Validators.required],
    nonNullable: true,
  });
}

export function createEVControl(): FormControl<EV> {
  return createZodTypeControl(EV, ev(0), {
    validators: [Validators.required],
  });
}

export function createIVControl(): FormControl<IV> {
  return createZodTypeControl(IV, iv(0), {
    validators: [Validators.required],
  });
}

export function createStatControl(): FormControl<Stat> {
  return createZodTypeControl(Stat, stat(0), {
    validators: [Validators.required],
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
  return merge(getValidValueChanges(group.controls.ev), getValidValueChanges(group.controls.iv));
}

export function getStatValueChanges(group: StatFormGroup): Observable<unknown> {
  return merge(getValidValueChanges(group.controls.stat));
}
