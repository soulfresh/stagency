import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import {
  Spreadsheet,
  EditableSpreadsheetColumn,
  TimeSpreadsheetColumn,
  getStandardColumnWidths,
} from '~/components';

import styles from './PerformanceScheduleSpreadsheet.module.scss';

/**
 * `<PerformanceScheduleSpreadsheet>`
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {function} [props.onRowChange]
 * @param {function} [props.onRemoveRow]
 * @param {object[]} [props.data]
 * @param {string} [props.domLayout]
 * @param {function} [props.ResizeObserver]
 * @param {function} [props.onContentReady]
 */
export function PerformanceScheduleSpreadsheet({
  data,
  className,
  domLayout = "autoHeight",
  ...rest
}) {
  const {m, xl} = getStandardColumnWidths();

  return (
    <Spreadsheet
      data-testid="PerformanceScheduleSpreadsheet"
      className={combineClasses(styles.PerformanceSchedule, className)}
      domLayout={domLayout}
      rowData={data}
      userControlledRows
      {...rest}
    >
      <TimeSpreadsheetColumn
        field="startTime"
        headerName="Start Time"
        placeholder="Set Time"
        width={m}
      />

      <EditableSpreadsheetColumn
        field="artist"
        headerName="Artist"
        placeholder="Enter Artist Name"
        width={m}
      />

      <TimeSpreadsheetColumn
        field="setLength"
        headerName="Total Set Length"
        placeholder="00:00"
        duration
        width={m}
      />

      <EditableSpreadsheetColumn
        field="notes"
        headerName="Notes"
        width={xl}
      />
    </Spreadsheet>
  );
}

PerformanceScheduleSpreadsheet.propTypes = {
  /**
   * The data for the table.
   */
  data: PropTypes.arrayOf(PropTypes.object),
  /**
   * Whether the table grows to fit the data or
   * scrolls to view the data. Using the autoHeight
   * or print layouts is important for testing.
   */
  domLayout: PropTypes.oneOf(['autoHeight', 'print', 'normal']),
  /**
   * Will be called on first render. This is useful
   * for testing to ensuer the data is rendered before
   * validating it's content.
   */
  onFirstDataRendered: PropTypes.func,
  /**
   * Turn of animations within the table.
   */
  disableAnimations: PropTypes.bool,
  /**
   * Allows you to provide a ResizeObserver polyfil.
   * This is necessary during testing.
   */
  ResizeObserver: PropTypes.func,
  /**
   * You can also pass any other props of the `Spreadsheet` component.
   */
  'Spreadsheet props...': PropTypes.any,
};

