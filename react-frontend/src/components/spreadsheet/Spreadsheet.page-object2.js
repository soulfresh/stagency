import {
  elementContent,
  HTMLPageObject,
} from '~/test';

/**
 * Get the column index associated with a cell element.
 * @param {HTMLElement} cell
 * @return {number}
 */
export const cellColumnIndex = cell => Number(cell.getAttribute('aria-colIndex'));
/**
 * Get the row index associated with a cell element.
 * @param {HTMLElement} cell
 * @return {number}
 */
export const cellRowIndex = cell => Number(cell.closest('[role=row]').getAttribute('aria-rowindex'));

/**
 * Get the text content from another cell
 * in the same row as the element passed.
 * This is useful for finding the value
 * of the element in the first column of
 * of a cell row which should be used to define
 * the aria-label of a cell.
 *
 * @param {HTMLElement} el - The element relative in whos row you want
 *   to find another cell.
 * @param {number} [index] - The column index of the cell you want to access.
 * @param {string[]} [valueConstraint] - A list of content types you
 *   want to use in determining what constitues the "value" of the cell.
 *   See the `elementContent` function.
 * @return {string}
 */
export const columnValue = (el, index = 1, valueConstraint) => elementContent(
  el.closest('[role=row]').querySelector(`[aria-colindex="${index}"]`),
  valueConstraint
);

/**
 * Get the text content from the header cell
 * above the cell element passed. This is useful
 * for generating the aria-label of a cell.
 *
 * @param {HTMLElement} cell
 * @return {string}
 */
export const columnName = (cell) => {
  const index = cellColumnIndex(cell);
  return elementContent(
    cell.closest('[role=grid]')
      .querySelector(`[role=columnheader][aria-colindex="${index}"]`),
    ['text']
  );
};

/**
 * Return a flat list of cells by their column.
 * If your root element includes multiple rows
 * of data, you'll need to use `gridCells` instead
 * so cells are organized by row and column.
 *
 * @param {HTMLElement} el
 * @param {string} [selector] - The selector to use
 *   to determine a "cell"
 * @return {HTMLElement[]}
 */
export const flatCells = (el, selector = '[role=gridcell]') => {
  const offset = 1;
  return Array.from(el.querySelectorAll(selector))
    .reduce((acc, cell) => {
      const column = cellColumnIndex(cell) - offset;
      acc[column] = cell;
      return acc;

    }, []);
}

/**
 * Get a multi-dimensional array of cells by
 * row and column. You can pass an offset value
 * to determine at which row you want to start
 * collecting cells. This is useful in combination
 * with the selector for getting 'columnheader' cells
 * and then combining those with 'gridcell' cells.
 *
 * @param {HTMLElement} el
 * @param {number} [rowOffset] - The offset to
 *   use as the starting index into the grid
 *   that you want to start collecting cells.
 * @param {string} [selector] - The selector string
 *   to use to determine a "cell".
 * @return {HTMLElement[][]}
 */
export const gridCells = (el, rowOffset = 1, selector = '[role=gridcell]') => {
  const offset = 1;
  return Array.from(el.querySelectorAll(selector))
    .reduce((acc, cell) => {
      const column = cellColumnIndex(cell) - offset;
      const row = cellRowIndex(cell) - rowOffset;

      if (!acc[row]) acc[row] = [];
      acc[row][column] = cell;

      return acc;
    }, []);
}

function getSpreadsheetHeaders(table) {
  return gridCells(table, 1, '[role=columnheader]')
    .map(row => row.map(cell => elementContent(cell, ['text'])));
}

/**
 * Interact with a table element.
 *
 * __Selector__: `[role=grid]`
 *
 * __Locator__: `[data-spreadsheet-root]` `aria-label` value
 *
 * __Extends__: {@link HTMLPageObject}
 *
 * __Filters__:
 *
 * - `string[][]` __cellValues__  The string value of all cells in the table.
 * - `string[]` __headers__ The column names.
 * - `number` __rowCount__ The number of DATA rows. This does not include the
 *   header row!
 *
 * __Actions__:
 *
 * - __debugState__ Print the current spreadsheet data as a table.
 */
export const SpreadsheetPageObject = HTMLPageObject.extend('table')
  .selector('[role=grid]')
  .locator(element =>
    element.closest('data-spreadsheet-root')
      .getAttribute('aria-label')
  )
  .filters({
    cellValues: table => {
      // aria attributes are 1 indexed (rather than 0 indexed)
      let rowOffset = 1;

      const headers = getSpreadsheetHeaders(table);

      // update the row offset to account for the number of header rows.
      rowOffset += headers.length;

      const cells = gridCells(table, rowOffset)
        .map(row => row.map(cell => elementContent(cell)));

      return headers.concat(cells);
    },
    headers: table => {
      const out = getSpreadsheetHeaders(table);
      return out.length ? out[0] : [];
    },
    rowCount: table => {
      // Confining this query to the `.ag-center-cols-container` so we don't
      // pick up the left/right frozen columns which will inflate the row count.
      return table.querySelectorAll('.ag-center-cols-container [role=row]').length;
    },
    // TODO when needed.
    // rowValues: () => {},
    // columnValues: () => {},
  })
  .actions({
    debugState: async interactor => {
      const values = await interactor.cellValues();
      const headers = values.splice(0, 1)[0];
      const out = values.map(row => {
        return headers.reduce((acc, col, i) => {
          acc[col] = row[i]
          return acc
        }, {});
      });
      console.table(out)
    }
  });

/**
 * Interact with a row in a Spreadsheet.
 *
 * __Selector__: `[role=row]`
 *
 * __Locator__: Text content of the left most column.
 *
 * __Extends__: {@link HTMLPageObject}
 *
 * __Filters__:
 *
 * - `string[]` __cellValues__ The value of all cells in the row.
 */
export const SpreadsheetRowPageObject = HTMLPageObject.extend('table row')
  .selector('[role=row]')
  .locator(el => elementContent(
    el.querySelector('[role=gridcell][aria-colindex="1"]')
  ))
  .filters({
    cellValues: row => {
      return flatCells(row).map(cell => elementContent(cell));
    },
    rowIndex: row => {
      const out = Number(row.getAttribute('aria-rowindex'))
      return isNaN(out) ? '' : out;
    },
  })


/**
 * Interact with table cells. If you have issues
 * with a table cell returning the wrong data, try
 * one of the more specialized table cell page objects
 * like `TextCell` or `EditableCell`.
 *
 * __Selector__: `[role=gridcell]`
 *
 * __Locator__: Text content of the cell
 *
 * __Extends__: {@link HTMLPageObject}
 *
 * __Filters__:
 *
 * - `rowIndex` {number}
 * - `columnIndex` {number}
 * - `rowName` {string} The text content of the cell in the first column of the cell row.
 * - `columnName` {string} The text content of the header above the current cell.
 * - `value` Any type of content in this cell.
 *     See {@link elementContent} for more info.
 *
 * __Actions__:
 *
 * - `fillIn` Type text into the first input element in the cell
 *   - `string` __text__
 */
export const SpreadsheetCellPageObject = HTMLPageObject.extend('table cell')
  .selector('[role=gridcell]')
  .filters({
    rowIndex: el => cellRowIndex(el),
    columnIndex: el => cellColumnIndex(el),
    rowName: el => columnValue(el),
    columnName,
    value: el => elementContent(el),
  });

