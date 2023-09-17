import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PokemonStats } from '../../../models/pokemon-state';

@Component({
  selector: 'stats-hp-multiple',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatChipsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span>HP倍数チェック</span>
    <div class="px-2">
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
      mat-chip-set {
        font-size: 12px;
        --mdc-chip-container-height: 20px;
      }
      .mdc-evolution-chip-set .mdc-evolution-chip {
        margin-top: unset;
      }
      mat-chip.off {
        --mdc-chip-label-text-color: #999;
      }
    `,
  ],
  host: {
    class: 'grid grid-cols-[1fr]',
  },
})
export class StatsHpMultipleComponent {
  @Input({ required: true }) stats!: PokemonStats;

  get hpIndicators() {
    const H = this.stats.values.H || 0;
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
