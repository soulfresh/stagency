import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import { getCellProps, getAriaLabel } from '../utils';

import styles from './Cell.module.scss';

/**
 * @typedef {object} CellProps
 * @property {*} [ref]
 * @property {number|string} [value]
 * @property {string} [valueFormatted]
 * @property {string} [className]
 * @property {function|string|number} [children]
 * @property {boolean} [derived]
 * @property {string} [tableName]
 * @property {number} rowIndex
 * @property {object} [column]
 * @property {function} [getValue]
 * @property {function} [setValue]
 * @property {object} [api]
 * @property {object} columnApi
 * @property {object} [colDef]
 * @property {object} [data-testid]
 */
/**
 * `<Cell>` provides a customized cell render for
 * the `Spreadsheet` component. If you pass a render function
 * as the component `children`, it will be called with
 * the cell data and a ref that you should attach to
 * your returned element.
 *
 * @type React.FC<CellProps>
 */
export const Cell = React.forwardRef(({
  value,
  valueFormatted,
  children,
  className,
  derived,
  column,
  rowIndex,
  getValue,
  setValue,
  tableName,
  api,
  columnApi,
  'data-testid': testId,
  ...rest
}, ref) => {
  const displayValue = valueFormatted || value;

  const cellProps = getCellProps(rest);

  const nextProps = {
    // Add a data-rendered attribute to all cell containers
    // so we can determine when all of the cells have been rendered.
    'data-rendered': true,
    'aria-label': getAriaLabel(rowIndex, column, columnApi, tableName),
    className: combineClasses(
      styles.Cell,
      className,
      derived ? styles.derived : null
    ),
    'data-testid': testId,
    ...cellProps
  };

  if (children && typeof(children) === 'function') {
    // @ts-ignore
    return children(nextProps, ref, {value, valueFormatted, getValue, setValue, column, rowIndex, api, columnApi, ...rest});
  } else {
    return (
      <div
        data-testid="Cell"
        {...nextProps}
        ref={ref}
      >
        { children || displayValue }
      </div>
    );
  }
});

Cell.propTypes = {
  /**
   * Whether the data for this cell should receive the derived
   * column styling.
   */
  derived: PropTypes.bool,
  /**
   * The value to render.
   */
  value: PropTypes.any,
  /**
   * A formatted version of the data to render.
   */
  valueFormatted: PropTypes.string,
};

