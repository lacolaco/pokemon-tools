import { asIV } from './models';

describe('iv', () => {
  it('should be able to create a valid IV', () => {
    expect(asIV(0)).toBeDefined();
    expect(asIV(31)).toBeDefined();
  });

  it('should throw an error when creating an invalid IV', () => {
    expect(() => asIV(-1)).toThrowError();
    expect(() => asIV(32)).toThrowError();
  });
});
