import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'stats',
    loadComponent: () => import('./stats/stats.component').then((m) => m.StatsPageComponent),
    title: 'ステータス計算機 for スカーレット・バイオレット',
  },
  {
    path: 'speed',
    loadComponent: () => import('./speed/speed.component').then((m) => m.SpeedPageComponent),
    title: 'すばやさ調整',
  },
  {
    path: '**',
    redirectTo: 'stats',
  },
];
