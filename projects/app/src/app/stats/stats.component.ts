import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { sumOfStatValues } from '@lib/calc';
import { naturesMap, pokemons } from '@lib/data';
import { asLevel, Level, Nature } from '@lib/model';
import { combineLatest, map, merge, Subject, takeUntil } from 'rxjs';
import { getValidValueChanges } from '../utitilites/forms';
import { JoinStatValuesPipe } from '../utitilites/pipes';
import { EVInputComponent } from './ev-input.component';
import { EVTotalControlComponent } from './ev-total-control.component';
import { formatStats } from './formatter';
import { createPokemonControl, createStatControlGroup, getStatParamsChanges, getStatValueChanges } from './forms';
import { IVInputComponent } from './iv-input.component';
import { LevelInputComponent } from './level-input.component';
import { NatureSelectComponent } from './nature-select.component';
import { PokemonSelectComponent } from './pokemon-select.component';
import { StatInputComponent } from './stat-input.component';
import { StatsIndicatorComponent } from './stats-indicator.component';
import { StatsComponentState } from './stats.state';

// TODO: URLに状態保存
@Component({
  selector: 'app-stats',
  standalone: true,
  providers: [StatsComponentState],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
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
    JoinStatValuesPipe,
  ],
})
export class StatsComponent implements OnInit, OnDestroy {
  private readonly state = inject(StatsComponentState);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly snackBar = inject(MatSnackBar);
  private readonly clipboard = inject(Clipboard);

  private readonly onDestroy$ = new Subject<void>();
  readonly state$ = combineLatest([this.state.select(), this.state.stats$]).pipe(
    map(([state, stats]) => ({
      ...state,
      usedEVs: sumOfStatValues(state.evs),
      stats,
      statsText: formatStats(state.pokemon, state.level, state.nature, stats, state.evs),
    })),
  );

  readonly form = this.fb.group({
    pokemon: createPokemonControl(pokemons[0]),
    level: this.fb.control<Level>(asLevel(1)),
    nature: this.fb.control<Nature>(naturesMap['まじめ']),
    H: createStatControlGroup(),
    A: createStatControlGroup(),
    B: createStatControlGroup(),
    C: createStatControlGroup(),
    D: createStatControlGroup(),
    S: createStatControlGroup(),
  });

  ngOnInit(): void {
    // Sync state to form
    this.state$.subscribe(({ pokemon, level, ivs, evs, nature, stats }) => {
      this.form.patchValue(
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
    });
    // Calculate stats from form
    merge(
      getValidValueChanges(this.form.controls.pokemon),
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

  copyText(text: string) {
    if (this.clipboard.copy(text)) {
      this.snackBar.open('コピーしました', '閉じる', { duration: 3000 });
    }
  }
}
