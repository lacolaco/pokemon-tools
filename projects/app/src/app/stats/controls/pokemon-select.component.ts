import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { getPokemons, Pokemon, PokemonName } from '@lacolaco/pokemon-data';
import { map } from 'rxjs';
import { SimpleControlValueAccessor } from '../../utitilites/forms';
import { kataToHira } from '../../utitilites/strings';

const pokemons = getPokemons();

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
    <input
      [formControl]="formControl"
      (click)="onTouched()"
      [matAutocomplete]="auto"
      placeholder="ポケモンを選択してください"
      class="form-input"
    />
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
export class PokemonSelectComponent extends SimpleControlValueAccessor<Pokemon> {
  get pokemonNames() {
    return Object.values(pokemons)
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
    const pokemon = this.findPokemonByName(event.option.value);
    if (pokemon) {
      this.value = pokemon;
      this.onChange(pokemon);
    }
  }

  private findPokemonByName(name: PokemonName) {
    return pokemons[name] ?? null;
  }
}
