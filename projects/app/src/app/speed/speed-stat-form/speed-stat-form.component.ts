import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilSomeChanged } from '@rx-angular/state';
import { map, merge, Subject, takeUntil, tap } from 'rxjs';
import {
  createEVControl,
  createIVControl,
  createLevelControl,
  createNatureValueControl,
  createPokemonControl,
  createStatControl,
} from '../../shared/forms/controls';
import { PokemonBaseInfoComponent } from '../../shared/pokemon-base-info.component';
import { PokemonSelectComponent } from '../../shared/pokemon-select.component';
import { EVInputComponent } from '../../stats/controls/ev-input.component';
import { IVInputComponent } from '../../stats/controls/iv-input.component';
import { StatInputComponent } from '../../stats/controls/stat-input.component';
import { getValidValueChanges } from '../../utitilites/forms';
import { filterNonNullable } from '../../utitilites/rx';
import { SpeedPresetsComponent } from '../speed-presets/speed-presets.component';
import { SpeedPageState } from '../speed.state';

@Component({
  selector: 'speed-stat-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PokemonSelectComponent,
    PokemonBaseInfoComponent,
    StatInputComponent,
    EVInputComponent,
    IVInputComponent,
    SpeedPresetsComponent,
  ],
  templateUrl: './speed-stat-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeedStatFormComponent implements OnInit, OnDestroy {
  private readonly state = inject(SpeedPageState);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly state$ = this.state.state$.pipe(
    tap(({ pokemon, level, stats }) => {
      this.form.setValue(
        {
          pokemon,
          level,
          stats: { stat: stats.stat, ev: stats.ev, iv: stats.iv, nature: stats.nature },
        },
        { emitEvent: false },
      );
    }),
  );

  readonly form = this.fb.group({
    pokemon: createPokemonControl(),
    level: createLevelControl(),
    stats: this.fb.group({
      stat: createStatControl({ nonNullable: true }),
      ev: createEVControl(),
      iv: createIVControl({ nonNullable: true }),
      nature: createNatureValueControl(),
    }),
  });

  private readonly onDestroy$ = new Subject<void>();

  ngOnInit() {
    merge(
      getValidValueChanges(this.form.controls.pokemon).pipe(
        map(() => this.form.getRawValue().pokemon),
        filterNonNullable(),
        tap((pokemon) => {
          this.state.resetPokemon(pokemon);
        }),
      ),
      getValidValueChanges(this.form.controls.level).pipe(
        map(() => this.form.getRawValue().level),
        tap((level) => {
          this.state.set({ level });
        }),
      ),
      getValidValueChanges(this.form.controls.stats).pipe(
        distinctUntilSomeChanged(['ev', 'iv', 'nature']),
        map(() => this.form.getRawValue().stats),
        tap(({ iv, ev, nature }) => {
          this.state.set({ stats: { iv, ev, nature } });
        }),
      ),
      getValidValueChanges(this.form.controls.stats.controls.stat).pipe(
        map(() => this.form.getRawValue().stats.stat),
        tap((stat) => {
          this.state.calculateEV(stat);
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
}
