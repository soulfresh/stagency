import React from 'react';
import PropTypes from 'prop-types';

/**
 * @typedef {object} ColDef
 * @property {string} [field]
 * @property {string} [headerName]
 * @property {function} [valueGetter]
 * @property {number} [minWidth]
 * @property {number} [width]
 * @property {string} [placeholder]
 */

/**
 * @typedef {ColDef} SpreadsheetColumnProps
 * @property {function} [children]
 * @property {*} [headerTooltip]
 * @property {bool} [derived]
 */
/**
 * `<SpreadsheetColumn>` should be used in place of `AgGridColumn` to
 * render standard, non-editable cells. You can pass any of the
 * parameters of `AgGridColumn`.
 * By default it will render a `<div>` but you can customize that
 * further by passing a render function as the component `children`.
 * The `children` function will be called for each cell in the column
 * with props to attach to your component, a ref you must attach to
 * the element you return and the AgGrid API. Don't forget to attach
 * the ref!
 *
 * #### Derived Data
 *
 * Use the standard `valueGetter` prop to calculate derived data
 * for a cell. You can also pass the `derived` prop if you want
 * the column to display with the derived column styling.
 *
 * @param {SpreadsheetColumnProps} props
 */
export function SpreadsheetColumn(props) { return <div />; }

SpreadsheetColumn.propTypes = {
  /**
   * A function to render the content for each cell in the column.
   * It will be passed 3 parameters, including the cell data received from
   * AgGridColumn and a ref you must attach to the root element you return.
   * @param {object} [props] - Props that you should attach to the root
   *   element you return.
   * @param {function} [props.onChange] - An change handler that should either
   *   receive the event object from an input element or it should receive the
   *   new value to set.
   * @param {string} [props.className] - Classes to apply to your element.
   * @param {*} [ref] - The ref to attach to your returned cell content.
   * @param {object} [api] - The props received from `AgGridColumn`. See
   *   https://github.com/ag-grid/ag-grid/blob/master/community-modules/core/src/ts/interfaces/iCellEditor.ts#L56
   */
  children: PropTypes.func,
  /**
   * Tooltip content to show when hovering over the column header.
   */
  headerTooltip: PropTypes.node,
  /**
   * Whether this column should receive the derived data style
   * (gray background).
   */
  derived: PropTypes.bool,
  /**
   * The content to render in the last column cell if the `Spreadsheet`
   * is displaying a "Total" row (ie. you passed the `totals`
   * prop to the `Spreadsheet` component).
   *
   * You can pass any JSX content as the footer or you can
   * pass a function. It receives the same props as the
   * `children` prop. Don't forget to attach the `ref` to
   * your returned element.
   *
   * If you don't pass a `footer` prop or a `reduce` prop,
   * then the footer cell will be empty.
   */
  footer: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  /**
   * A function that allows you to reduce the values in the
   * column into a single value to display in the footer cell.
   * For example, you can sum the column cells with:
   * `(value, total) => total + value`.
   *
   * @param {number} total - The current accumulated value
   * @param {number} value - The current cell value
   * @param {number} index - The current cell index
   * @param {number} row - The AgGrid Row definition for the current cell.
   */
  reduce: PropTypes.func,
  /**
   * You can also pass any props of `AgGridColumn` or that you wish
   * to pass along to the cell renderers. If you are rendering your
   * own custom cell components, it is preferred you set those props directly
   * through your custom component or by passing a children render prop
   * where you can specify them directly.
   */
  'other props...': PropTypes.any,
};


/**
 * @typedef {ColDef} EditableSpreadsheetColumnProps
 * @property {function} [children]
 * @property {*} [headerTooltip]
 * @property {*} [ResizeObserver]
 */
/**
 * `<EditableSpreadsheetColumn>` provides a table column who's cells
 * can be edited by the user. By default it will render our
 * `Input` component but this can be customized by passing a render
 * function as the component children (same as `SpreadsheetColumn`).
 *
 * #### Validation
 *
 * You can validate the user's input by passing a validate
 * prop to your Editable columns. The validate method should
 * either return the valid value or a promise that resolves to
 * the valid value. This allows you to transform the input value
 * from a string to a number before it is applied to the table data.
 * You may find [Yup](https://github.com/jquense/yup) helpful for
 * writting your validators.
 *
 * In addition to the value to validate, you will be passed the
 * AgGrid API as the second parameter.
 *
 * Example:
 *
 * ```js
 * // Validate that the value is a number and if not, convert it to 0
 * validate={v =>
 *   yup.number()
 *     .transform(v => isNaN(v) ? 0 : v)
 *     .validate(v)
 * }
 * ```
 *
 * @param {EditableSpreadsheetColumnProps} props
 */
export function EditableSpreadsheetColumn(props) { return <div />; }

EditableSpreadsheetColumn.propTypes = {
  /**
   * A function to render the content for each cell in the column.
   * It will be passed 3 parameters, including the cell data received from
   * AgGridColumn and a ref you must attach to the root element you return.
   * @param {object} [props] - Props that you should attach to the root
   *   element you return.
   * @param {function} [props.onChange] - An change handler that should either
   *   receive the event object from an input element or it should receive the
   *   new value to set.
   * @param {function} [props.onClick]
   * @param {string} [props.className] - Classes to apply to your element.
   * @param {*} [ref] - The ref to attach to your returned cell content.
   * @param {object} [api] - The props received from `AgGridColumn`. See
   *   https://github.com/ag-grid/ag-grid/blob/master/community-modules/core/src/ts/interfaces/iCellEditor.ts#L56
   */
  children: PropTypes.func,
  /**
   * Tooltip content to show when hovering over the column header.
   */
  headerTooltip: PropTypes.node,
  /**
   * The content to render in the last column cell if the `Spreadsheet`
   * is displaying a "Total" row (ie. you passed the `totals`
   * prop to the `Spreadsheet` component).
   *
   * You can pass any JSX content as the footer or you can
   * pass a function. It receives the same props as the
   * `children` prop. Don't forget to attach the `ref` to
   * your returned element.
   *
   * If you don't pass a `footer` prop or a `reduce` prop,
   * then the footer cell will be empty.
   */
  footer: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  /**
   * A function that allows you to reduce the values in the
   * column into a single value to display in the footer cell.
   * For example, you can sum the column cells with:
   * `(value, total) => total + value`.
   *
   * @param {number} total - The current accumulated value
   * @param {number} value - The current cell value
   * @param {number} index - The current cell index
   * @param {number} row - The AgGrid Row definition for the current cell.
   */
  reduce: PropTypes.func,
  /**
   * A function that can be used to validate the data on change.
   * It should return the value or a promise that resolves to the
   * value. This allows you to coerce the value as part of the validation.
   * If the function throws an error or the promise rejects, then
   * an error message will be shown.
   * @param {*} value - The value to validate.
   * @param {object} api - The AgGrid API including the row data.
   */
  validate: PropTypes.func,
  /**
   * A ResizeObserver polyfill (useful during testing).
   */
  ResizeObserver: PropTypes.func,
  /**
   * You can also pass any props of `AgGridColumn` or that you wish
   * to pass along to the cell renderers. If you are rendering your
   * own custom cell components, it is preferred you set those props directly
   * through your custom component or by passing a children render prop
   * where you can specify them directly.
   */
  'other props...': PropTypes.any,
};


/**
 * @typedef {ColDef} SelectableSpreadsheetColumnProps
 * @property {string} [placeholder]
 * @property {function} [children]
 * @property {*[]} [options]
 * @property {*} [headerTooltip]
 */
/**
 * `<SelectableSpreadsheetColumn>` provides a table column with `Select`
 * components as the cells.
 *
 * @param {SelectableSpreadsheetColumnProps} props
 */
export function SelectableSpreadsheetColumn(props) { return <div/>; }

SelectableSpreadsheetColumn.propTypes = {
  /**
   * A function to render the content for each cell in the column.
   * It will be passed 3 parameters, including the cell data received from
   * AgGridColumn and a ref you must attach to the root element you return.
   * @param {object} [props] - Props that you should attach to the root
   *   element you return.
   * @param {function} [props.onChange] - An change handler that should either
   *   receive the event object from an input element or it should receive the
   *   new value to set.
   * @param {string} [props.className] - Classes to apply to your element.
   * @param {*} [ref] - The ref to attach to your returned cell content.
   * @param {object} [api] - The props received from `AgGridColumn`. See
   *   https://github.com/ag-grid/ag-grid/blob/master/community-modules/core/src/ts/interfaces/iCellEditor.ts#L56
   */
  children: PropTypes.func,
  /**
   * The array of options that the user can select from.
   */
  options: PropTypes.array,
  /**
   * Placeholder text to use if the cell does not have a value yet.
   */
  placeholder: PropTypes.string,
  /**
   * Tooltip content to show when hovering over the column header.
   */
  headerTooltip: PropTypes.node,
  /**
   * The content to render in the last column cell if the `Spreadsheet`
   * is displaying a "Total" row (ie. you passed the `totals`
   * prop to the `Spreadsheet` component).
   *
   * You can pass any JSX content as the footer or you can
   * pass a function. It receives the same props as the
   * `children` prop. Don't forget to attach the `ref` to
   * your returned element.
   *
   * If you don't pass a `footer` prop or a `reduce` prop,
   * then the footer cell will be empty.
   */
  footer: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  /**
   * A function that allows you to reduce the values in the
   * column into a single value to display in the footer cell.
   * This probably doesn't have much use in a Select column but
   * maybe you can find a creative use for it.
   *
   * @param {number} total - The current accumulated value
   * @param {number} value - The current cell value
   * @param {number} index - The current cell index
   * @param {number} row - The AgGrid Row definition for the current cell.
   */
  reduce: PropTypes.func,
  /**
   * You can also pass any props of `AgGridColumn` or that you wish
   * to pass along to the cell renderers. If you are rendering your
   * own custom cell components, it is preferred you set those props directly
   * through your custom component or by passing a children render prop
   * where you can specify them directly.
   */
  'other props...': PropTypes.any,
};


/**
 * @typedef {ColDef} TimeSpreadsheetColumn
 * @property {string} [placeholder]
 * @property {function} [children]
 * @property {*[]} [options]
 * @property {*} [headerTooltip]
 */
/**
 * `<TimeSpreadsheetColumn>` provides a table column with `TimeInput`
 * components as the cells. The can be used to allow the user to select either
 * discreat times (12:30 AM) or durations (01:30:00).
 *
 * @param {TimeSpreadsheetColumn} props
 */
export function TimeSpreadsheetColumn(props) { return <div/>; }

TimeSpreadsheetColumn.propTypes = {
  /**
   * Whether to show a duration input or a discrete time select input.
   */
  duration: PropTypes.bool,
  /**
   * Whether to allow users to select seconds.
   */
  withSeconds: PropTypes.bool,
  /**
   * Whether to force display in a 24 hour clock. It's preferred you don't set
   * this so the component can use the user's preferred hour display.
   */
  h24: PropTypes.bool,
  /**
   * Specify the increment used for the minutes column. Defaults to 5 minute
   * intervals.
   */
  minuteIncrement: PropTypes.number,
  /**
   * Specify the increment used for the seconds column. Defaults to 5 second
   * intervals.
   */
  secondIncrement: PropTypes.number,
  /**
   * The locale for time formatting. This should only be set during testing.
   */
  locale: PropTypes.string,
  /**
   * Placeholder text to use if the cell does not have a value yet.
   */
  placeholder: PropTypes.string,
  /**
   * Tooltip content to show when hovering over the column header.
   */
  headerTooltip: PropTypes.node,
  /**
   * The content to render in the last column cell if the `Spreadsheet`
   * is displaying a "Total" row (ie. you passed the `totals`
   * prop to the `Spreadsheet` component).
   *
   * You can pass any JSX content as the footer or you can
   * pass a function. It receives the same props as the
   * `children` prop. Don't forget to attach the `ref` to
   * your returned element.
   *
   * If you don't pass a `footer` prop or a `reduce` prop,
   * then the footer cell will be empty.
   */
  footer: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  /**
   * A function that allows you to reduce the values in the
   * column into a single value to display in the footer cell.
   * This probably doesn't have much use in a Select column but
   * maybe you can find a creative use for it.
   *
   * @param {number} total - The current accumulated value
   * @param {number} value - The current cell value
   * @param {number} index - The current cell index
   * @param {number} row - The AgGrid Row definition for the current cell.
   */
  reduce: PropTypes.func,
  /**
   * You can also pass any props of `AgGridColumn` or that you wish
   * to pass along to the cell renderers. If you are rendering your
   * own custom cell components, it is preferred you set those props directly
   * through your custom component or by passing a children render prop
   * where you can specify them directly.
   */
  'other props...': PropTypes.any,
};
