import { CommonModule } from '@angular/common';
import { Component, inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  calcEVs,
  calcStats,
  compareStatValues,
  equalsStatValues,
  ev,
  EV,
  iv,
  IV,
  Nature,
  naturesMap,
  Stat,
  StatValues,
} from '@lib/calc';
import { RxState } from '@rx-angular/state';
import { combineLatest, distinctUntilChanged, map, merge, Subject, takeUntil } from 'rxjs';
import { getValidValueChanges } from '../utitilites/forms';
import { EVInputComponent } from './ev-input.component';
import { formatStats } from './formatter';
import { createStatControlGroup, getStatParamsChanges, getStatValueChanges } from './forms';
import { IVInputComponent } from './iv-input.component';
import { LevelInputComponent } from './level-input.component';
import { NatureSelectComponent } from './nature-select.component';
import { StatInputComponent } from './stat-input.component';

const distinctUntilChangedStatValues = distinctUntilChanged(compareStatValues);

@Injectable()
class LocalState extends RxState<{
  pokemon: { name: string };
  baseStats: StatValues<number>;
  level: number;
  nature: Nature;
  ivs: StatValues<IV>;
  evs: StatValues<EV>;
  stats: StatValues<Stat>;
}> {
  constructor() {
    super();
    // Calculate stats
    combineLatest([
      this.select('level'),
      this.select('nature'),
      this.select('baseStats').pipe(distinctUntilChangedStatValues),
      this.select('ivs').pipe(distinctUntilChangedStatValues),
      this.select('evs').pipe(distinctUntilChangedStatValues),
    ]).subscribe(() => {
      const { level, baseStats, ivs, evs, nature } = this.get();
      const stats = calcStats(level, baseStats, ivs, evs, nature);
      if (!this.get().stats || !equalsStatValues(stats, this.get().stats)) {
        this.set({
          stats: calcStats(level, baseStats, ivs, evs, nature),
        });
      }
    });

    this.set({
      pokemon: { name: 'マリルリ' },
      baseStats: [100, 50, 80, 60, 80, 50],
      level: 50,
      ivs: [iv(31), iv(31), iv(31), iv(31), iv(31), iv(31)],
      evs: [ev(0), ev(0), ev(0), ev(0), ev(0), ev(0)],
      nature: naturesMap['いじっぱり'],
    });
  }

  updateStats(stats: StatValues<Stat>) {
    const { level, baseStats, ivs, nature } = this.get();
    const evs = calcEVs(level, stats, baseStats, ivs, nature);
    if (!this.get().evs || !equalsStatValues(evs, this.get().evs)) {
      this.set({ evs });
    }
  }
}

@Component({
  selector: 'app-stats',
  standalone: true,
  providers: [LocalState],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LevelInputComponent,
    NatureSelectComponent,
    StatInputComponent,
    IVInputComponent,
    EVInputComponent,
  ],
})
export class StatsComponent implements OnInit, OnDestroy {
  private readonly state = inject(LocalState);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly onDestroy$ = new Subject<void>();
  readonly state$ = this.state.select().pipe(
    map((state) => ({
      ...state,
      statsText: formatStats(state.pokemon, state.level, state.nature, state.stats, state.evs),
    })),
  );

  readonly form = this.fb.group({
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
    this.state.select().subscribe(({ level, ivs, evs, nature, stats }) => {
      this.form.patchValue(
        {
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
        const { level, nature, H, A, B, C, D, S } = this.form.getRawValue();
        this.state.set({
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
}
