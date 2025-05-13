import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import styles from './Table.module.scss';

/**
 * `<Table>` is used to render a standard HTML `<table>` element
 * with our specific styles. Simply wrap your table with `<Table>`
 * (instead of lower case `<table>`) and write the rest of your table as normal.
 *
 * Example Usage:
 *
 * ```html
 * <Table>
 *   <theader>
 *     <tr>
 *       <th>Dogs</th>
 *       <th>Cats</th>
 *     </tr>
 *   </theader>
 *   <tbody>
 *     <tr>
 *       <td>1</td>
 *       <td>10</td>
 *     </tr>
 *   </tbody>
 * </Table>
 * ```
 *
 * @param {object} props
 * @param {string} [props.className]
 * @return {React.ReactElement}
 */
export function Table({
  className,
  children,
  ...rest
}) {
  return (
    <table data-testid="Table"
      className={combineClasses(styles.Table, className)}
      {...rest}
    >
      {children}
    </table>
  );
}

Table.propTypes = {
  /**
   * Standard HTML table elements like `<tr>`, `<thead>`, `<tbody>`, `<tfoot>`
   */
  children: PropTypes.node,
  /**
   * Any other props will be applied to the root `<table>` element.
   */
  'other props...': PropTypes.any,
};

