import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { AppIconButton } from '@app/shared/ui/buttons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatMenuModule, RouterLink, AppIconButton],
  template: `
    <div class="h-full flex items-center gap-y-2 py-2">
      <div class="flex-auto flex items-center gap-x-2">
        <img src="assets/images/icon.png" alt="Pokémon Battle Tools" class="h-6" />
        <span class="text-lg font-bold">Pokémon Battle Tools</span>
      </div>
      <div>
        <button app-icon-button [matMenuTriggerFor]="menu">
          <mat-icon fontIcon="apps"></mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <a mat-menu-item routerLink="/stats">
            <mat-icon fontIcon="calculate" class="text-gray-600"></mat-icon>
            <span>ステータス計算機</span>
          </a>
          <a mat-menu-item routerLink="/speed">
            <mat-icon fontIcon="speed" class="text-gray-600"></mat-icon>
            <span>すばやさ調整</span>
          </a>
        </mat-menu>
      </div>
    </div>
  `,
  host: { class: 'block h-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
