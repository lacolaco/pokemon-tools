import { CdkAccordionItem } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatsPokemonFormComponent } from '../pokemon-form/stats-form.component';
import { PokemonState } from '../pokemon-state';
import { StatsSummaryComponent } from '../pokemon-summary/stats-pokemon-summary.component';
import { PokemonStateKey, StatsState } from '../stats.state';

@Component({
  selector: 'stats-pokemons-item',
  standalone: true,
  imports: [CommonModule, StatsPokemonFormComponent, StatsSummaryComponent, MatIconModule, MatButtonModule],
  providers: [PokemonState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full flex flex-col gap-y-2 rounded-md p-2 border border-solid border-gray-500">
      <div class="grid grid-cols-[1fr_auto] items-center">
        <stats-pokemon-summary></stats-pokemon-summary>
        <button mat-icon-button (click)="cdkAccordionItem.toggle()">
          <mat-icon [fontIcon]="cdkAccordionItem.expanded ? 'unfold_less' : 'unfold_more'"></mat-icon>
        </button>
      </div>
      <div role="region" [style.display]="cdkAccordionItem.expanded ? '' : 'none'" class="flex flex-col gap-y-1">
        <stats-pokemon-form class="w-full"></stats-pokemon-form>

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
export class StatsPokemonsItemComponent implements OnInit {
  private readonly state = inject(StatsState);
  private readonly pokemonState = inject(PokemonState);

  @Input() cdkAccordionItem!: CdkAccordionItem;
  @Input() key!: PokemonStateKey;
  @Output() remove = new EventEmitter<void>();

  ngOnInit() {
    this.state.registerChild(this.key, this.pokemonState);
  }
}
