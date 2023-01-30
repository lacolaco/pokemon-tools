import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StatKey } from '@lib/stats';
import { RxState, stateful } from '@rx-angular/state';
import { distinctUntilChanged, merge, Subject, switchMap, takeUntil, tap } from 'rxjs';
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
import { distinctUntilStatValuesChanged, filterNonNullable } from '../../utitilites/rx';
import { EVInputComponent } from '../controls/ev-input.component';
import { IVInputComponent } from '../controls/iv-input.component';
import { LevelInputComponent } from '../controls/level-input.component';
import { NatureSelectComponent } from '../controls/nature-select.component';
import { StatInputComponent } from '../controls/stat-input.component';
import { PokemonsItemState, PokemonsItemUsecase } from '../pokemons/pokemons-item.usecase';
import { StatCommandsComponent } from './stat-commands/stat-commands.component';
import { StatsAnalysisComponent } from './stats-analysis/stats-analysis.component';
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
    StatsAnalysisComponent,
    StatsTextareaComponent,
  ],
})
export class StatsPokemonFormComponent implements OnInit, OnDestroy {
  private readonly usecase = inject(PokemonsItemUsecase);
  private readonly inputs$ = new RxState<{ index: number }>();
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly onDestroy$ = new Subject<void>();

  @Input() set index(value: number) {
    this.inputs$.set({ index: value });
  }
  get index() {
    return this.inputs$.get().index;
  }

  readonly state$ = this.inputs$
    .select('index')
    .pipe(stateful(switchMap((index) => this.usecase.selectComputedState$(index))));

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
      getValidValueChanges(this.form.controls.pokemon).pipe(
        distinctUntilChanged(),
        filterNonNullable(),
        tap((pokemon) => {
          this.usecase.reset(this.index, pokemon);
        }),
      ),
      getValidValueChanges(this.form.controls.level).pipe(
        distinctUntilChanged(),
        tap((value) => {
          this.usecase.update(this.index, { level: value });
        }),
      ),
      getValidValueChanges(this.form.controls.nature).pipe(
        distinctUntilChanged(),
        tap((value) => {
          this.usecase.update(this.index, { nature: value });
        }),
      ),
      getValidValueChanges(this.form.controls.ivs).pipe(
        distinctUntilStatValuesChanged(),
        tap((value) => {
          this.usecase.update(this.index, { ivs: value });
        }),
      ),
      getValidValueChanges(this.form.controls.evs).pipe(
        distinctUntilStatValuesChanged(),
        tap((value) => {
          this.usecase.update(this.index, { evs: value });
        }),
      ),
      getValidValueChanges(this.form.controls.stats).pipe(
        distinctUntilStatValuesChanged(),
        tap((value) => {
          this.usecase.updateByStats(this.index, value);
        }),
      ),
      this.state$.pipe(
        tap((state) => {
          this.setFormValues(state);
        }),
      ),
    )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  maximize(key: StatKey) {
    this.usecase.maximize(this.index, key);
  }

  minimize(key: StatKey) {
    this.usecase.minimize(this.index, key);
  }

  increment(key: StatKey) {
    this.usecase.increment(this.index, key);
  }

  decrement(key: StatKey) {
    this.usecase.decrement(this.index, key);
  }

  toggleIgnored(key: StatKey) {
    this.usecase.toggleIgnored(this.index, key);
  }

  resetEVs() {
    this.usecase.resetEVs(this.index);
  }

  optimizeDefenseEVs() {
    this.usecase.optimizeDefenseEVs(this.index);
  }

  private setFormValues(state: PokemonsItemState) {
    const { pokemon, level, ivs, evs, nature, stats } = state;

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
  }
}
