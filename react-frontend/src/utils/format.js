import { userLocale } from '@thesoulfresh/react-tools';

export function isValidDateParam(date) {
  const type = typeof(date);
  return (
    (date != null) &&
    (type === 'object' || type === 'string' || type === 'number')
  );
}

/**
 * Determine the number that is used as the 0 hour for the given locale. In
 * other words, does the user prefer to see '12:00 AM' or '00:00'?
 * If they prefer '12:00 AM', then the number 12 is returned, otherwise 0 is
 * returned.
 * @param {string} [locale] - Defaults to the user's locale preference.
 * @return {number}
 */
export function locale0Hour(locale = userLocale()) {
  const result = new Intl.DateTimeFormat(locale, {
    timeStyle: 'short',
  }).format(new Date('1900-01-01T00:00:00.000'))
  const h = result.split(':')[0];
  return parseInt(h, 10) || 0;
}

/**
 * Determine if the given locale uses 24 hour or 12 hour time formattting.
 * @param {string} [locale] - Defaults to the user's locale preference.
 * @return {boolean}
 */
export function localeUses24HourTime(locale = userLocale()) {
  const result = new Intl.DateTimeFormat(locale, {
    timeStyle: 'short',
  }).format(new Date('1900-01-01T13:00:00.000'))
  return !(parseInt(result.split(':')[0], 10) === 1);
}

/**
 * Format an ISO duration string for display in the user's locale.
 * @param {Date | string | number} [date] - Defaults to the current date.
 * @param {boolean} [withSeconds] - Whether to include the seconds in the
 *   output.
 * @param {string} [locale] - Defaults to the user's locale preference.
 * @return {string}
 */
export function formatDuration(date, withSeconds = false, locale = userLocale()) {
  let options = {
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
  };
  if (withSeconds) {
    options = {
      ...options,
      second: '2-digit',
    }
  }

  let d = new Date();
  if (typeof(date) === 'string') {
    d = new Date(`1900-01-01T${date}`);
  } else if (typeof(date) === 'number') {
    d = new Date(d);
  } else if (date instanceof Date) {
    d = date;
  }

  return new Intl.DateTimeFormat(locale, options).format(d);
}

/**
 * Format an ISO time string for display in the user's locale.
 * @param {Date | string | number} [date] - Defaults to the current date.
 * @param {boolean} [withSeconds] - Whether to include the seconds in the
 *   output.
 * @param {string} [locale] - Defaults to the user's locale preference.
 * @return {string}
 */
export function formatTime(date, withSeconds = false, locale = userLocale()) {
  let options = {};
  if (withSeconds) {
    options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }
  } else {
    options = {
      hour: '2-digit',
      minute: '2-digit',
    }
  }
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

/**
 * Format a single date for localized display. This is a one liner
 * around Intl.DateTimeFormat that automatically casts ISO date strings
 * into Date objects for you.
 * @param {Date | string | number} date
 * @param {object} [options] - Intl.DateTimeFormat options.
 *   If you don't pass this, it will default to the style used
 *   across the application.
 *   See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @return {string}
 */
export function formatDate(date, options = {dateStyle: 'medium'}, locale = userLocale()) {
  if (!isValidDateParam(date)) return '';
  date = new Date(date);
  return (
    new Intl.DateTimeFormat(locale, options)
  ).format(date);
}

/**
 * Format an array of dates as a string showing the min
 * and max dates.
 * @param {Date | string | Date[] | string[]} dates
 * @param {object} [options] - Intl.DateTimeFormat options
 *   If you don't pass this, it will default to the style used
 *   across the application.
 *   See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @return {string}
 */
export function formatDateRange(dates, options) {
  if (!dates) return '';
  // @ts-ignore: handled by formatDate
  if (!Array.isArray(dates)) dates = [dates];
  dates = dates.filter(d => isValidDateParam(d));
  // @ts-ignore: handled by conditional
  if (dates.length === 0) return '';

  // @ts-ignore: handled by previous condition
  const min = new Date( Math.min(...(dates.map(d => (new Date(d)).getTime()))) );
  // @ts-ignore: handled by previous condition
  const max = new Date( Math.max(...(dates.map(d => (new Date(d)).getTime()))) );

  const right = new Intl.DateTimeFormat(userLocale(), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });

  if (
    min.getFullYear() === max.getFullYear() &&
    min.getMonth() === max.getMonth() &&
    min.getDate() === max.getDate()
  ) {
    return right.format(min);
  }

  // TODO Handle the case where the min/max date are on the same day
  const left = new Intl.DateTimeFormat(userLocale(), {
    year: min.getFullYear() === max.getFullYear() ? undefined : 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });

  return `${left.format(min)} - ${right.format(max)}`;
}

