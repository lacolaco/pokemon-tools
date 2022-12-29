import { Routes } from '@angular/router';
import { StatsPageComponent } from './stats/stats.component';

export const routes: Routes = [
  {
    path: '',
    component: StatsPageComponent,
    title: 'ステータス計算機 for スカーレット・バイオレット',
  },
];
