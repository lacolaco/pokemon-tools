import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { map } from 'rxjs';
import { PokemonState } from '../../pokemon-state';
import { formatStats } from './formatter';

@Component({
  selector: 'app-stats-textarea',
  standalone: true,
  imports: [CommonModule, ClipboardModule, MatSnackBarModule, MatInputModule],
  template: `
    <ng-container *ngIf="state$ | async as state">
      <mat-form-field appearance="outline" subscriptSizing="dynamic" class="w-full">
        <textarea
          matInput
          class="w-full"
          [value]="state.statsText"
          title="クリックしてクリップボードにコピー"
          (click)="copyText(state.statsText)"
          readonly
        ></textarea>
      </mat-form-field>
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
  private readonly statsState = inject(PokemonState);

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
