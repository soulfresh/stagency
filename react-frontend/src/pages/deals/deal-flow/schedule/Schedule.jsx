import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import { TitleL } from '~/components';

import { ShowScheduleSpreadsheet } from './show-schedule-spreadsheet';
import { PerformanceScheduleSpreadsheet } from './performance-schedule-spreadsheet';

import styles from './Schedule.module.scss';

// Memoize these because AgGrid will remove focus from any
// currently editing cells if it re-renders.
const ShowScheduleSpreadsheetMemo = React.memo(ShowScheduleSpreadsheet);
const PerformanceScheduleSpreadsheetMemo = React.memo(PerformanceScheduleSpreadsheet);

/**
 * `<Schedule>`
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {object} [props.deal]
 * @param {object} props.config
 * @param {function} [props.onShowScheduleUpdate]
 * @param {function} [props.onShowScheduleRemove]
 * @param {function} [props.onPerformanceScheduleUpdate]
 * @param {function} [props.onPerformanceScheduleRemove]
 * @param {string} [props.domLayout]
 * @param {function} [props.ResizeObserver]
 * @param {function} [props.onContentReady]
 * @return {React.ReactElement}
 */
export function Schedule({
  className,
  deal,
  config, // Catch this so it's not passed to the DOM
  onShowScheduleUpdate,
  onShowScheduleRemove,
  onPerformanceScheduleUpdate,
  onPerformanceScheduleRemove,
  domLayout,
  ResizeObserver,
  onContentReady,
  ...rest
}) {
  const ready = React.useRef([]).current;

  const handleContentReady = React.useCallback(n => {
    if (!ready.includes(n)) {
      ready.push(n)
      if (ready.length === 2 && onContentReady) {
        onContentReady();
      }
    }
  }, [ready, onContentReady])

  const onShowScheduleReady = React.useCallback(() => {
    handleContentReady('show')
  }, [handleContentReady]);

  const onPerformanceScheduleReady = React.useCallback(() => {
    handleContentReady('performance')
  }, [handleContentReady]);

  return (
    <div data-testid="Schedule"
      className={combineClasses(styles.Schedule, className)}
      {...rest}
    >
      <TitleL>Show Schedule</TitleL>
      <ShowScheduleSpreadsheetMemo
        className={styles.table}
        data={deal?.showSchedule}
        onRowChange={onShowScheduleUpdate}
        onRemoveRow={onShowScheduleRemove}
        domLayout={domLayout}
        ResizeObserver={ResizeObserver}
        onContentReady={onShowScheduleReady}
      />
      <TitleL>Performance Schedule</TitleL>
      <PerformanceScheduleSpreadsheetMemo
        className={styles.table}
        data={deal?.performanceSchedule}
        onRowChange={onPerformanceScheduleUpdate}
        onRemoveRow={onPerformanceScheduleRemove}
        domLayout={domLayout}
        ResizeObserver={ResizeObserver}
        onContentReady={onPerformanceScheduleReady}
      />
    </div>
  );
}

Schedule.propTypes = {
  /**
   * The current deal being edited.
   */
  deal: PropTypes.object.isRequired,
  onShowScheduleUpdate: PropTypes.func,
  onShowScheduleRemove: PropTypes.func,
  onPerformanceScheduleUpdate: PropTypes.func,
  onPerformanceScheduleRemove: PropTypes.func,
  ResizeObserver: PropTypes.func,
  onContentReady: PropTypes.func,
  domLayout: PropTypes.string,
};

