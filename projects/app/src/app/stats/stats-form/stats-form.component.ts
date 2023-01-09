import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EV, IV, Stat } from '@lib/stats';
import { merge, Observable, Subject, takeUntil, tap } from 'rxjs';
import {
  createEVControl,
  createIVControl,
  createLevelControl,
  createNatureControl,
  createPokemonControl,
  createStatControl,
} from '../../shared/forms/controls';
import { PokemonBaseInfoComponent } from '../../shared/pokemon-base-info.component';
import { PokemonSelectComponent } from '../../shared/pokemon-select.component';
import { PokemonSpriteComponent } from '../../shared/pokemon-sprite.component';
import { getValidValueChanges } from '../../utitilites/forms';
import { filterNonNullable } from '../../utitilites/rx';
import { EVInputComponent } from '../controls/ev-input.component';
import { IVInputComponent } from '../controls/iv-input.component';
import { LevelInputComponent } from '../controls/level-input.component';
import { NatureSelectComponent } from '../controls/nature-select.component';
import { StatInputComponent } from '../controls/stat-input.component';
import { StatsIndicatorComponent } from '../stats-indicator/stats-indicator.component';
import { StatsPageState } from '../stats.state';
import { EVTotalControlComponent } from './ev-total-control.component';

type StatFormGroup = FormGroup<{
  stat: FormControl<Stat | null>;
  iv: FormControl<IV | null>;
  ev: FormControl<EV>;
}>;

function createStatControlGroup(): StatFormGroup {
  return new FormGroup({
    stat: createStatControl(),
    iv: createIVControl(),
    ev: createEVControl(),
  });
}

function getStatParamsChanges(group: StatFormGroup): Observable<unknown> {
  return merge(getValidValueChanges(group.controls.ev), getValidValueChanges(group.controls.iv));
}

function getStatValueChanges(group: StatFormGroup): Observable<unknown> {
  return merge(getValidValueChanges(group.controls.stat));
}

@Component({
  selector: 'app-stats-form',
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
    EVTotalControlComponent,
    StatsIndicatorComponent,
    PokemonSpriteComponent,
    PokemonBaseInfoComponent,
  ],
})
export class StatsFormComponent implements OnInit, OnDestroy {
  private readonly state = inject(StatsPageState);
  private readonly fb = inject(FormBuilder).nonNullable;

  private readonly onDestroy$ = new Subject<void>();
  readonly state$ = this.state.state$.pipe(
    tap(({ pokemon, level, ivs, evs, nature, stats }) => {
      this.form.setValue(
        {
          pokemon,
          level,
          nature,
          H: { iv: ivs.H, ev: evs.H, stat: stats.H },
          A: { iv: ivs.A, ev: evs.A, stat: stats.A },
          B: { iv: ivs.B, ev: evs.B, stat: stats.B },
          C: { iv: ivs.C, ev: evs.C, stat: stats.C },
          D: { iv: ivs.D, ev: evs.D, stat: stats.D },
          S: { iv: ivs.S, ev: evs.S, stat: stats.S },
        },
        { emitEvent: false },
      );
    }),
  );

  readonly form = this.fb.group({
    pokemon: createPokemonControl(),
    level: createLevelControl(),
    nature: createNatureControl(),
    H: createStatControlGroup(),
    A: createStatControlGroup(),
    B: createStatControlGroup(),
    C: createStatControlGroup(),
    D: createStatControlGroup(),
    S: createStatControlGroup(),
  });

  ngOnInit(): void {
    // Calculate stats from form
    merge(
      getValidValueChanges(this.form.controls.level),
      getValidValueChanges(this.form.controls.nature),
      getStatParamsChanges(this.form.controls.H),
      getStatParamsChanges(this.form.controls.A),
      getStatParamsChanges(this.form.controls.B),
      getStatParamsChanges(this.form.controls.C),
      getStatParamsChanges(this.form.controls.D),
      getStatParamsChanges(this.form.controls.S),
    )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        const { pokemon, level, nature, H, A, B, C, D, S } = this.form.getRawValue();
        this.state.set({
          pokemon,
          level,
          nature,
          ivs: { H: H.iv, A: A.iv, B: B.iv, C: C.iv, D: D.iv, S: S.iv }, // todo: validation
          evs: { H: H.ev, A: A.ev, B: B.ev, C: C.ev, D: D.ev, S: S.ev }, // todo: validation
        });
      });
    // Calculate EVs from stats
    merge(
      getStatValueChanges(this.form.controls.H),
      getStatValueChanges(this.form.controls.A),
      getStatValueChanges(this.form.controls.B),
      getStatValueChanges(this.form.controls.C),
      getStatValueChanges(this.form.controls.D),
      getStatValueChanges(this.form.controls.S),
    )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        const { H, A, B, C, D, S } = this.form.getRawValue();
        this.state.updateWithStats({ H: H.stat, A: A.stat, B: B.stat, C: C.stat, D: D.stat, S: S.stat });
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

  resetEVs() {
    this.state.resetEVs();
  }

  optimizeDurability() {
    this.state.optimizeDurability();
  }
}
