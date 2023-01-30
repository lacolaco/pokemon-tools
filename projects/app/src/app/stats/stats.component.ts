import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { StatsPokemonsComponent } from './pokemons/pokemons.component';
import { StatsState } from './stats.state';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatButtonModule, MatIconModule, MatTooltipModule, StatsPokemonsComponent],
  providers: [StatsState],
  template: `
    <header class="grid grid-cols-[1fr_auto] items-center mb-4">
      <h1 class="text-xl font-bold">ステータス計算ツール</h1>
      <button mat-icon-button (click)="share()" matTooltip="URLでステータス調整をシェア">
        <mat-icon fontIcon="share" class="text-gray-500"></mat-icon>
      </button>
    </header>

    <stats-pokemons class="w-full"></stats-pokemons>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class StatsPageComponent implements OnInit {
  private readonly state = inject(StatsState);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.state.deserialize(token);
    } else {
      this.state.initialize();
    }
  }

  share() {
    const token = this.state.serialize();
    this.router.navigate([''], { queryParams: { token } });
    this.clipboard.copy(window.location.href);
    this.snackBar.open('URLをコピーしました', undefined, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
