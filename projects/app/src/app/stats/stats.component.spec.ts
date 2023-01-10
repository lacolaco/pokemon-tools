import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonData } from '../shared/pokemon-data';

import { StatsPageComponent } from './stats.component';

describe('StatsComponent', () => {
  let component: StatsPageComponent;
  let fixture: ComponentFixture<StatsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsPageComponent],
    }).compileComponents();
    await TestBed.inject(PokemonData).initialize();

    fixture = TestBed.createComponent(StatsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
