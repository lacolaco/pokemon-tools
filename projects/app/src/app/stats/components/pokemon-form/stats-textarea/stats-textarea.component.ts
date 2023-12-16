import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';

import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormFieldModule } from '../../../../shared/forms/form-field.component';
import { PokemonState, PokemonStats } from '../../../models/pokemon-state';
import { formatStats } from './formatter';

@Component({
  selector: 'app-stats-textarea',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClipboardModule, MatSnackBarModule, FormFieldModule],
  template: `
    <app-form-field class="w-full">
      <textarea
        app-form-control
        class="w-full"
        [value]="statsText"
        title="クリックしてクリップボードにコピー"
        (click)="copyText(statsText)"
        readonly
      ></textarea>
    </app-form-field>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class StatsTextareaComponent {
  private readonly snackBar = inject(MatSnackBar);
  private readonly clipboard = inject(Clipboard);

  @Input({ required: true }) pokemon!: PokemonState;
  @Input({ required: true }) stats!: PokemonStats;

  get statsText() {
    const { pokemon, level, nature, evs } = this.pokemon;
    const { values: stats } = this.stats;
    return formatStats(pokemon, level, nature, stats, evs);
  }

  copyText(text: string) {
    if (this.clipboard.copy(text)) {
      this.snackBar.open('コピーしました', '閉じる', { duration: 3000 });
    }
  }
}
