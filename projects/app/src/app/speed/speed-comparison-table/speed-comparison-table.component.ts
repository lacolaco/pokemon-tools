import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, NgZone, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import type { Pokemon } from '@lacolaco/pokemon-data';
import { SpeedModifier } from '@lib/stats';
import { combineLatest, map, merge, tap } from 'rxjs';
import { PokemonSpriteComponent } from '../../shared/pokemon-sprite.component';
import { getValidValueChanges } from '../../utitilites/forms';
import { SpeedModifierControlComponent } from '../speed-modifier-control/speed-modifier-control.component';
import { SpeedPageState } from '../speed.state';
import { defaultSpeedModifier, SpeedComparisonTableRow, SpeedComparisonTableState } from './comparison-table';

@Component({
  selector: 'speed-comparison-table',
  standalone: true,
  templateUrl: './speed-comparison-table.component.html',
  styles: [
    `
      :host {
        display: block;
        max-height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, PokemonSpriteComponent, SpeedModifierControlComponent],
  providers: [SpeedComparisonTableState],
})
export class SpeedComparisonTableComponent implements OnInit {
  private readonly state = inject(SpeedPageState);
  private readonly tableState = inject(SpeedComparisonTableState);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly ngZone = inject(NgZone);

  readonly form = this.fb.group({
    ally: this.fb.group({
      modifier: this.fb.control<SpeedModifier>(defaultSpeedModifier),
    }),
    opponent: this.fb.group({
      modifier: this.fb.control<SpeedModifier>(defaultSpeedModifier),
    }),
  });

  readonly state$ = combineLatest([this.state.state$, this.tableState.rows$]).pipe(
    map(([state, rows]) => ({ ...state, rows })),
  );

  ngOnInit() {
    this.state.hold(this.state$, () => {
      this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          const allyRow = document.querySelector('[data-ally-row]');
          allyRow?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        });
      });
    });

    merge(
      getValidValueChanges(this.form.controls.ally.controls.modifier).pipe(
        tap((value) => {
          this.tableState.set({ allyModifier: value });
        }),
      ),
      getValidValueChanges(this.form.controls.opponent.controls.modifier).pipe(
        tap((value) => {
          this.tableState.set({ opponentModifier: value });
        }),
      ),
    )
      .pipe()
      .subscribe();
  }

  trackRow(index: number, item: SpeedComparisonTableRow) {
    return `${index}${item.stat}`;
  }

  trackPokemon(_: number, item: Pokemon) {
    return item.index;
  }
}
