import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedPageComponent } from './speed.component';

describe('SpeedComponent', () => {
  let component: SpeedPageComponent;
  let fixture: ComponentFixture<SpeedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeedPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpeedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
