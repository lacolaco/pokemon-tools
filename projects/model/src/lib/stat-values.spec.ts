import { compareStatValues, serializeStatValues, deserializeStatValues } from './stat-values';

describe('StatValues', () => {
  it('should compare stat values', () => {
    expect(compareStatValues({ H: 1, A: 2, B: 3, C: 4, D: 5, S: 6 }, { H: 1, A: 2, B: 3, C: 4, D: 5, S: 6 })).toBe(
      true,
    );
    expect(compareStatValues({ H: 1, A: 2, B: 3, C: 4, D: 5, S: 6 }, { H: 1, A: 2, B: 3, C: 4, D: 5, S: 7 })).toBe(
      false,
    );
  });

  it('should serialize stat values', () => {
    expect(serializeStatValues({ H: 1, A: 2, B: 3, C: 4, D: 5, S: 6 })).toBe('1-2-3-4-5-6');
  });

  it('should deserialize stat values', () => {
    expect(deserializeStatValues('1-2-3-4-5-6')).toEqual({ H: 1, A: 2, B: 3, C: 4, D: 5, S: 6 });
  });
});
