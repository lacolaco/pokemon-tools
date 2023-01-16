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
import { PokemonSpriteComponent } from './pokemon-sprite.component';
import { PokemonYakkunLinkComponent } from './pokemon-yakkun-link.component';

@Component({
  selector: 'pokemon-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    PokemonSpriteComponent,
    PokemonYakkunLinkComponent,
  ],
  template: `
    <div class="flex flex-row gap-x-1 items-center">
      <div class="mt-[-8px]">
        <pokemon-sprite *ngIf="value" [pokemon]="value" class="w-10 h-10"></pokemon-sprite>
      </div>
      <mat-form-field appearance="outline" hideRequiredMarker subscriptSizing="dynamic" class="text-sm">
        <input
          matInput
          [formControl]="formControl"
          (click)="onTouched()"
          [matAutocomplete]="auto"
          placeholder="ポケモンを選択してください"
        />
      </mat-form-field>
      <div class="px-2 flex items-center">
        <pokemon-yakkun-link *ngIf="value" [size]="16" [pokemon]="value"></pokemon-yakkun-link>
      </div>
    </div>

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
        display: inline-block;
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
