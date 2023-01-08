import { FormControl, Validators } from '@angular/forms';
import { Pokemon } from '@lacolaco/pokemon-data';
import { natures } from '@lib/data';
import { Level, asLevel, Nature, EV, asEV, IV, asIV, Stat, asStat } from '@lib/model';
import { createZodTypeControl } from '../../utitilites/forms';

export function createPokemonControl(): FormControl<Pokemon | null> {
  return new FormControl<Pokemon | null>(null, {
    validators: [Validators.required],
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
    validators: [],
  });
}

export function createStatControl(): FormControl<Stat> {
  return createZodTypeControl(Stat, asStat(1), {
    validators: [],
  });
}
