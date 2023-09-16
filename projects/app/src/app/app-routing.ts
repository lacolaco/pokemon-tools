import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'stats',
    loadComponent: () => import('./stats/stats.component'),
    title: 'ステータス計算機 for スカーレット・バイオレット',
  },
  {
    path: 'speed',
    loadComponent: () => import('./speed/speed.component'),
    title: 'すばやさ比較調整ツール',
  },
  {
    path: '**',
    redirectTo: 'stats',
  },
];
