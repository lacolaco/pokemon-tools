import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { filter, merge, Subject, takeUntil } from 'rxjs';
import { PokemonSpriteComponent } from '../../shared/pokemon-sprite.component';
import { getValidValueChanges } from '../../utitilites/forms';
import { JoinPipe, JoinStatValuesPipe } from '../../utitilites/pipes';
import { EVInputComponent } from '../controls/ev-input.component';
import { IVInputComponent } from '../controls/iv-input.component';
import { LevelInputComponent } from '../controls/level-input.component';
import { NatureSelectComponent } from '../controls/nature-select.component';
import { PokemonSelectComponent } from '../controls/pokemon-select.component';
import { StatInputComponent } from '../controls/stat-input.component';
import { EVTotalControlComponent } from './ev-total-control.component';
import {
  createLevelControl,
  createNatureControl,
  createPokemonControl,
  createStatControlGroup,
  getStatParamsChanges,
  getStatValueChanges,
} from '../controls/forms';
import { StatsIndicatorComponent } from './stats-indicator.component';
import { StatsState } from '../stats.state';

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
    JoinStatValuesPipe,
    JoinPipe,
  ],
})
export class StatsFormComponent implements OnInit, OnDestroy {
  private readonly state = inject(StatsState);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly snackBar = inject(MatSnackBar);
  private readonly clipboard = inject(Clipboard);

  private readonly onDestroy$ = new Subject<void>();
  readonly state$ = this.state.state$;

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
    // Sync state to form
    this.state$.subscribe((state) => {
      const { pokemon, level, ivs, evs, nature, stats } = state;
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
      .pipe(
        takeUntil(this.onDestroy$),
        filter((pokemon) => !!pokemon),
      )
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

  copyText(text: string) {
    if (this.clipboard.copy(text)) {
      this.snackBar.open('コピーしました', '閉じる', { duration: 3000 });
    }
  }
}
