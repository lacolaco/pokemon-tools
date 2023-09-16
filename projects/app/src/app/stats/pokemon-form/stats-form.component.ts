import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AppStrokedButton } from '@app/shared/ui/buttons';
import { StatKey } from '@lib/stats';
import { RxState } from '@rx-angular/state';
import { Subject, distinctUntilChanged, merge, take, takeUntil, tap } from 'rxjs';
import { EVInputComponent } from '../../shared/ev-input.component';
import {
  createEVControl,
  createIVControl,
  createLevelControl,
  createNatureControl,
  createPokemonControl,
  createStatControl,
} from '../../shared/forms/controls';
import { IVInputComponent } from '../../shared/iv-input.component';
import { LevelInputComponent } from '../../shared/level-input.component';
import { NatureSelectComponent } from '../../shared/nature-select.component';
import { PokemonSelectComponent } from '../../shared/pokemon-select.component';
import { StatInputComponent } from '../../shared/stat-input.component';
import { getValidValueChanges } from '../../shared/utitilites/forms';
import { distinctUntilStatValuesChanged, filterNonNullable } from '../../shared/utitilites/rx';
import { PokemonWithStats } from '../models/pokemon-state';
import { PokemonsItemUsecase } from '../pokemons/pokemons-item.usecase';
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
  styleUrls: ['./stats-form.component.scss'],
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
})
export class StatsPokemonFormComponent implements OnInit, OnDestroy, OnChanges {
  private readonly usecase = inject(PokemonsItemUsecase);
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);
  private readonly inputs$ = new RxState<{ index: number }>();
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly onDestroy$ = new Subject<void>();

  @ViewChild('statCommandsTemplate') statCommandsTemplate!: TemplateRef<{ key: StatKey }>;

  @Input() set index(value: number) {
    this.inputs$.set({ index: value });
  }
  get index() {
    return this.inputs$.get().index;
  }
  @Input({ required: true }) pokemon!: PokemonWithStats;

  #commandsRef: ComponentRef<StatCommandsComponent> | null = null;

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
    )
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('pokemon' in changes) {
      this.setFormValues(this.pokemon);
      this.#updateStatCommandsInputs();
    }
  }

  resetEVs() {
    this.usecase.resetEVs(this.index);
  }

  optimizeDefenseEVs() {
    this.usecase.optimizeDefenseEVs(this.index);
  }

  openStatCommands(key: StatKey, origin: HTMLElement) {
    if (this.#commandsRef) {
      this.#commandsRef.destroy();
    }

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
    this.#commandsRef = portal.attach(overlayRef);
    this.#commandsRef.setInput('key', key);
    this.#updateStatCommandsInputs();
  }

  private setFormValues(state: PokemonWithStats) {
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

  #updateStatCommandsInputs() {
    const ref = this.#commandsRef;
    if (!ref) {
      return;
    }
    ref.setInput('index', this.index);
    ref.setInput('pokemon', this.pokemon);
    ref.changeDetectorRef.detectChanges();
  }
}
