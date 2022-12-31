import { FormControl, FormGroup, Validators } from '@angular/forms';
import { natures, PokemonData } from '@lib/data';
import { asEV, EV, asIV, IV, asStat, Stat, Level, asLevel, Nature } from '@lib/model';
import { merge, Observable } from 'rxjs';
import { emptyPokemon } from '../shared/pokemons';
import { createZodTypeControl, getValidValueChanges } from '../utitilites/forms';

export function createPokemonControl(): FormControl<PokemonData> {
  return new FormControl<PokemonData>(emptyPokemon, {
    validators: [Validators.required],
    nonNullable: true,
  });
}

export function createLevelControl(): FormControl<Level> {
  return createZodTypeControl(Level, asLevel(1), {
    validators: [Validators.required],
  });
}

export function createNatureControl(): FormControl<Nature> {
  return new FormControl(natures[0], {
    validators: [Validators.required],
    nonNullable: true,
  });
}

export function createEVControl(): FormControl<EV> {
  return createZodTypeControl(EV, asEV(0), {
    validators: [Validators.required],
  });
}

export function createIVControl(): FormControl<IV> {
  return createZodTypeControl(IV, asIV(0), {
    validators: [Validators.required],
  });
}

export function createStatControl(): FormControl<Stat> {
  return createZodTypeControl(Stat, asStat(0), {
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
