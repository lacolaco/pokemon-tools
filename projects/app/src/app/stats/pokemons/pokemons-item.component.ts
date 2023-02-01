import { CdkAccordionItem } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatsPokemonFormComponent } from '../pokemon-form/stats-form.component';
import { StatsSummaryComponent } from '../pokemon-summary/stats-pokemon-summary.component';
import { PokemonsItemUsecase } from './pokemons-item.usecase';

@Component({
  selector: 'stats-pokemons-item',
  standalone: true,
  imports: [CommonModule, StatsPokemonFormComponent, StatsSummaryComponent, MatIconModule, MatButtonModule],
  providers: [PokemonsItemUsecase],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full flex flex-col gap-y-2 rounded-md p-2 md:p-4 border border-solid border-gray-500">
      <div class="flex flex-row items-center">
        <stats-pokemon-summary class="flex-auto" [index]="index"></stats-pokemon-summary>
        <button mat-icon-button type="button" (click)="cdkAccordionItem.toggle()">
          <mat-icon [fontIcon]="cdkAccordionItem.expanded ? 'unfold_less' : 'unfold_more'"></mat-icon>
        </button>
      </div>
      <div role="region" [style.display]="cdkAccordionItem.expanded ? '' : 'none'" class="flex flex-col gap-y-1">
        <stats-pokemon-form class="w-full" [index]="index"></stats-pokemon-form>

        <div class="w-full flex justify-center items-center">
          <button mat-icon-button color="warn" class="hover:bg-red-50" (click)="remove.emit()">
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
  @Input() index!: number;
  @Input() cdkAccordionItem!: CdkAccordionItem;

  @Output() remove = new EventEmitter<void>();
}
