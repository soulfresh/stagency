import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import { Cell } from './Cell.jsx';

import styles from './FooterCell.module.scss';

/**
 * Aggregate the values in a column using the reduce method
 * to determine how each cell is accumulated into the final
 * value.
 */
function aggregateColumn(reduce, {api, node, column, ...rest}) {
  let total = 0;
  api.forEachNodeAfterFilter((row, i) => {
    let value = api.getValue(column, row);
    if (isNaN(value)) value = 0;

    total = reduce(total, value, i, row);
  });

  return total;
}

/**
 * @typedef {object} FooterCellProps
 * @property {*} [ref]
 * @property {*} [footer] - The content to render as the children.
 *   The children are passed as footer here (instead of as the children
 *   prop) because of a bug in AgGrid where the `cellRendererSelector` only
 *   renders its params on the first render but are lost on subsequent renders.
 * @property {string} [className]
 * @property {function} [reduce]
 * @property {number|string} [value]
 * @property {object} colDef
 * @property {object} api
 * @property {object} columnApi
 * @property {string} tableName
 * @property {number} rowIndex
 * @property {object} node
 */
/**
 * `<FooterCell>` provides a customized footer cell render for
 * the `Spreadsheet` component. If you pass a render function
 * as the component `children`, it will be called with
 * the cell data and a ref that you should attach to
 * your returned element.
 *
 * @type React.FC<FooterCellProps>
 */
export const FooterCell = React.forwardRef(({
  className,
  reduce,
  footer,
  value,
  ...props
}, ref) => {
  const {colDef, api, node} = props;

  const [aggregatedValue, setAggregatedValue] = React.useState(() => {
    // If a reducer was specified, aggregate the column data our selves.
    if (reduce)
      return aggregateColumn(reduce, props);
    // Otherwise, just use whatever was passed by AgGrid.
    else
      return value;
  });

  React.useEffect(() => {
    if (reduce) {
      // Re-aggregate the column data for any non-footer cell changes.
      const onCellChanged = (gridAPI) => {
        if (gridAPI.node !== node) {
          setAggregatedValue(
            aggregateColumn(reduce, props)
          );
        }
      };

      api.addEventListener('cellValueChanged', onCellChanged);

      return () => {
        api.removeEventListener('cellValueChanged', onCellChanged);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Cell
      className={combineClasses(styles.FooterCell, className)}
      {...props}
      colDef={colDef}
      value={aggregatedValue}
      children={footer}
      ref={ref}
    />
  );
});

FooterCell.propTypes = {
  footer: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  reduce: PropTypes.func,
};
