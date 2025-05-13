import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import {
  Spreadsheet,
  EditableSpreadsheetColumn,
  TimeSpreadsheetColumn,
  getStandardColumnWidths,
} from '~/components';

import styles from './ShowScheduleSpreadsheet.module.scss';

/**
 * `<ShowScheduleSpreadsheet>` allows the user to set the schedule
 * for pre and post show events like load in and tear down.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {function} [props.onRowChange]
 * @param {function} [props.onRemoveRow]
 * @param {string} [props.domLayout]
 * @param {function} [props.ResizeObserver]
 * @param {function} [props.onContentReady]
 * @param {*[]} [props.data]
 */
export function ShowScheduleSpreadsheet({
  data,
  className,
  domLayout = "autoHeight",
  ...rest
}) {
  const {m, xl} = getStandardColumnWidths();

  return (
    <Spreadsheet
      data-testid="ShowScheduleSpreadsheet"
      className={combineClasses(styles.ShowScheduleSpreadsheet, className)}
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
        field="type"
        headerTooltip="Load In, Door, Show Start, etc."
        placeholder='Ex. "Load In"'
        width={m}
      />

      <EditableSpreadsheetColumn
        field="notes"
        minWidth={xl}
      />
    </Spreadsheet>
  );
}

ShowScheduleSpreadsheet.propTypes = {
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
  onContentReady: PropTypes.func,
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

