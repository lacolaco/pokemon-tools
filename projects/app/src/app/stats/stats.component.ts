import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StatsPokemonsComponent } from './pokemons/stats-pokemons.component';
import { StatsState } from './stats.state';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, StatsPokemonsComponent],
  providers: [StatsState],
  template: `
    <h1 class="text-xl font-bold mb-4">ステータス計算ツール</h1>

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
export class StatsPageComponent {}
