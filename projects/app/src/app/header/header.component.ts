import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatMenuModule, RouterLink],
  template: `
    <div class="container mat-elevation-z2">
      <span class="title">Pokémon Battle Tools</span>
      <div>
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon fontIcon="apps"></mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <a mat-menu-item routerLink="/stats" class="menu-item">
            <mat-icon fontIcon="calculate"></mat-icon>
            <span>ステータス計算機</span>
          </a>
        </mat-menu>
      </div>
    </div>
  `,
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
