import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Stat, StatValues } from '@lib/stats';
import { StatsHpMultipleComponent } from './stats-hp-multiple.component';

@Component({
  selector: 'stats-analysis',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-row flex-wrap">
      <button mat-stroked-button (click)="openHpMultiple()">HP倍数の確認</button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      button {
        padding-top: 0.25em;
        padding-bottom: 0.25em;
      }
    `,
  ],
})
export class StatsAnalysisComponent {
  private readonly dialog = inject(MatDialog);

  @Input() stats!: StatValues<Stat | null>;

  openHpMultiple() {
    this.dialog.open(StatsHpMultipleComponent, {
      data: { stats: this.stats },
    });
  }
}
