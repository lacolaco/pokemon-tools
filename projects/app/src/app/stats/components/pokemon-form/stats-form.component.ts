import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Signal,
  TemplateRef,
  ViewChild,
  WritableSignal,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AppStrokedButton } from '@app/shared/ui/buttons';
import { StatKey } from '@lib/stats';
import { Subject, distinctUntilChanged, merge, take, takeUntil, tap } from 'rxjs';
import { EVInputComponent } from '../../../shared/ev-input.component';
import {
  createEVControl,
  createIVControl,
  createLevelControl,
  createNatureControl,
  createPokemonControl,
  createStatControl,
} from '../../../shared/forms/controls';
import { IVInputComponent } from '../../../shared/iv-input.component';
import { LevelInputComponent } from '../../../shared/level-input.component';
import { NatureSelectComponent } from '../../../shared/nature-select.component';
import { PokemonSelectComponent } from '../../../shared/pokemon-select.component';
import { StatInputComponent } from '../../../shared/stat-input.component';
import { getValidValueChanges } from '../../../shared/utitilites/forms';
import { distinctUntilStatValuesChanged, filterNonNullable } from '../../../shared/utitilites/rx';
import * as commands from '../../commands';
import { PokemonState, PokemonStats } from '../../models/pokemon-state';
import { StatsState } from '../../state';
import { StatCommandsComponent } from './stat-commands/stat-commands.component';
import { StatsHpMultipleComponent } from './stats-analysis/stats-hp-multiple.component';
import { StatsTextareaComponent } from './stats-textarea/stats-textarea.component';
import { StatUtilsComponent } from './stats-utils/stats-utils.component';

function createStatControls<T>(fn: () => FormControl<T>) {
  return new FormGroup({ H: fn(), A: fn(), B: fn(), C: fn(), D: fn(), S: fn() });
}

@Component({
  selector: 'stats-pokemon-form',
  standalone: true,
  templateUrl: './stats-form.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    PokemonSelectComponent,
    LevelInputComponent,
    NatureSelectComponent,
    StatInputComponent,
    IVInputComponent,
    EVInputComponent,
    StatUtilsComponent,
    StatsHpMultipleComponent,
    StatsTextareaComponent,
    AppStrokedButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  styles: [
    `
      .stat-nature-up {
        background-color: #ffdcdc;
      }

      .stat-nature-down {
        background-color: #e1e9ff;
      }
    `,
  ],
})
export class StatsPokemonFormComponent implements OnInit, OnDestroy {
  readonly state = inject(StatsState);
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly onDestroy$ = new Subject<void>();

  @ViewChild('statCommandsTemplate') statCommandsTemplate!: TemplateRef<{ key: StatKey }>;

  @Input({ required: true }) $state!: WritableSignal<PokemonState>;
  @Input({ required: true }) $stats!: Signal<PokemonStats>;

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
    effect(
      () => {
        const pokemon = this.$state();
        const stats = this.$stats();
        untracked(() => {
          this.setFormValues(pokemon, stats);
        });
      },
      { injector: this.injector },
    );
    merge(
      getValidValueChanges(this.form.controls.pokemon).pipe(
        distinctUntilChanged(),
        filterNonNullable(),
        tap((pokemon) => {
          commands.changePokemon(this.$state, pokemon);
        }),
      ),
      getValidValueChanges(this.form.controls.level).pipe(
        distinctUntilChanged(),
        tap((level) => {
          commands.updatePokemonState(this.$state, { level });
        }),
      ),
      getValidValueChanges(this.form.controls.nature).pipe(
        distinctUntilChanged(),
        tap((nature) => {
          commands.updatePokemonState(this.$state, { nature });
        }),
      ),
      getValidValueChanges(this.form.controls.ivs).pipe(
        distinctUntilStatValuesChanged(),
        tap((ivs) => {
          commands.updatePokemonState(this.$state, { ivs });
        }),
      ),
      getValidValueChanges(this.form.controls.evs).pipe(
        distinctUntilStatValuesChanged(),
        tap((evs) => {
          commands.updatePokemonState(this.$state, { evs });
        }),
      ),
      getValidValueChanges(this.form.controls.stats).pipe(
        distinctUntilStatValuesChanged(),
        tap((stats) => {
          commands.updatePokemonStateByStats(this.$state, stats);
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

  resetEVs() {
    commands.resetEVs(this.$state);
  }

  optimizeDefenseEVs() {
    commands.optimizeDefenseEVs(this.$state);
  }

  openStatCommands(key: StatKey, origin: HTMLElement) {
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'bg-transparent',
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(origin)
        .withPositions([
          { originX: 'start', overlayX: 'start', originY: 'bottom', overlayY: 'top' },
          { originX: 'end', overlayX: 'end', originY: 'bottom', overlayY: 'top' },
        ]),
    });
    const detach$ = overlayRef.detachments().pipe(take(1));
    overlayRef
      .backdropClick()
      .pipe(takeUntil(detach$))
      .subscribe(() => overlayRef.dispose());
    const portal = new ComponentPortal(
      StatCommandsComponent,
      null,
      Injector.create({
        providers: [{ provide: StatCommandsComponent, useValue: this }],
        parent: this.injector,
      }),
    );
    const ref = portal.attach(overlayRef);
    ref.setInput('$pokemon', this.$state);
    ref.setInput('$stats', this.$stats);
    ref.setInput('key', key);
    ref.changeDetectorRef.detectChanges();
  }

  private setFormValues(pokemon: PokemonState, stats: PokemonStats) {
    this.form.setValue(
      {
        pokemon: pokemon.pokemon,
        level: pokemon.level,
        nature: pokemon.nature,
        ivs: pokemon.ivs,
        evs: pokemon.evs,
        stats: stats.values,
      },
      { emitEvent: false },
    );
    for (const key of this.statKeys) {
      const stat = stats.values[key];
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
