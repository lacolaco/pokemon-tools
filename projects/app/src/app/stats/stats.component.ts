import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { naturesMap, pokemons } from '@lib/data';
import { EV, IV, Nature, Stat, StatValues } from '@lib/model';
import { map, merge, Subject, takeUntil } from 'rxjs';
import { getValidValueChanges } from '../utitilites/forms';
import { EVInputComponent } from './ev-input.component';
import { formatStats } from './formatter';
import { createPokemonControl, createStatControlGroup, getStatParamsChanges, getStatValueChanges } from './forms';
import { IVInputComponent } from './iv-input.component';
import { LevelInputComponent } from './level-input.component';
import { NatureSelectComponent } from './nature-select.component';
import { PokemonSelectComponent } from './pokemon-select.component';
import { StatInputComponent } from './stat-input.component';
import { StatsComponentState } from './stats.state';

// TODO: 努力値合計が510を超えないようにする
// TODO: HP倍数調整
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
  ],
})
export class StatsComponent implements OnInit, OnDestroy {
  private readonly state = inject(StatsComponentState);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly snackBar = inject(MatSnackBar);
  private readonly clipboard = inject(Clipboard);

  private readonly onDestroy$ = new Subject<void>();
  readonly state$ = this.state.select().pipe(
    map((state) => ({
      ...state,
      statsText: formatStats(state.pokemon, state.level, state.nature, state.stats, state.evs),
    })),
  );

  readonly form = this.fb.group({
    pokemon: createPokemonControl(pokemons[0]),
    level: this.fb.control(1),
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
    this.state.select().subscribe(({ pokemon, level, ivs, evs, nature, stats }) => {
      this.form.patchValue(
        {
          pokemon,
          level,
          nature,
          H: { iv: ivs[0], ev: evs[0], stat: stats[0] },
          A: { iv: ivs[1], ev: evs[1], stat: stats[1] },
          B: { iv: ivs[2], ev: evs[2], stat: stats[2] },
          C: { iv: ivs[3], ev: evs[3], stat: stats[3] },
          D: { iv: ivs[4], ev: evs[4], stat: stats[4] },
          S: { iv: ivs[5], ev: evs[5], stat: stats[5] },
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
          ivs: [H.iv, A.iv, B.iv, C.iv, D.iv, S.iv] as StatValues<IV>, // todo: validation
          evs: [H.ev, A.ev, B.ev, C.ev, D.ev, S.ev] as StatValues<EV>, // todo: validation
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
        this.state.updateStats([H.stat, A.stat, B.stat, C.stat, D.stat, S.stat] as StatValues<Stat>);
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  copyText() {
    const state = this.state.get();
    const text = formatStats(state.pokemon, state.level, state.nature, state.stats, state.evs);
    if (this.clipboard.copy(text)) {
      this.snackBar.open('コピーしました', '閉じる', { duration: 3000 });
    }
  }
}
