import { cssTimeToMS } from './time';

describe('time', () => {
  describe('cssTimeToMS', () => {
    it('should be able to convert time strings to milliseconds.', () => {
      expect(cssTimeToMS('10ms')).toEqual(10);
      expect(cssTimeToMS('-1200ms')).toEqual(-1200);
      expect(cssTimeToMS('10s')).toEqual(10000);
      expect(cssTimeToMS('5s')).toEqual(5000);
      expect(cssTimeToMS('12')).toEqual(12);
    });

    it('should be able to handle non-string values.', () => {
      expect(cssTimeToMS('')).toEqual(0);
      expect(cssTimeToMS('foo')).toEqual(0);
      // @ts-ignore
      expect(cssTimeToMS(10)).toEqual(10);
      // @ts-ignore
      expect(cssTimeToMS(true)).toEqual(0);
      // @ts-ignore
      expect(cssTimeToMS(false)).toEqual(0);
      // @ts-ignore
      expect(cssTimeToMS()).toEqual(0);
      // @ts-ignore
      expect(cssTimeToMS(null)).toEqual(0);
    });
  });
});
