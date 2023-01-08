import { FormControl, Validators } from '@angular/forms';
import { Pokemon } from '@lacolaco/pokemon-data';
import { natures } from '@lib/data';
import { asEV, asIV, asLevel, EV, IV, Level, Nature, Stat } from '@lib/model';
import { zodTypeValidator } from '../../utitilites/forms';

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
  return new FormControl(natures[0], {
    validators: [Validators.required],
    nonNullable: true,
  });
}

export function createEVControl(): FormControl<EV> {
  return new FormControl(asEV(0), {
    validators: [Validators.required, zodTypeValidator(EV)],
    nonNullable: true,
  });
}

export function createIVControl(): FormControl<IV | null> {
  return new FormControl<IV | null>(asIV(0), {
    validators: [
      (control) => {
        if (control.value === null) {
          return null;
        }
        return zodTypeValidator(IV)(control);
      },
    ],
  });
}

export function createStatControl(): FormControl<Stat | null> {
  return new FormControl<Stat | null>(null, {
    validators: [
      (control) => {
        if (control.value === null) {
          return null;
        }
        return zodTypeValidator(Stat)(control);
      },
    ],
  });
}
