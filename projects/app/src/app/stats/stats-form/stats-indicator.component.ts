import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Stats } from '@lib/model';

@Component({
  selector: 'stats-indicator',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatChipsModule],
  template: `
    <div>HP倍数</div>
    <div class="rows">
      <mat-chip-set>
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
        row-gap: 4px;
      }
      .rows {
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;
        column-gap: 8px;
        width: 100%;
      }
      mat-chip-set {
        width: 400px;
        font-size: 12px;
        --mdc-chip-container-height: 20px;
      }
      mat-chip.off {
        --mdc-chip-label-text-color: #999;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsIndicatorComponent {
  @Input() stats!: Stats;

  get hpIndicators() {
    const { H } = this.stats;
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
