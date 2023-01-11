import { TestBed } from '@angular/core/testing';
import { PokemonData } from '../../shared/pokemon-data';
import { SpeedPageState } from '../speed.state';
import { SpeedComparisonTableState } from './comparison-table';

fdescribe('SpeedComparisonTableState', () => {
  let service: SpeedComparisonTableState;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [SpeedPageState, SpeedComparisonTableState],
    });
    await TestBed.inject(PokemonData).initialize();
    service = TestBed.inject(SpeedComparisonTableState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
