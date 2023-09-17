import { Clipboard } from '@angular/cdk/clipboard';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AppIconButton } from '@app/shared/ui/buttons';
import { StatsPokemonsComponent } from './components/pokemons/pokemons.component';
import { StatsState } from './state';
import { PokemonSpriteComponent } from '@app/shared/pokemon-sprite.component';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    CommonModule,
    OverlayModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    StatsPokemonsComponent,
    AppIconButton,
    PokemonSpriteComponent,
  ],
  providers: [StatsState],
  template: `
    <header class="py-2 mb-2 sticky top-0 bg-white z-10 drop-shadow-md">
      <div class="container mx-auto px-2 sm:px-4 grid grid-cols-[1fr_auto] items-center gap-x-2">
        <div class="h-full flex flex-row flex-wrap gap-2 items-center">
          <ng-container *ngFor="let item of state.$pokemons(); let index = index">
            <button
              class="border border-solid border-gray-500 rounded-full aspect-square bg-white hover:bg-blue-200 focus-visible:outline-none focus-visible:bg-blue-200"
              (click)="pokemons.scrollByIndex(index)"
            >
              <pokemon-sprite [pokemon]="item().pokemon" [size]="40" />
            </button>
          </ng-container>
        </div>
        <button app-icon-button class="text-gray-500" (click)="share()" matTooltip="現在の状態をURLに保存します">
          <mat-icon fontIcon="save"></mat-icon>
        </button>
      </div>
    </header>

    <stats-pokemons #pokemons class="container mx-auto px-2 sm:px-4" />
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export default class StatsPageComponent implements OnInit {
  readonly #router = inject(Router);
  readonly #clipboard = inject(Clipboard);
  readonly #snackBar = inject(MatSnackBar);
  readonly state = inject(StatsState);

  @Input() token?: string;

  ngOnInit() {
    if (this.token) {
      this.state.deserialize(this.token);
    } else {
      this.state.initialize();
    }
  }

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
}
