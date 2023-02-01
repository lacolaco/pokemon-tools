import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppStrokedButton } from '@app/shared/ui/buttons';
import { Stat, StatValues } from '@lib/stats';
import { StatsHpMultipleComponent } from './stats-hp-multiple.component';

@Component({
  selector: 'stats-analysis',
  standalone: true,
  imports: [CommonModule, AppStrokedButton, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-row flex-wrap">
      <button app-stroked-button (click)="openHpMultiple()">HP倍数の確認</button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
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
