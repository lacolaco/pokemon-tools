import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PokemonData, pokemons, pokemonsMap } from '@lib/data';
import { map } from 'rxjs';
import { SimpleControlValueAccessor } from '../utitilites/forms';
import { kataToHira } from '../utitilites/strings';

@Component({
  selector: 'pokemon-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatAutocompleteModule],
  template: `
    <mat-autocomplete
      #auto="matAutocomplete"
      (optionSelected)="selectPokemon($event)"
      autoActiveFirstOption
      autoSelectActiveOption
    >
      <mat-option *ngFor="let option of filteredOptions$ | async" [value]="option">
        {{ option }}
      </mat-option>
    </mat-autocomplete>
    <input [formControl]="formControl" (click)="onTouched()" [matAutocomplete]="auto" />
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonSelectComponent extends SimpleControlValueAccessor<PokemonData> {
  readonly formControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, (control) => (pokemonsMap[control.value] ? null : { pokemon_not_found: true })],
  });

  readonly filteredOptions$ = this.formControl.valueChanges.pipe(
    map((value) => {
      return pokemons
        .map((pokemon) => pokemon.name)
        .filter((pokemonName) => pokemonName.includes(value) || kataToHira(pokemonName).includes(value));
    }),
  );

  protected get value() {
    return pokemonsMap[this.formControl.value];
  }

  override writeValue(value: PokemonData): void {
    if (this.value !== value) {
      this.formControl.setValue(value.name, { emitEvent: false });
    }
  }

  override setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  selectPokemon(event: { option: { value: string } }) {
    const pokemon = pokemonsMap[event.option.value];
    this.onChange(pokemon);
  }
}
