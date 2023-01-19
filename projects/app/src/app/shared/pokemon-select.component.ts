import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import type { Pokemon, PokemonName } from '@lacolaco/pokemon-data';
import { map } from 'rxjs';
import { SimpleControlValueAccessor } from '../utitilites/forms';
import { kataToHira } from '../utitilites/strings';
import { PokemonData } from './pokemon-data';

@Component({
  selector: 'pokemon-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatAutocompleteModule],
  template: `
    <mat-form-field appearance="outline" hideRequiredMarker subscriptSizing="dynamic" class="w-full">
      <mat-label>ポケモン</mat-label>
      <input
        matInput
        [formControl]="formControl"
        (click)="onTouched()"
        [matAutocomplete]="auto"
        placeholder="ポケモンを選択してください"
      />
    </mat-form-field>

    <mat-autocomplete
      #auto="matAutocomplete"
      (optionSelected)="selectPokemon($event)"
      autoActiveFirstOption
      autoSelectActiveOption
    >
      <mat-option *ngFor="let option of filteredOptions$ | async" [value]="option" class="text-sm">
        {{ option }}
      </mat-option>
    </mat-autocomplete>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonSelectComponent extends SimpleControlValueAccessor<Pokemon> {
  private readonly pokemonData = inject(PokemonData);

  get pokemonNames() {
    return Object.values(this.pokemonData.getPokemons())
      .sort((a, b) => a.index - b.index)
      .map((pokemon) => pokemon.name);
  }

  readonly formControl = new FormControl<string>('', { nonNullable: true });

  readonly filteredOptions$ = this.formControl.valueChanges.pipe(
    map((value) => {
      return this.pokemonNames.filter(
        (pokemonName) => pokemonName.includes(value) || kataToHira(pokemonName).includes(value),
      );
    }),
  );

  value: Pokemon | null = null;

  override writeValue(value: Pokemon): void {
    if (this.value !== value) {
      this.value = value;
      this.formControl.setValue(value.name, { emitEvent: false });
    }
  }

  override setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  selectPokemon(event: { option: { value: PokemonName } }) {
    const pokemon = this.pokemonData.findPokemonByName(event.option.value);
    if (pokemon) {
      this.value = pokemon;
      this.onChange(pokemon);
    }
  }
}
