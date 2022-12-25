import { iv } from './models';

describe('iv', () => {
  it('should be able to create a valid IV', () => {
    expect(iv(0)).toBeDefined();
    expect(iv(31)).toBeDefined();
  });

  it('should throw an error when creating an invalid IV', () => {
    expect(() => iv(-1)).toThrowError();
    expect(() => iv(32)).toThrowError();
  });
});
