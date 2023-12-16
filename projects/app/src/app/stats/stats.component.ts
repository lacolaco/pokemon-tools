import { Component, inject, Input, OnInit } from '@angular/core';
import { StatsPokemonsComponent } from './components/pokemons/pokemons.component';
import { StatsToolbarComponent } from './components/toolbar/stats-toolbar.component';
import { StatsState } from './state';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [StatsPokemonsComponent, StatsToolbarComponent],
  providers: [StatsState],
  template: `
    <header class="py-2 mb-2 sticky top-0 bg-white z-10 drop-shadow-md">
      <stats-toolbar class="container mx-auto px-2 sm:px-4" (scrollByIndex)="pokemons.scrollByIndex($event)" />
    </header>

    <stats-pokemons #pokemons class="container mx-auto px-2 sm:px-4" />
  `,
  host: {
    class: 'block',
  },
})
export default class StatsPageComponent implements OnInit {
  readonly state = inject(StatsState);

  @Input() token?: string;

  ngOnInit() {
    if (this.token) {
      this.state.deserialize(this.token);
    } else {
      this.state.initialize();
    }
  }
}
