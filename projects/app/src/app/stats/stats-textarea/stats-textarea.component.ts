import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { map } from 'rxjs';
import { StatsPageState } from '../stats.state';
import { formatStats } from './formatter';

@Component({
  selector: 'app-stats-textarea',
  standalone: true,
  imports: [CommonModule, ClipboardModule, MatSnackBarModule],
  template: `
    <ng-container *ngIf="state$ | async as state">
      <textarea
        class="form-textarea text-sm w-full"
        [value]="state.statsText"
        title="クリックしてクリップボードにコピー"
        (click)="copyText(state.statsText)"
        readonly
      ></textarea>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsTextareaComponent {
  private readonly snackBar = inject(MatSnackBar);
  private readonly clipboard = inject(Clipboard);
  private readonly statsState = inject(StatsPageState);

  readonly state$ = this.statsState.state$.pipe(
    map(({ pokemon, level, nature, stats, evs }) => ({
      statsText: pokemon ? formatStats(pokemon, level, nature, stats, evs) : '',
    })),
  );

  copyText(text: string) {
    if (this.clipboard.copy(text)) {
      this.snackBar.open('コピーしました', '閉じる', { duration: 3000 });
    }
  }
}
