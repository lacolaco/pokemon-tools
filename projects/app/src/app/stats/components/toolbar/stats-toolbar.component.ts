import { Clipboard } from '@angular/cdk/clipboard';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AppIconButton } from '@app/shared/ui';
import { PokemonSpriteComponent } from '../../../shared/pokemon-sprite.component';
import { StatsState } from '../../state';

@Component({
  selector: 'stats-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CdkDropList, CdkDrag, AppIconButton, PokemonSpriteComponent, MatIconModule, MatTooltipModule],
  template: `
    <div class="grid grid-cols-[1fr_auto] items-center gap-x-2">
      <div
        class="h-full flex flex-row flex-wrap gap-2 items-center"
        cdkDropList
        [cdkDropListOrientation]="'horizontal'"
        (cdkDropListDropped)="changeOrder($event)"
      >
        <ng-container *ngFor="let item of state.$pokemons(); let index = index">
          <button
            cdkDrag
            app-icon-button
            class="border border-solid border-gray-500 bg-white"
            (click)="scrollByIndex.emit(index)"
            matTooltip="ドラッグで並び替えできます"
            [matTooltipShowDelay]="500"
          >
            <pokemon-sprite [pokemon]="item().pokemon" [size]="40" />
          </button>
        </ng-container>
        <button
          app-icon-button
          class="border border-solid border-gray-500 bg-white text-gray-500"
          (click)="addPokemon()"
          matTooltip="ポケモンを追加"
        >
          <mat-icon fontIcon="add" />
        </button>
      </div>
      <button app-icon-button class="bg-white text-gray-500" (click)="share()" matTooltip="現在の状態をURLに保存します">
        <mat-icon fontIcon="save" />
      </button>
    </div>
  `,
  host: {
    class: 'block',
  },
  styleUrls: ['./stats-toolbar.component.css'],
})
export class StatsToolbarComponent {
  readonly #router = inject(Router);
  readonly #clipboard = inject(Clipboard);
  readonly #snackBar = inject(MatSnackBar);

  readonly state = inject(StatsState);

  @Output() scrollByIndex = new EventEmitter<number>();

  share() {
    const token = this.state.serialize();
    this.#router.navigate([''], { queryParams: { token } });
    this.#clipboard.copy(window.location.href);
    this.#snackBar.open('現在の状態をURLに保存しました。', undefined, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  addPokemon() {
    this.state.addPokemon();
    const index = this.state.$pokemons().length - 1;
    // NOTE: Wait for the DOM to be updated.
    setTimeout(() => this.scrollByIndex.emit(index), 0);
  }

  changeOrder(event: CdkDragDrop<unknown>) {
    this.state.move(event.previousIndex, event.currentIndex);
    // Scroll to the new position.
    // NOTE: Wait for the DOM to be updated.
    setTimeout(() => this.scrollByIndex.emit(event.currentIndex), 0);
  }
}
