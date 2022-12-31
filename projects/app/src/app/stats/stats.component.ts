import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StatsFormComponent } from './stats-form/stats-form.component';
import { StatsState } from './stats.state';

@Component({
  selector: 'app-stats',
  standalone: true,
  providers: [StatsState],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  imports: [CommonModule, StatsFormComponent],
})
export class StatsPageComponent {}
