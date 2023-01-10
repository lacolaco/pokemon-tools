import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonData } from '../../shared/pokemon-data';
import { SpeedPageState } from '../speed.state';

import { SpeedComparisonTableComponent } from './speed-comparison-table.component';

describe('SpeedComparisonTableComponent', () => {
  let component: SpeedComparisonTableComponent;
  let fixture: ComponentFixture<SpeedComparisonTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [SpeedPageState],
      imports: [SpeedComparisonTableComponent],
    }).compileComponents();
    await TestBed.inject(PokemonData).initialize();

    fixture = TestBed.createComponent(SpeedComparisonTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
