import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Stat, StatValues } from '@lib/stats';

@Component({
  selector: 'stats-hp-multiple',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatTooltipModule, MatChipsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 mat-dialog-title>HP倍数の確認</h1>
    <div mat-dialog-content>
      <div class="text-sm">実数値: {{ stats.H }}</div>
      <mat-chip-set class="py-2">
        <mat-chip
          *ngFor="let indicator of hpIndicators; trackBy: trackIndicator"
          [class.off]="!indicator.value"
          [highlighted]="indicator.value"
          disableRipple
          [matTooltip]="indicator.description"
          [matTooltipDisabled]="false"
        >
          {{ indicator.label }}
        </mat-chip>
      </mat-chip-set>
    </div>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: 1fr;
      }
      mat-chip-set {
        font-size: 12px;
        --mdc-chip-container-height: 20px;
      }
      mat-chip.off {
        --mdc-chip-label-text-color: #999;
      }
    `,
  ],
})
export class StatsHpMultipleComponent {
  private readonly dialogRef = inject(MatDialogRef);
  readonly stats = inject<{ stats: StatValues<Stat | null> }>(MAT_DIALOG_DATA).stats;

  get hpIndicators() {
    const H = this.stats.H || 0;
    return [
      { label: '2n+1', value: H % 2 === 1, description: 'じこさいせい等の回復量を最大化する' },
      { label: '3n', value: H % 3 === 0, description: 'さいせいりょく、混乱きのみの回復量を最大化する' },
      { label: '4n', value: H % 4 === 0, description: 'みがわり3回で混乱きのみ・能力上昇きのみを発動する' },
      { label: '4n+1', value: H % 4 === 1, description: 'みがわり4回で残りHPが1になる' },
      { label: '6n-1', value: H % 6 === 5, description: 'ゴツゴツメットの接触ダメージを最小化する' },
      { label: '8n-1', value: H % 8 === 7, description: 'どくやさめはだ・てつのトゲ等の1/8ダメージを最小化する' },
      { label: '10n-1', value: H % 10 === 9, description: 'いのちのたまの反動ダメージを最小化する' },
      {
        label: '16n-1',
        value: H % 16 === 15,
        description: 'もうどく・やけど・すなあらし等の1/16ダメージを最小限にする',
      },
      { label: '16n', value: H % 16 === 0, description: 'たべのこし・くろいヘドロの回復量を最大化する' },
      { label: '16n+1', value: H % 16 === 1, description: 'たべのこし4回でみがわりを発動できる' },
      { label: '50n+1', value: H % 50 === 1, description: 'ちきゅうなげ・ナイトヘッドの攻撃を1回多く耐えられる' },
    ];
  }

  trackIndicator(_: number, indicator: { label: string }) {
    return indicator.label;
  }
}
