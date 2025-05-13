// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import { useTimeout } from '@thesoulfresh/react-tools';
import { combineClasses } from '@thesoulfresh/utils';

import { createSortIndex, generateDataSortIndexes, addDataSortIndexes } from '~/utils';
import {
  Cell,
  EditableCell,
  SelectableCell,
  TimeInputCell,
  HeaderCell,
  FooterCell,
  RemoveCell,
} from './cells';
import {
  SpreadsheetColumn,
  SelectableSpreadsheetColumn,
  EditableSpreadsheetColumn,
  TimeSpreadsheetColumn,
} from './Columns.jsx';

import './ag-grid-global.scss';
import styles from './Spreadsheet.module.scss';

// TODO Consider `react-window` with `react-table` as a replacement
// for AgGrid. Here are some examples showing virtualized scrolling
// with pinned rows and/or columns:
// https://codesandbox.io/s/strange-feistel-kwsed?file=/grid-with-sticky-cells.jsx:94-109
// https://codesandbox.io/s/0mk3qwpl4l

function isNumber(n) {
  return n != null && Number.isFinite(n);
}

/**
 * Determine if the given row has a value in any of
 * its keys.
 * @param {object} row
 * @param {string[]} blacklist - object keys to ignore
 *   when determining if an object is considered empty.
 * @return {boolean}
 */
export function isRowEmpty(row, blacklist = ['sortOrder']) {
  const keys = Object.keys(row);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = row[key];
    if (value != null && !blacklist.includes(key)) return false;
  }
  return true;
}

function isCellRendered(column, row, root = document.body) {
  return !!(root.querySelector(
    `[row-id="${row.id}"] [col-id="${column.colId}"] [data-rendered]`
  ));
}

/**
 * Wait for the last visible cell in the spreadsheet to
 * be rendered. This works by getting the spreadsheet's
 * currently visible rows and columns and then starting
 * a mutation observer that watches for DOM changes in
 * the spreadsheet. When the bottom right visible cell DOM
 * contains an element with the `data-rendered` prop,
 * then the onReady method is called. This ensures
 * that the spreadsheet data is visible when the onReady
 * event is emitted (important for testing).
 */
function waitForLastCellToRender(onReady, root, agGridAPI, wait, timeout = 1000) {
  const {api, columnApi} = agGridAPI;
  const rows = api.getRenderedNodes();
  const lastRow = rows[rows.length - 1];
  const columns = columnApi.getAllDisplayedColumns();
  const lastColumn = columns[columns.length - 1];

  if (isCellRendered(lastColumn, lastRow)) {
    onReady();
    return null;
  } else {
    const ref = {};

    const timeoutId = wait(() => {
      console.warn(`[waitForLastCellRender] timed out waiting for the last cell to render: colId "${lastColumn.colId}" rowId "${lastRow.id}"`);
      ref.observer.disconnect();
    }, timeout);

    ref.observer = new MutationObserver((list, observer) => {
      if (isCellRendered(lastColumn, lastRow, root)) {
        clearTimeout(timeoutId);
        observer.disconnect();
        // Wait one more tick to ensure the cell
        // content is rendered (not sure if there's
        // a better solution here).
        wait(() => onReady());
      }
    });

    ref.observer.observe(root, {subtree: true, childList: true});
    return () => ref.observer.disconnect();
  }
}

/**
 * Returns a function that can be called to wait for the
 * last visible cell in the spreadsheet to be rendered.
 * @param {number} [timeount] - A timeout to cancel the mutation
 *   observer so the UI doesn't hang.
 */
function useWaitForLastCellToRender(timeout) {
  const wait = useTimeout();
  const cancelRef = React.useRef();

  // Clean up the mutation observer on unmount.
  React.useEffect(() => {
    return () => {
      if (cancelRef.current) {
        cancelRef.current();
      }
    }
  }, []);

  return (onReady, root, agGridAPI) => {
    if (root) {
      cancelRef.current = waitForLastCellToRender(onReady, root, agGridAPI, wait, timeout);
    }
  }
}

/**
 * Copy and sort the spreadsheet input data.
 * If users can control the number of rows,
 * also add sortOrder properties to each row.
 */
export function prepareSpreadsheetData(rowData, userControlledRows) {
  let data = [];
  let sortOrderCount = 0;
  for (let i = 0; i < rowData.length; i++) {
    const d = rowData[i];
    data.push({...d});
    // Count the number of rows that have a `sortOrder` property.
    if (d.sortOrder) ++sortOrderCount;
  }

  // Sort the rows by sortOrder
  data = data.sort((a, b) =>
    a.sortOrder < b.sortOrder
      ? -1
      : a.sortOrder > b.sortOrder
      ? 1
      : 0
  );

  if (userControlledRows) {
    // If none of the rows have a sort index,
    // generate them in the most compact manner possible.
    // a, aa, aaa, b, bb, bbb, c, cc, ccc, etc.
    if (sortOrderCount === 0) {
      data = generateDataSortIndexes(data);
    }
    // Otherwise, add sortOrder properties to just the keys
    // that are missing them.
    else if (sortOrderCount !== data.length) {
      data = addDataSortIndexes(data);
    }
  }

  return data;
}


/**
 * `<Spreadsheet>` is a customized version of `AgGridReact`. You
 * should use it in place of `AgGridReact` in order to acheive
 * consistent styling and functionality across all tables.
 *
 * `Spreadsheet` works just like the standard `AgGridReact` component and
 * can receive `AgGridColumn` components as it's children. However,
 * it's preferred you use one of the `<*SpreadsheetColumn>` components
 * provided in this package instead. They extend `AgGridColumn` to
 * provide consistent styling/functionality and simplify column setup.
 * See the column component descriptions below for more details on the
 * available columns and their usage.
 *
 * ### Add/Remove Rows
 *
 * Pass the `userControlledRows` prop to allow users to add and remove
 * rows from the spreadsheet. In this state, the spreadsheet will always contain an
 * empty row at the bottom of the spreadsheet. As the user types data in the
 * last row, a new empty row is added below that. These new rows are
 * only emitted as data if they have at least one non-null property
 * (excluding the `sortOrder` key). Additionally, these new rows are
 * automatically given a `sortOrder` data property which is used to
 * identify the sort order of this row in the spreadsheet. The generated
 * `sortOrder` is generated in such a way that you do not need to
 * modify the `sortOrder` of other rows if the row order is changed.
 *
 * ### Totals
 *
 * `Spreadsheet` can automate creating a "Totals" row at the bottom of the
 * spreadsheet by passing the `totals` prop. This prop works in conjuncture
 * with the `footer` and `reduce` props available on our custom column
 * components.
 *
 * #### Column `footer` prop
 *
 * The column `footer` prop determines the children passed to
 * the "Total" cell of that column. It can take either JSX or a function
 * that returns JSX. Note that the custom column `children` prop will not be used for
 * the "Totals" cell; only the `footer` prop will work for that cell.
 *
 * #### Column `reduce` prop
 *
 * The column `reduce` prop allows you to reduce the values in the
 * column into the value displayed in the "Total" cell. If you do
 * not pass `reduce`, then the cell value will be undefined and
 * your `footer` prop will be used to determine what is displayed
 * in the "Total" cell. If you don't pass the `footer` or `reducer` props,
 * then the cell will be left empty.
 *
 * The `reduce` prop must be a function and will be called for
 * each cell in the column (except for the "Totals" cell). It follows
 * a similar API to `Array.reduce`:
 *
 * - `total`: The current accumulated value
 * - `value`: The current cell value
 * - `index`: The current cell index
 * - `row`: The AgGrid Row definition for the current cell.
 *
 * ### Testing Notes
 *
 * #### onContentReady
 *
 * When testing this component you will need to wait for the
 * cells to render before you can verify their contents. You
 * can do this by specifying the `onContentReady` callback prop.
 * This prop will call your callback with the AgGrid API object
 * after the first render of all spreadsheet cells.
 *
 * #### page-object
 *
 * There is also a `Spreadsheet.page-object` file that provides
 * BigTest interactors for validating the spreadsheet. See the
 * test API docs at the bottom of this page.
 *
 * #### Cell Editing
 *
 * If you need to change the values in a spreadsheet cell that uses
 * one of our formatted input components like `CurrencyInput`
 * or `NumberInput`, you'll have better results setting the
 * value using the `userEvent.type` method from `@testing-library/user-event`
 * than the `fireEvent.change` method from `@testing-library/react`.
 * You'll also need to specify a delay to simulate actual user
 * typing or you may find the component loses characters.
 *
 * ```js
 * import userEvent from '@testing-library/user-event';
 * ...
 * await userEvent.type(input, '15.00', {delay: 60});
 * ```
 *
 * ### Developer Notes
 *
 * Due to quirks with how AgGrid functions, the setup of the `Spreadsheet`
 * component may not be very straight forward so here is a high level
 * overview of it's structure.
 *
 * `Spreadsheet` is a component that returns an `AgGridReact` table element.
 * Unfortunately, `AgGridReact` converts all of it's children to `AgGridColumn`
 * components before it renders them so to enable passing our own custom
 * column components, the `Spreadsheet` component loops over it's children
 * and converts our custom column components into specialized `AgGridColumn`
 * components for you. This allows us to avoid repeating styles and logic
 * everywhere we use common column patterns.
 *
 * Our custom column components have no logic and are just used to
 * indicate a column configuration. Instead, you will find most of the
 * logic in the `components/spreadsheet/cells` package. The components in
 * that package are registered with `AgGrid` as custom cell renderers.
 *
 * @param {object} props
 * @param {*} [props.children]
 * @param {string} [props.className]
 * @param {object} [props.style]
 * @param {string} [props.domLayout]
 * @param {*} [props.rowData]
 * @param {boolean} [props.totals]
 * @param {boolean} [props.userControlledRows] - Allow the user to add/remove
 *  rows from the spreadsheet.
 * @param {function} [props.onContentReady]
 * @param {function} [props.onFirstDataRendered] - Similar to onGridReady but waits
 *   until the last cell (bottom right if ltr layout) is rendered.
 * @param {function} [props.onChange] - Change event for the spreadsheet data. This will
 *   give you the updated data whenever it changes.
 * @param {function} [props.onCellChange]
 * @param {function} [props.onRowChange]
 * @param {function} [props.onRemoveRow]
 * @param {function} [props.onCellChange]
 * @param {function} [props.onCellValueChanged] - Standard AgGrid cell value change
 *   listener. It is preferred you use the `onChange` prop unless you specifically
 *   need to do something specific with AgGrid.
 * @param {boolean} [props.disableAnimations]
 * @param {function} [props.ResizeObserver] - ResizeObserver polyfill
 *   (useful in tests).
 */
export function Spreadsheet({
  rowData = [],
  totals = false,
  className,
  'data-testid': testId = 'Spreadsheet',
  children,
  style,
  domLayout,
  userControlledRows,
  onChange,
  onRowChange,
  onCellChange,
  onCellValueChanged,
  onContentReady,
  contentReadyTimeout = 1000,
  onFirstDataRendered,
  onRemoveRow,
  disableAnimations,
  ResizeObserver,
  ...rest
}) {
  // Use a copy of the data so we don't accidentally
  // modify the original. This will also sort the data
  // and add sort indexes if necessary.
  const data = prepareSpreadsheetData(rowData, userControlledRows);

  const childrenCount = React.Children.count(children);
  // Track the number of rows in the grid.
  const rowCount = React.useRef(data.length);

  const ref = React.useRef();

  const waitForLastCellToRender = useWaitForLastCellToRender(contentReadyTimeout);
  const handleReady = params => {
    if (onFirstDataRendered) onFirstDataRendered(params);

    // Delay the `onContentReady` event until our custom cell renderers
    // have rendered. This is necessary because the onFirstDataRendered
    // event is emitted after the AgGrid cells have rendered but
    // before our custom cell renderers have rendered.
    if (onContentReady) waitForLastCellToRender(onContentReady, ref.current, params);
  };

  /**
   * Emit the onChange event with the current spreadsheet data.
   * @param {object} gridAPI - The AgGrid API object.
   */
  const emitFullSpreadsheetData = ({api}) => {
    if (onChange) {
      const out = [];
      api.forEachLeafNode(n => out.push(n.data));
      // Trim the last row if it is empty. Other empty rows
      // should stay in the data until the user specifically
      // removes them.
      if (userControlledRows && isRowEmpty(out[out.length - 1])) {
        out.splice(out.length - 1);
      }
      onChange(out);
    }
  }

  /**
   * Emit the onCellValueChanged and onChange events when
   * cell values are edited.
   * @param {object} gridAPI - The full AgGrid API with
   *   api, column, etc properties.
   */
  const handleCellValueChanged = gridAPI => {
    const {data, rowIndex, colDef, newValue, node} = gridAPI;
    const last = rowCount.current - 1;
    const index = gridAPI.node.rowIndex;

    if (onCellValueChanged) onCellValueChanged(gridAPI);

    if (onCellChange) {
      onCellChange(rowIndex, colDef.field, newValue);
    }

    if (onRowChange) {
      onRowChange(index, data, node.id)
    }

    emitFullSpreadsheetData(gridAPI);

    // If we edited the last row (which will be an empty row),
    // add a new empty row underneath.
    if (index === last) {
      ++rowCount.current;
      if (userControlledRows) {
        gridAPI.api.applyTransaction({
          add: [{
            // Create a sort index for the new item using the
            // current item's sort index as the basis.
            sortOrder: createSortIndex(data.sortOrder),
          }]
        });
      }
    }
  }

  /**
   * Handle clicks on the remove row buttons.
   * @param {object} node - The row node object.
   * @param {object} gridAPI - The full AgGrid API with
   *   api, column, etc properties.
   */
  const handleRemoveRow = (node, gridAPI) => {
    const index = node.rowIndex;
    const last = rowCount.current - 1;
    const data = node.data;

    gridAPI.api.applyTransaction({
      remove: [data]
    });

    // If we removed the last row, add a new one.
    // This makes the user's action seem like it did
    // something but they can still add new rows.
    if (index === last) {
      gridAPI.api.applyTransaction({ add: [{}] });
    }
    // Otherwise, emit the change event and don't add
    // any new rows.
    else {
      --rowCount.current;
      emitFullSpreadsheetData(gridAPI);
    }

    // onRemoveRow can only be emitted if `userControlledRows`
    // is true. In that case, the last row will always be an empty row.
    if (onRemoveRow && index !== last) {
      onRemoveRow(index, data, node.id);
    }
  };

  // Properties common to all cells, including the row remove button cells.
  const commonCellProps = {
    tableName: rest['aria-label'],
    ResizeObserver,
    tableApi: {
      addEventListener: (...args) => ref.current?.addEventListener.apply(this, args),
      removeEventListener: (...args) => ref.current?.addEventListener.apply(this, args),
    }
  };

  // Loop through the children and convert them from our custom
  // column definitions, into AgGridColumn components.
  // This is a workaround for the fact that AgGrid will not
  // allow you to pass custom column components. For each
  // new Column component we add, it will need to be registered
  // here.
  children = React.Children.map(children, (child, i) => {
    const {minWidth: minWidthProp, valueGetter, headerTooltip, ...childProps} = child.props;

    const last = i === childrenCount - 1;
    const flex = last ? 1 : undefined;
    const commonClasses = [
      i === 0 ? 'first' : null,
      last && !userControlledRows ? 'last' : null,
    ];

    // Every cell except the last one should be at least 200px or whatever was passed.
    // The last cell will be "flex" to fill the remaining space.
    // TODO Only do the flex thing if we need to horizontal scroll?
    const minWidth = isNumber(minWidthProp) ? minWidthProp : last ? 150 : undefined;

    const commonColumnProps = {
      flex,
      minWidth,
      disableAnimations,
      valueGetter: !valueGetter ? undefined : (gridApi) => {
        // The totals footer should not use the valueGetter because it
        // uses the reduce prop instead to aggregate the values.
        if (gridApi.node.rowPinned) return gridApi.data[gridApi.colDef.field];
        // Other cells should use the valueGetter prop.
        return valueGetter(gridApi);
      },
      headerComponent: "HeaderCell",
      headerComponentParams: {
        headerTooltip,
        ...commonCellProps,
      },
      headerClass: commonClasses,
      pinnedRowCellRenderer: "FooterCell",
    };

    // Set the default column props based on the Column
    // component passed. This allows passing our own reusable
    // column definitions to the spreadsheet.
    // NOTE:
    // For each new Column component we add, it will need to
    // be registered here.
    switch(child.type) {

      case SpreadsheetColumn: {
        const {children, ...remainingProps} = childProps;
        const cellProps = {...remainingProps, ...commonCellProps, children};

        return (
          <AgGridColumn
            data-type="SpreadsheetColumn"
            cellClass={combineClasses(
              'SpreadsheetColumnCell',
              ...commonClasses
            )}
            cellRenderer="Cell"
            cellRendererParams={cellProps}
            pinnedRowCellRendererParams={cellProps}
            {...commonColumnProps}
            {...remainingProps}
          />
        );
      }

      case TimeSpreadsheetColumn: {
        const remainingProps = childProps;
        const cellProps = {...remainingProps, ...commonCellProps};
        return (
          <AgGridColumn
            data-type="TimeSpreadsheetColumn"
            cellClass={combineClasses(
              'TimeSpreadsheetColumnCell',
              ...commonClasses
            )}
            cellRenderer="TimeInputCell"
            cellRendererParams={cellProps}
            pinnedRowCellRendererParams={cellProps}
            {...commonColumnProps}
            {...remainingProps}
          />
        );
      }

      case SelectableSpreadsheetColumn: {
        const remainingProps = childProps;
        const cellProps = {...remainingProps, ...commonCellProps};
        return (
          <AgGridColumn
            data-type="SelectableSpreadsheetColumn"
            cellClass={combineClasses(
              'SelectableSpreadsheetColumnCell',
              ...commonClasses
            )}
            cellRenderer="SelectableCell"
            cellRendererParams={cellProps}
            pinnedRowCellRendererParams={cellProps}
            {...commonColumnProps}
            {...remainingProps}
          />
        );
      }

      case EditableSpreadsheetColumn: {
        const {children, ...remainingProps} = childProps;
        const cellProps = {...remainingProps, ...commonCellProps, children};
        return (
          <AgGridColumn
            data-type="EditableSpreadsheetColumn"
            cellClass={combineClasses(
              'EditableSpreadsheetColumnCell',
              ...commonClasses
            )}
            cellRenderer="EditableCell"
            cellRendererParams={cellProps}
            pinnedRowCellRendererParams={cellProps}
            {...commonColumnProps}
            {...remainingProps}
          />
        );
      }

      default:
        return child;
    }
  });

  if (userControlledRows) {
    // Add an empty row at the bottom of the data set.
    if (
      data.length === 0 ||
      (data.length > 0 && !isRowEmpty(data[data.length - 1]))
    ) {
      const previousSortIndex = data[data.length - 1]?.sortOrder;
      data.push({
        sortOrder: createSortIndex(previousSortIndex),
      });
      rowCount.current = data.length;
    }

    // Add a right pinned column where we can place
    // the row delete buttons.
    children.push(
      <AgGridColumn
        data-type="RemoveColumn"
        field="remove-row"
        key="remove-row-column"
        pinned="right"
        lockPinned
        maxWidth={styles.removeColumnWidth}

        headerComponent="HeaderCell"
        headerComponentParams={{
          visible: false,
          centered: true,
          ...commonCellProps,
        }}
        headerClass="RemoveColumn last"
        headerName="Remove Row"

        cellRenderer="RemoveCell"
        cellRendererParams={{
          ...commonCellProps,
          onRemove: handleRemoveRow,
        }}
        cellClass="last"

        pinnedRowCellRenderer="FooterCell"
      />
    );
  }

  return (
    <div
      data-spreadsheet-root
      data-testid={testId}
      ref={ref}
      style={style}
      className={combineClasses(
        styles.Spreadsheet,
        className,
        'ag-theme-stagency',
        totals ? styles.totals : null,
        userControlledRows ? styles.userControlledRows : null,
        domLayout === 'normal' || domLayout == null ? styles.fill : null,
      )}
    >
      <AgGridReact
        // @ts-ignore-line
        className={combineClasses(
          styles.AgGridReact,
        )}
        domLayout={domLayout}
        pinnedBottomRowData={totals ? [{}] : undefined}
        rowHeight={styles.cellHeight}
        headerHeight={styles.cellHeight}
        gridOptions={{
          // Suppress warning statements when passing custom
          // props to AgGridReact.
          suppressPropertyNamesCheck: true,
        }}
        rowData={data}
        onFirstDataRendered={handleReady}
        onCellValueChanged={handleCellValueChanged}
        frameworkComponents={{
          'HeaderCell': HeaderCell,
          'FooterCell': FooterCell,
          'RemoveCell': RemoveCell,
          'Cell': Cell,
          'EditableCell': EditableCell,
          'SelectableCell': SelectableCell,
          'TimeInputCell': TimeInputCell,
        }}
        {...rest}
        children={children}
      />
    </div>
  );
}

Spreadsheet.propTypes = {
  /**
   * The data to assign to the spreadsheet. It should
   * be a list of objects with keys matching the
   * column children.
   */
  rowData: PropTypes.arrayOf(PropTypes.object),
  /**
   * Whether or not to show a "Totals" row at the bottom of the spreadsheet.
   */
  totals: PropTypes.bool,
  /**
   * Whether the spreadsheet grows to fit the data or
   * scrolls to view the data. Using the autoHeight
   * or print layouts is important for testing.
   */
  domLayout: PropTypes.oneOf(['autoHeight', 'print', 'normal']),
  /**
   * Whether uses are allowed to add/remove rows.
   */
  userControlledRows: PropTypes.bool,
  /**
   * Will be called whenever the data is changed with
   * the full spreadsheet data. On large tables this change
   * listener may be slow since it has to extract the full
   * spreadsheet data. In those situations, you should use
   * one of the other change listeners or pass a
   * debounce delay.
   *
   * @param {object[]} data
   */
  onChange: PropTypes.func,
  /**
   * This callback is called whenever the data for a
   * row is changed by the user. It will be called
   * with the new row data and the index of that row
   * in the spreadsheet data.
   * @param {number} index
   * @param {object} data
   * @param {string} id - A unique id for the row that
   *   you can use to identify rows even if their order
   *   has been shuffled.
   */
  onRowChange: PropTypes.func,
  /**
   * This callback is called whenever the data for a
   * cell is changed by the user. It is called with
   * the cell row and field as well as the new and old
   * values of the cell.
   * @param {number} rowIndex
   * @param {string} field - The field in the data this
   *   cell is associated with.
   * @param {*} newValue
   */
  onCellChange: PropTypes.func,
  /**
   * In addition to the `onCellChange` function, you can
   * pass the standard AgGrid `onCellValueChanged` prop
   * but `onCellChange` is preferred.
   */
  onCellValueChanged: PropTypes.func,
  /**
   * Will be called whenever a row is removed from the spreadsheet
   * by the user.
   * @param {number} index - The index of the row removed. Be
   *   aware that this is the index of the data before removal.
   *   You will not be able to look up this row in the data from
   *   the last `onChange` event since that data nolonger includes
   *   the removed row.
   * @param {*} data - The data associated with the removed row.
   * @param {string} id - A unique id of the row being removed.
   *   This will be the same id provided on any previous updates.
   */
  onRemoveRow: PropTypes.func,
  /**
   * Will be called on first render. This is useful
   * for testing to ensuer the data is rendered before
   * validating it's content.
   */
  onContentReady: PropTypes.func,
  /**
   * Turn of animations within the spreadsheet.
   */
  disableAnimations: PropTypes.bool,
  /**
   * Allows you to provide a ResizeObserver polyfil.
   * This is necessary during testing.
   */
  ResizeObserver: PropTypes.func,
  /**
   * Any props of `AgGridReact` will be passed along.
   */
  'ag-grid props...': PropTypes.any,
};

