import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, NgZone, OnInit } from '@angular/core';
import type { Pokemon } from '@lacolaco/pokemon-data';
import { combineLatest, debounceTime, map } from 'rxjs';
import { PokemonSpriteComponent } from '../../shared/pokemon-sprite.component';
import { SpeedPageState } from '../speed.state';
import { SpeedComparisonTableRow, SpeedComparisonTableState } from './comparison-table';

@Component({
  selector: 'speed-comparison-table',
  standalone: true,
  templateUrl: './speed-comparison-table.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PokemonSpriteComponent],
  providers: [SpeedComparisonTableState],
})
export class SpeedComparisonTableComponent implements OnInit {
  private readonly state = inject(SpeedPageState);
  private readonly tableState = inject(SpeedComparisonTableState);
  private readonly ngZone = inject(NgZone);

  readonly state$ = combineLatest([this.tableState.rows$]).pipe(map(([rows]) => ({ rows })));

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.state.hold(this.state$.pipe(debounceTime(100)), () => {
        requestAnimationFrame(() => {
          const allyRow = document.querySelector('[data-ally-row]');
          allyRow?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        });
      });
    });
  }

  trackRow(index: number, item: SpeedComparisonTableRow) {
    return `${index}${item.stat}`;
  }

  trackPokemon(_: number, item: Pokemon) {
    return item.index;
  }
}
