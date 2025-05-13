import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import { formatDateRange } from '~/utils';
import styles from './DateRange.module.scss';

/**
 * `<DateRange>` will render the earliest and
 * latest dates in a list of dates. You can specify
 * the date formatting using the `dateFormat` parameter
 * which will be passed to `Intl.DateTimeFormat`.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {Date[] | string[]} [props.dates]
 * @param {object} [props.dateFormat]
 * @return {React.ReactElement}
 */
export function DateRange({
  className,
  dates = [],
  dateFormat,
  ...rest
}) {
  const d = formatDateRange(dates, dateFormat);
  const parts = d.split('-').filter(s => !!s).map(s => s.trim());

  const wrap = c => <span className={styles.date}>{c}</span>;

  return (
    <span data-testid="DateRange"
      className={combineClasses(styles.DateRange, className)}
      {...rest}
    >
      {parts.length > 0 &&
        <>{wrap(parts[0])}{parts.length > 1 ? ' - ' : ''}</>
      }
      {parts.length > 1 && wrap(parts[1])}
    </span>
  );
}

DateRange.propTypes = {
  /**
   * The list of Dates to pick from.
   */
  dates: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ])),
  /**
   * Date formatting options object to pass
   * to `Intl.DateTimeFormat`
   */
  dateFormat: PropTypes.object,
};

