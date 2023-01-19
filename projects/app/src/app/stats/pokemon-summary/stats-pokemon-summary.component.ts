import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { PokemonDecoratedStatsComponent } from '../../shared/pokemon-decorated-stats.component';
import { PokemonSpriteComponent } from '../../shared/pokemon-sprite.component';
import { PokemonState } from '../pokemon-state';

@Component({
  selector: 'stats-pokemon-summary',
  standalone: true,
  imports: [CommonModule, PokemonSpriteComponent, PokemonDecoratedStatsComponent],
  template: `
    <ng-container *ngIf="state$ | async as state">
      <div *ngIf="state.pokemon" class="grid grid-cols-[auto_auto] justify-start items-center gap-x-1">
        <pokemon-sprite [pokemon]="state.pokemon" class="w-10"></pokemon-sprite>
        <span class="text-lg font-bold">{{ state.pokemon.name }}</span>
      </div>
      <div>
        <pokemon-decorated-stats
          [stats]="state.stats"
          [nature]="state.nature"
          [evs]="state.evs"
          class="text-sm"
        ></pokemon-decorated-stats>
      </div>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class StatsSummaryComponent {
  private readonly state = inject(PokemonState);

  readonly state$ = this.state.state$.pipe(
    map((state) => ({
      ...state,
    })),
  );
}
