import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'stats',
    loadComponent: () => import('./stats/stats.component').then((m) => m.StatsPageComponent),
    title: 'ステータス計算機 for スカーレット・バイオレット',
  },
  {
    path: '**',
    redirectTo: 'stats',
  },
];
