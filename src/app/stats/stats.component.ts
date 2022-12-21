import { CommonModule } from '@angular/common';
import { Component, inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { calcEVs, calcStats, compareStatValues, ev, EV, iv, IV, nature, Nature, StatValues } from '@lib/calc';
import { RxState } from '@rx-angular/state';
import { combineLatest, distinctUntilChanged, skipWhile, Subject, takeUntil } from 'rxjs';
import { createEVControl } from './forms';

const distinctUntilChangedStatValues = distinctUntilChanged(compareStatValues);

@Injectable()
class LocalState extends RxState<{
  pokemon: { name: string };
  baseStats: StatValues<number>;
  level: number;
  ivs: StatValues<IV>;
  evs: StatValues<EV>;
  nature: Nature | null;
  stats: StatValues<number>;
}> {
  constructor() {
    super();
    // Calculate stats
    combineLatest([
      this.select('baseStats').pipe(distinctUntilChangedStatValues),
      this.select('level'),
      this.select('ivs').pipe(distinctUntilChangedStatValues),
      this.select('evs').pipe(distinctUntilChangedStatValues),
      this.select('nature'),
    ]).subscribe(() => {
      const { level, baseStats, ivs, evs, nature } = this.get();
      this.set({
        stats: calcStats(level, baseStats, ivs, evs, nature),
      });
    });
    // Calculate EVs from stats
    this.select('stats')
      .pipe(distinctUntilChangedStatValues)
      .subscribe(() => {
        const { level, stats, baseStats, ivs, nature } = this.get();
        this.set({
          evs: calcEVs(level, stats, baseStats, ivs, nature),
        });
      });

    this.set({
      pokemon: { name: 'マリルリ' },
      baseStats: [100, 50, 80, 60, 80, 50],
      level: 50,
      ivs: [iv(31), iv(31), iv(31), iv(31), iv(31), iv(31)],
      evs: [ev(0), ev(0), ev(0), ev(0), ev(0), ev(0)],
      nature: null,
    });
  }
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [LocalState],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit, OnDestroy {
  private readonly state = inject(LocalState);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly onDestroy$ = new Subject<void>();
  readonly state$ = this.state.select();

  readonly form = this.fb.group({
    level: this.fb.control(0),
    ivs: this.fb.group({
      hp: this.fb.control(0),
      atk: this.fb.control(0),
      def: this.fb.control(0),
      spa: this.fb.control(0),
      spd: this.fb.control(0),
      spe: this.fb.control(0),
    }),
    evs: this.fb.group({
      hp: createEVControl(),
      atk: createEVControl(),
      def: createEVControl(),
      spa: createEVControl(),
      spd: createEVControl(),
      spe: createEVControl(),
    }),
    stats: this.fb.group({
      hp: this.fb.control(0),
      atk: this.fb.control(0),
      def: this.fb.control(0),
      spa: this.fb.control(0),
      spd: this.fb.control(0),
      spe: this.fb.control(0),
    }),
    nature: this.fb.control<Nature | null>(null),
  });

  ngOnInit(): void {
    // Sync state to form
    this.state.select().subscribe(({ level, baseStats, ivs, evs, nature, stats }) => {
      this.form.patchValue(
        {
          level,
          nature,
          ivs: { hp: ivs[0], atk: ivs[1], def: ivs[2], spa: ivs[3], spd: ivs[4], spe: ivs[5] },
          evs: { hp: evs[0], atk: evs[1], def: evs[2], spa: evs[3], spd: evs[4], spe: evs[5] },
          stats: { hp: stats[0], atk: stats[1], def: stats[2], spa: stats[3], spd: stats[4], spe: stats[5] },
        },
        { emitEvent: false },
      );
    });
    // Sync form to state
    this.form.valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        skipWhile(() => !this.form.valid),
      )
      .subscribe(() => {
        const { level, ivs, evs, stats, nature } = this.form.getRawValue();
        this.state.set({
          level,
          ivs: [ivs.hp, ivs.atk, ivs.def, ivs.spa, ivs.spd, ivs.spe] as StatValues<IV>, // todo: validation
          evs: [evs.hp, evs.atk, evs.def, evs.spa, evs.spd, evs.spe] as StatValues<EV>, // todo: validation
          stats: [stats.hp, stats.atk, stats.def, stats.spa, stats.spd, stats.spe],
        });
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
