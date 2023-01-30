import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormFieldModule } from '../../../shared/forms/form-field.component';
import { PokemonsItemState } from '../../pokemons/pokemons-item.usecase';
import { formatStats } from './formatter';

@Component({
  selector: 'app-stats-textarea',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ClipboardModule, MatSnackBarModule, FormFieldModule],
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

  @Input() state!: PokemonsItemState;

  get statsText() {
    const { pokemon, level, stats, nature, evs } = this.state;
    return formatStats(pokemon, level, nature, stats, evs);
  }

  copyText(text: string) {
    if (this.clipboard.copy(text)) {
      this.snackBar.open('コピーしました', '閉じる', { duration: 3000 });
    }
  }
}
