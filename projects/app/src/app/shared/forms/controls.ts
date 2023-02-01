import { FormControl, Validators } from '@angular/forms';
import type { Pokemon } from '@lacolaco/pokemon-data';
import { asEV, asIV, asLevel, EV, IV, Level, Nature, natures, NatureValue, Stat } from '@lib/stats';
import { zodTypeValidator } from '../utitilites/forms';

export function createPokemonControl(): FormControl<Pokemon | null> {
  return new FormControl<Pokemon | null>(null, {
    validators: [Validators.required],
  });
}

export function createLevelControl(): FormControl<Level> {
  return new FormControl(asLevel(1), {
    validators: [Validators.required, zodTypeValidator(Level)],
    nonNullable: true,
  });
}

export function createNatureControl(): FormControl<Nature> {
  return new FormControl(natures['いじっぱり'], {
    validators: [Validators.required],
    nonNullable: true,
  });
}

export function createNatureValueControl(): FormControl<NatureValue> {
  return new FormControl<NatureValue>('neutral', {
    nonNullable: true,
  });
}

export function createEVControl(): FormControl<EV> {
  return new FormControl(asEV(0), {
    validators: [Validators.required, zodTypeValidator(EV)],
    nonNullable: true,
  });
}

export function createIVControl(): FormControl<IV | null>;
export function createIVControl(options: { nonNullable: true }): FormControl<IV>;
export function createIVControl(options?: { nonNullable: boolean }): FormControl<IV | null> {
  return new FormControl(asIV(0), {
    validators: [
      (control) => {
        if (control.value === null) {
          return null;
        }
        return zodTypeValidator(IV)(control);
      },
    ],
    ...(options ?? {}),
  });
}

export function createStatControl(): FormControl<Stat | null>;
export function createStatControl(options: { nonNullable: true }): FormControl<Stat>;
export function createStatControl(options?: { nonNullable: boolean }): FormControl<Stat | null> {
  return new FormControl<Stat | null>(null, {
    validators: [
      (control) => {
        if (control.value === null) {
          return null;
        }
        return zodTypeValidator(Stat)(control);
      },
    ],
    ...(options ?? {}),
  });
}
