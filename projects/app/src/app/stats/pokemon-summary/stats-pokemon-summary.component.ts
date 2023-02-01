import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { PokemonBaseInfoComponent } from '@app/shared/pokemon-base-info.component';
import { RxState, stateful } from '@rx-angular/state';
import { switchMap } from 'rxjs';
import { PokemonDecoratedStatsComponent } from '../../shared/pokemon-decorated-stats.component';
import { PokemonSpriteComponent } from '../../shared/pokemon-sprite.component';
import { PokemonsItemUsecase } from '../pokemons/pokemons-item.usecase';

@Component({
  selector: 'stats-pokemon-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PokemonSpriteComponent, PokemonDecoratedStatsComponent, PokemonBaseInfoComponent],
  template: `
    <ng-container *ngIf="state$ | async as state">
      <div class="grid grid-cols-[auto_auto] justify-start items-end gap-x-1 pb-1">
        <pokemon-sprite [pokemon]="state.pokemon" class="w-10"></pokemon-sprite>
        <div class="flex flex-col">
          <span class="text-lg font-bold leading-none">{{ state.pokemon.name }}</span>
          <pokemon-base-info [pokemon]="state.pokemon" class="text-xs text-gray-500"></pokemon-base-info>
        </div>
      </div>
      <div>
        <pokemon-decorated-stats [stats]="state.stats" [nature]="state.nature" [evs]="state.evs" class="text-sm">
        </pokemon-decorated-stats>
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
  private readonly usecase = inject(PokemonsItemUsecase);
  private readonly inputs$ = new RxState<{ index: number }>();
  @Input() set index(value: number) {
    this.inputs$.set({ index: value });
  }
  get index() {
    return this.inputs$.get().index;
  }

  readonly state$ = this.inputs$
    .select('index')
    .pipe(stateful(switchMap((index) => this.usecase.selectComputedState$(index))));
}
