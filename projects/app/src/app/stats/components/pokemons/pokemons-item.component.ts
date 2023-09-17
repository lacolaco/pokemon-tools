import { CdkAccordionItem } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  WritableSignal,
  computed,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppIconButton } from '@app/shared/ui/buttons';
import { PokemonState, calculatePokemonStats } from '../../models/pokemon-state';
import { StatsPokemonFormComponent } from '../pokemon-form/stats-form.component';
import { StatsSummaryComponent } from '../pokemon-summary/stats-pokemon-summary.component';

@Component({
  selector: 'stats-pokemons-item',
  standalone: true,
  imports: [CommonModule, StatsPokemonFormComponent, StatsSummaryComponent, MatIconModule, AppIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full flex flex-col gap-y-2 rounded-md p-2 md:p-4 border border-solid border-gray-500">
      <div class="flex flex-row items-center">
        <stats-pokemon-summary class="flex-auto" [state]="$state()" [stats]="$stats()" />
        <button app-icon-button (click)="cdkAccordionItem.toggle()">
          <mat-icon [fontIcon]="cdkAccordionItem.expanded ? 'unfold_less' : 'unfold_more'"></mat-icon>
        </button>
      </div>
      <div role="region" [style.display]="cdkAccordionItem.expanded ? '' : 'none'" class="flex flex-col gap-y-1">
        <stats-pokemon-form class="w-full" [$state]="$state" [$stats]="$stats" />

        <div class="w-full flex justify-center items-center">
          <button app-icon-button class="text-red-600 hover:bg-red-50" (click)="remove.emit()">
            <mat-icon fontIcon="delete_outline"></mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class StatsPokemonsItemComponent {
  @Input({ required: true }) cdkAccordionItem!: CdkAccordionItem;
  @Input({ required: true }) $state!: WritableSignal<PokemonState>;

  readonly $stats = computed(() => calculatePokemonStats(this.$state()));

  @Output() remove = new EventEmitter<void>();
}
