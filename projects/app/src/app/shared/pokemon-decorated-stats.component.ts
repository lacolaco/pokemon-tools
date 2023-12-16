import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EV, Nature, Stat, StatValues } from '@lib/stats';

@Component({
  selector: 'pokemon-decorated-stats',
  standalone: true,
  imports: [],
  template: `
    <span class="{{ evs.H > 0 ? 'ev' : '' }} nature-{{ nature.values.H ?? 'neutral' }}">{{ stats.H ?? 'x' }}</span>
    <span>-</span>
    <span class="{{ evs.A > 0 ? 'ev' : '' }} nature-{{ nature.values.A ?? 'neutral' }}">{{ stats.A ?? 'x' }}</span>
    <span>-</span>
    <span class="{{ evs.B > 0 ? 'ev' : '' }} nature-{{ nature.values.B ?? 'neutral' }}">{{ stats.B ?? 'x' }}</span>
    <span>-</span>
    <span class="{{ evs.C > 0 ? 'ev' : '' }} nature-{{ nature.values.C ?? 'neutral' }}">{{ stats.C ?? 'x' }}</span>
    <span>-</span>
    <span class="{{ evs.D > 0 ? 'ev' : '' }} nature-{{ nature.values.D ?? 'neutral' }}">{{ stats.D ?? 'x' }}</span>
    <span>-</span>
    <span class="{{ evs.S > 0 ? 'ev' : '' }} nature-{{ nature.values.S ?? 'neutral' }}">{{ stats.S ?? 'x' }}</span>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .ev {
        font-weight: bold;
      }
      .nature-up {
        color: #ff0000;
      }
      .nature-down {
        color: #0000ff;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDecoratedStatsComponent {
  @Input() stats!: StatValues<Stat | null>;
  @Input() nature!: Nature;
  @Input() evs!: StatValues<EV>;
}
