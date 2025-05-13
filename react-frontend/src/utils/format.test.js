import {
  formatDate,
  formatDateRange,
  formatTime,
  formatDuration,
  localeUses24HourTime,
  locale0Hour,
} from './format'

describe('utils/format', () => {
  describe('formatDuration', () => {
    it('should be able to format times for the given locale.', () => {
      expect(formatDuration('00:12:34', false, 'en-US')).toEqual('00:12');
      expect(formatDuration('13:22:00', false, 'en-US')).toEqual('13:22');
      expect(formatDuration('12:34:56', true, 'en-US')).toEqual('12:34:56');
      expect(formatDuration('12:34:56', false, 'fr-FR')).toEqual('12:34');
      expect(formatDuration('12:34:56', true, 'fr-FR')).toEqual('12:34:56');
    });
  });

  describe('formatTime', () => {
    it('should be able to format times for the given locale.', () => {
      expect(formatTime('1900-01-01T13:22:00', false, 'en-US')).toEqual('01:22 PM');
      expect(formatTime('1900-01-01T00:12:34', false, 'en-US')).toEqual('12:12 AM');
      expect(formatTime('1900-01-01T00:12:34', true, 'en-US')).toEqual('12:12:34 AM');
      expect(formatTime('1900-01-01T00:12:34', false, 'fr-FR')).toEqual('00:12');
      expect(formatTime('1900-01-01T00:12:34', true, 'fr-FR')).toEqual('00:12:34');
    });
  });

  describe('localeUses24HourTime', () => {
    it('should be able to determine if the given locale uses a 24 hour clock.', () => {
      expect(localeUses24HourTime('en-US')).toBe(false);
      expect(localeUses24HourTime('en-UK')).toBe(true);
    });
  });

  describe('locale0Hour', () => {
    it('should be able to determine if the given locale prefers "12:00 AM" or "00:00".', () => {
      expect(locale0Hour('en-US')).toEqual(12);
      expect(locale0Hour('fr-FR')).toEqual(0);
    });
  });

  describe('formatDate', () => {
    it('should format dates using dateStyle medium by default.', () => {
      expect(formatDate(new Date('1/1/2020'), undefined, 'en-US')).toEqual('Jan 1, 2020');
    });

    it('should be able to pass a dateStyle to achieve different date formats.', () => {
      expect(formatDate(new Date('1/1/2020'), {dateStyle: 'short'}, 'en-US')).toEqual('1/1/20');
      expect(formatDate(new Date('1/1/2020'), {dateStyle: 'long'}, 'en-US')).toEqual('January 1, 2020');
    });

    it('should be able to pass either a Date, a string or a number.', () => {
      const date = '1/1/2020';
      expect(formatDate((new Date(date)).toISOString(), undefined, 'en-US')).toEqual('Jan 1, 2020');
      expect(formatDate(date, undefined, 'en-US')).toEqual('Jan 1, 2020');

      const mili = (new Date(date)).getTime();
      expect(formatDate(mili, undefined, 'en-US')).toEqual('Jan 1, 2020');
    });

    it('should be able to handle empty values.', () => {
      expect(formatDate()).toEqual('');
      expect(formatDate(null)).toEqual('');
      expect(formatDate(false)).toEqual('');
      expect(formatDate(true)).toEqual('');
    });
  });

  describe('formatDateRange', () => {
    let dates;
    beforeEach(() => {
      dates = [
        new Date('1/1/2020'),
        new Date('2/2/2020'),
        new Date('3/3/2020'),
      ];
    })

    it('should be able to format an array of Dates.', () => {
      expect(formatDateRange(dates)).toEqual('Jan 1 - Mar 3, 2020');
      expect(formatDateRange([
        new Date('1/1/2021'),
        new Date('1/1/2020'),
      ])).toEqual('Jan 1, 2020 - Jan 1, 2021');
    });

    it('should be able to handle a string date array.', () => {
      expect(formatDateRange(dates.map(d => d.toISOString()))).toEqual('Jan 1 - Mar 3, 2020');
    });

    it('should be able to handle non-Array values.', () => {
      expect(formatDate(dates[0])).toEqual('Jan 1, 2020');
      expect(formatDate(dates[0].toISOString())).toEqual('Jan 1, 2020');
    });

    it('should be able to format a single Date.', () => {
      expect(formatDateRange(dates.slice(0, 1))).toEqual('Jan 1, 2020');
      expect(formatDateRange(dates[0])).toEqual('Jan 1, 2020');
    });

    it('should only render one date if all dates are on the same day.', () => {
      expect(formatDateRange([
        (new Date('1/1/2020 10:30')),
        (new Date('1/1/2020 11:00')),
        (new Date('1/1/2020 13:45')),
      ])).toEqual('Jan 1, 2020');
    });

    it('should be able to handle falsy values.', () => {
      // @ts-ignore
      expect(formatDateRange()).toEqual('');
      expect(formatDateRange(null)).toEqual('');
      expect(formatDateRange('')).toEqual('');
      expect(formatDateRange([])).toEqual('');
    });
  });
});
