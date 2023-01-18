import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { merge, Subject, takeUntil, tap } from 'rxjs';
import {
  createEVControl,
  createIVControl,
  createLevelControl,
  createNatureControl,
  createPokemonControl,
  createStatControl,
} from '../../shared/forms/controls';
import { PokemonSelectComponent } from '../../shared/pokemon-select.component';
import { getValidValueChanges } from '../../utitilites/forms';
import { filterNonNullable } from '../../utitilites/rx';
import { EVInputComponent } from '../controls/ev-input.component';
import { IVInputComponent } from '../controls/iv-input.component';
import { LevelInputComponent } from '../controls/level-input.component';
import { NatureSelectComponent } from '../controls/nature-select.component';
import { StatInputComponent } from '../controls/stat-input.component';
import { StatsPokemonState } from '../pokemon-state';
import { StatCommandsComponent } from './stat-commands/stat-commands.component';
import { StatsIndicatorComponent } from './stats-indicator/stats-indicator.component';
import { StatsTextareaComponent } from './stats-textarea/stats-textarea.component';
import { StatUtilsComponent } from './stats-utils/stats-utils.component';

function createStatControls<T>(fn: () => FormControl<T>) {
  return new FormGroup({ H: fn(), A: fn(), B: fn(), C: fn(), D: fn(), S: fn() });
}

@Component({
  selector: 'stats-pokemon-form',
  standalone: true,
  templateUrl: './stats-form.component.html',
  styleUrls: ['./stats-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSnackBarModule,
    ClipboardModule,
    PokemonSelectComponent,
    LevelInputComponent,
    NatureSelectComponent,
    StatInputComponent,
    IVInputComponent,
    EVInputComponent,
    StatCommandsComponent,
    StatUtilsComponent,
    StatsIndicatorComponent,
    StatsTextareaComponent,
  ],
})
export class StatsPokemonFormComponent implements OnInit, OnDestroy {
  private readonly state = inject(StatsPokemonState);
  private readonly fb = inject(FormBuilder).nonNullable;

  private readonly onDestroy$ = new Subject<void>();
  readonly state$ = this.state.state$.pipe(
    tap(({ pokemon, level, ivs, evs, nature, stats }) => {
      this.form.setValue({ pokemon, level, nature, stats, ivs, evs }, { emitEvent: false });

      for (const key of this.statKeys) {
        const stat = stats[key];
        if (stat === null) {
          this.form.controls.stats.controls[key].disable({ emitEvent: false });
          this.form.controls.ivs.controls[key].disable({ emitEvent: false });
          this.form.controls.evs.controls[key].disable({ emitEvent: false });
        } else {
          this.form.controls.stats.controls[key].enable({ emitEvent: false });
          this.form.controls.ivs.controls[key].enable({ emitEvent: false });
          this.form.controls.evs.controls[key].enable({ emitEvent: false });
        }
      }
    }),
  );

  readonly form = this.fb.group({
    pokemon: createPokemonControl(),
    level: createLevelControl(),
    nature: createNatureControl(),
    stats: createStatControls(() => createStatControl()),
    ivs: createStatControls(() => createIVControl()),
    evs: createStatControls(() => createEVControl()),
  });

  readonly statKeys = ['H', 'A', 'B', 'C', 'D', 'S'] as const;

  ngOnInit(): void {
    // Calculate stats from form
    merge(
      getValidValueChanges(this.form.controls.level),
      getValidValueChanges(this.form.controls.nature),
      getValidValueChanges(this.form.controls.ivs),
      getValidValueChanges(this.form.controls.evs),
    )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        const { pokemon, level, nature, ivs, evs } = this.form.getRawValue();
        this.state.set({ pokemon, level, nature, ivs, evs });
      });
    // Calculate EVs from stats
    merge(getValidValueChanges(this.form.controls.stats))
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        const { stats } = this.form.getRawValue();
        this.state.updateWithStats(stats);
      });
    // Reset IVs/EVs when pokemon changes
    getValidValueChanges(this.form.controls.pokemon)
      .pipe(takeUntil(this.onDestroy$), filterNonNullable())
      .subscribe(() => {
        const { pokemon } = this.form.getRawValue();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.state.resetPokemon(pokemon!);
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
