import { Clipboard } from '@angular/cdk/clipboard';
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
  imports: [CommonModule, AppIconButton, PokemonSpriteComponent, MatIconModule, MatTooltipModule],
  template: `
    <div class="grid grid-cols-[1fr_auto] items-center gap-x-2">
      <div class="h-full flex flex-row flex-wrap gap-2 items-center">
        <ng-container *ngFor="let item of state.$pokemons(); let index = index">
          <button
            app-icon-button
            class="border border-solid border-gray-500 bg-white"
            (click)="scrollByIndex.emit(index)"
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
}
