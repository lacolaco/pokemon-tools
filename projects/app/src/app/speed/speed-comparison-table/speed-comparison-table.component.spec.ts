import { ComponentFixture, TestBed } from '@angular/core/testing';
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

    fixture = TestBed.createComponent(SpeedComparisonTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
