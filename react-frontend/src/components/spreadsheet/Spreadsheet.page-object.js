import {
  waitFor,
  buildQueries,
  queryHelpers,
  getAllByRole,
  queryAllByRole,
  queryAllByTestId,
} from '@testing-library/react';

import {
  getSelectMenuByTrigger,
  getSelectMenuOptionByTrigger,
} from '../inputs/select/Select.page-object';
import { getValueFromFirstLeafNode } from '~/utils';
import { waitForTrue } from '~/test';

export function getCellRenderer(cell) {
  const customRenderer = cell.querySelectorAll('.ag-react-container');

  if (customRenderer.length < 1) {
    throw queryHelpers.getElementError(
      'Could not find any custom cell renderers inside the give AgGrid cell',
      cell
    );
  }

  if (customRenderer.length > 1) {
    throw queryHelpers.getElementError(
      'Found multiple custom cell renderers inside the give AgGrid cell',
      cell
    );
  }

  return customRenderer[0];
}

/**
 * Get the leaf node value from a custom cell renderer.
 * @param {HTMLElement} cell
 * @return {string}
 */
export function getValueFromCellRendererLeafNode(cell) {
  const customRenderer = getCellRenderer(cell);
  return getValueFromFirstLeafNode(customRenderer);
}

/**
 * Get the table contents for all tables on the page.
 * This specifically returns the center column viewport
 * from the table so you only receive the cells that
 * contain table content. This does not include any pinned
 * rows/columns.
 *
 * If you need to select the wrapper around the table,
 * you can just assign a test-id to the table component
 * you are testing.
 *
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement[]}
 */
export function getAllTableContents(container = document.body) {
  // Unfortunately we have to query by the class name because
  // there are no other unique identifiers in the DOM.
  const tables = document.querySelectorAll('.ag-center-cols-viewport');
  if (tables.length === 0) {
    throw queryHelpers.getElementError(
      'Could not find any AgGrid table content containers',
      container
    );
  }
  return Array.from(tables);
}

/**
 * Get the table headers for all tables on the page.
 * If you need to select the wrapper around the table,
 * you can just assign a test-id to the table component
 * you are testing.
 *
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement[]}
 */
export function getAllTableHeaders(container = document.body) {
  // Unfortunately we have to query by the class name because
  // there are no other unique identifiers in the DOM.
  const tables = document.querySelectorAll('.ag-header');
  if (tables.length === 0) {
    throw queryHelpers.getElementError(
      'Could not find any AgGrid table content containers',
      container
    );
  }
  return Array.from(tables);
}

/**
 * Get the table footers for all tables on the page.
 * If you need to select the wrapper around the table,
 * you can just assign a test-id to the table component
 * you are testing.
 *
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement[]}
 */
export function getAllTableFooters(container = document.body) {
  // Unfortunately we have to query by the class name because
  // there are no other unique identifiers in the DOM.
  const tables = document.querySelectorAll('.ag-floating-bottom-viewport');
  if (tables.length === 0) {
    throw queryHelpers.getElementError(
      'Could not find any AgGrid table content containers',
      container
    );
  }
  return Array.from(tables);
}

/**
 * Get the content (ie. center column viewport) for a
 * single table. Just like `getAllTableContents`, this
 * does not contain any pinned rows/columns.
 *
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement}
 */
export function getTableContent(container) {
  const tables = getAllTableContents(container);

  if (tables.length > 1) {
    throw queryHelpers.getElementError(
      `Found ${tables.length} AgGrid table content containers`,
      container
    );
  }

  return tables[0];
}

/**
 * Get the header row for a single table.
 *
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement}
 */
export function getTableHeader(container) {
  const tables = getAllTableHeaders(container);

  if (tables.length > 1) {
    throw queryHelpers.getElementError(
      `Found ${tables.length} AgGrid table content containers`,
      container
    );
  }

  return tables[0];
}

/**
 * Get the footer row for a single table.
 *
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement}
 */
export function getTableFooter(container) {
  const tables = getAllTableFooters(container);

  if (tables.length > 1) {
    throw queryHelpers.getElementError(
      `Found ${tables.length} AgGrid table content containers`,
      container
    );
  }

  return tables[0];
}

/**
 * Get all rows from a single table content viewport.
 * This will throw an error if more than one table is
 * found in the specified container.
 *
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement[]}
 */
export function getAllRowsFromTable(container) {
  const table = getTableContent(container);
  return getAllByRole(table, 'row');
}

/**
 * The query version of getAllRowsFromTable.
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement[]}
 */
export function queryAllRowsFromTable(container) {
  const table = getTableContent(container);
  return queryAllByRole(table, 'row');
}

/**
 * Get all rows from a single table header viewport.
 * This will throw an error if more than one table is
 * found in the specified container.
 *
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement[]}
 */
export function getAllRowsFromTableHeader(container) {
  const table = getTableHeader(container);
  return getAllByRole(table, 'row');
}

/**
 * Get all rows from a single table footer viewport.
 * This will throw an error if more than one table is
 * found in the specified container.
 *
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement[]}
 */
export function getAllRowsFromTableFooter(container) {
  const table = getTableFooter(container);
  return getAllByRole(table, 'row');
}

/**
 * The query version of getAllRowsFromTableFooter.
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement[]}
 */
export function queryAllRowsFromTableFooter(container) {
  const table = getTableFooter(container);
  return queryAllByRole(table, 'row');
}

/**
 * Get a single row from a single table content viewport.
 * This will throw an error if more than one table or
 * more than one row is found in the specified container.
 *
 * @param {number} [rowIndex]
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement}
 */
export function getRowFromTable(rowIndex = 0, container) {
  const rows = getAllRowsFromTable(container);

  if (rowIndex > rows.length - 1) {
    throw queryHelpers.getElementError(
      `Could not find table row index ${rowIndex} because there are only ${rows.length} rows`,
      container
    );
  }

  return rows[rowIndex];
}

/**
 * Get a single row from a single table header viewport.
 * This will throw an error if more than one table or
 * more than one row is found in the specified container.
 *
 * @param {number} [rowIndex]
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement}
 */
export function getRowFromTableHeader(rowIndex = 0, container) {
  const rows = getAllRowsFromTableHeader(container);

  if (rowIndex > rows.length - 1) {
    throw queryHelpers.getElementError(
      `Could not find table header row index ${rowIndex} because there are only ${rows.length} rows`,
      container
    );
  }

  return rows[rowIndex];
}

/**
 * Get a single row from a single table footer viewport.
 *
 * @param {number} [rowIndex]
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement}
 */
export function getRowFromTableFooter(rowIndex = 0, container) {
  const rows = getAllRowsFromTableFooter(container);

  if (rowIndex > rows.length - 1) {
    throw queryHelpers.getElementError(
      `Could not find table footer row index ${rowIndex} because there are only ${rows.length} rows`,
      container
    );
  }

  return rows[rowIndex];
}

/**
 * Get every cell element in a table.
 * @param {HTMLElement} [container]
 * @return {HTMLElement[]}
 */
export function getAllCellsFromTable(container) {
  const table = getTableContent(container);
  return getAllByRole(table, 'gridcell');
}

/**
 * The query version of getAllCellsFromTable
 * @param {HTMLElement} [container]
 * @return {HTMLElement[]}
 */
export function queryAllCellsFromTable(container) {
  const table = getTableContent(container);
  return queryAllByRole(table, 'gridcell');
}

/**
 * Get every cell element in a table header.
 * @param {HTMLElement} [container]
 * @return {HTMLElement[]}
 */
export function getAllCellsFromTableHeader(container) {
  const table = getTableHeader(container);
  return getAllByRole(table, 'columnheader');
}

/**
 * Get every cell element in a table footer.
 * @param {HTMLElement} [container]
 * @return {HTMLElement[]}
 */
export function getAllCellsFromTableFooter(container) {
  const table = getTableFooter(container);
  return getAllByRole(table, 'gridcell');
}

/**
 * Get every cell element in a table column.
 * @param {string} column - The id of the column you want to select.
 *   This is usually the name of the property in the data associated with the column.
 * @param {HTMLElement} [container]
 * @return {HTMLElement[]}
 */
export function getAllCellsFromSpreadsheetColumn(column, container) {
  const headerCells = getAllCellsFromTableHeader(container);
  const contentCells = getAllCellsFromTable(container);

  const allCells = headerCells.concat(contentCells);
  if (getTableFooterRowCount(container) > 0) {
    allCells.concat(getAllCellsFromTableFooter(container));
  }

  const columnCells = allCells
    .filter(cell => cell.getAttribute('col-id') === column);
    // contentCells.filter(cell => cell.getAttribute('col-id') === column);

  if (columnCells.length === 0) {
    throw queryHelpers.getElementError(
      `Could not find any cells in the column ${column}. Check that ${column} is the value of the "col-id" attribute for the column cells you are trying to select.`,
      container
    );
  }

  return columnCells;
}

/**
 * Get the text value of the cells in a table column.
 * @param {string} column - The id of the column you want to select.
 *   This is usually the name of the property in the data associated with the column.
 * @param {HTMLElement} [container]
 * @return {string[]}
 */
export function getAllCellValuesFromSpreadsheetColumn(column, container) {
  return getAllCellsFromSpreadsheetColumn(column, container)
    .map(getValueFromCellRendererLeafNode);
}

/**
 * Get all cells from a single row of a single table content viewport.
 * This will throw an error if more than one table or
 * more than one row is found in the specified container.
 *
 * @param {number} [rowIndex]
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement[]}
 */
export function getAllCellsFromTableRow(rowIndex, container) {
  const row = getRowFromTable(rowIndex, container);
  return getAllByRole(row, 'gridcell');
}

/**
 * The query version of getAllCellsFromTableRow
 * @param {HTMLElement} [container]
 * @return {HTMLElement[]}
 */
export function queryAllCellsFromTableRow(rowIndex, container) {
  const row = getRowFromTable(rowIndex, container);
  return queryAllByRole(row, 'gridcell');
}

/**
 * Get all cells from a table header row.
 * This is the same as `getAllCellsFromTableHeader` since
 * headers only have one row but it is here for
 * API consistency.
 *
 * @param {number} [rowIndex]
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement[]}
 */
export function getAllCellsFromTableHeaderRow(rowIndex, container) {
  return getAllCellsFromTableHeader(container);
}

/**
 * Get all cells from a single row of a single table footer viewport.
 *
 * @param {number} [rowIndex]
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement[]}
 */
export function getAllCellsFromTableFooterRow(rowIndex, container) {
  const row = getRowFromTableFooter(rowIndex, container);
  return getAllByRole(row, 'gridcell');
}

/**
 * Get a single cell from a single row of a single table content viewport.
 * This will throw an error if more than one table, row or
 * cell is found in the specified container.
 *
 * @param {string} columnId - The property name in the data
 *   associated with the column you want.
 * @param {number} [rowIndex]
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement}
 */
export function getCellFromTable(column, rowIndex, container) {
  const rowCells = getAllCellsFromTableRow(rowIndex, container);
  const matches = rowCells.filter(c => c.getAttribute('col-id') === column);

  if (matches.length === 0) {
    throw queryHelpers.getElementError(
      `Could not find any cells matching col-id ${column}`,
      container
    );
  }

  if (matches.length > 1) {
    throw queryHelpers.getElementError(
      `Found ${matches.length} cells with col-id ${column}`,
      container
    );
  }

  return matches[0];
}

/**
 * Get a specific cell from the header row of the table.
 * @param {string} columnId - The property name in the data
 *   associated with the column you want.
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement}
 */
export function getCellFromTableHeader(columnId, container) {
  const matches = getAllCellsFromTableHeader(container)
    .filter(c => c.getAttribute('col-id') === columnId);

  if (matches.length === 0) {
    throw queryHelpers.getElementError(
      `Could not find any header cells matching col-id ${columnId}`,
      container
    );
  }

  if (matches.length > 1) {
    throw queryHelpers.getElementError(
      `Found ${matches.length} header cells with col-id ${columnId}`,
      container
    );
  }

  return matches[0];
}

/**
 * Get a specific cell from the footer row of the table.
 * @param {string} columnId - The property name in the data
 *   associated with the column you want.
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement}
 */
export function getCellFromTableFooter(columnId, container) {
  const matches = getAllCellsFromTableFooter(container)
    .filter(c => c.getAttribute('col-id') === columnId);

  if (matches.length === 0) {
    throw queryHelpers.getElementError(
      `Could not find any footer cells matching col-id ${columnId}`,
      container
    );
  }

  if (matches.length > 1) {
    throw queryHelpers.getElementError(
      `Found ${matches.length} footer cells with col-id ${columnId}`,
      container
    );
  }

  return matches[0];
}

/**
 * Get a specific cell value from one of the data rows in a table. This allows you
 * to specify the row index as relative to it's associated data row index
 * which should make your tests more clear as to their intent.
 * @param {string} columnId - The property name in the data
 *   associated with the column you want.
 * @param {number} [rowIndex]
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {HTMLElement}
 */
export function getCellFromTableData(column, rowIndex = 0, container) {
  return getCellFromTable(column, rowIndex, container);
}

/**
 * Get the text value of a single cell in a table.
 * @param {string} columnId - The property name in the data
 *   associated with the column you want.
 * @param {number} [rowIndex]
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {string}
 */
export function getCellValueFromTable(column, rowIndex, container) {
  const cell = getCellFromTable(column, rowIndex, container);
  return getValueFromCellRendererLeafNode(cell);
}

/**
 * Get the text value of a single cell in the table header row.
 * @param {string} columnId - The property name in the data
 *   associated with the column you want.
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {string}
 */
export function getCellValueFromTableHeader(columnId, container) {
  const cell = getCellFromTableHeader(columnId, container);
  return getValueFromCellRendererLeafNode(cell);
}

/**
 * Get the text value of a single cell in one of the table data rows.
 * This allows you to specify the row index as relative to it's associated data row index
 * which should make your tests more clear as to their intent.
 * @param {string} columnId - The property name in the data
 *   associated with the column you want.
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {string}
 */
export function getCellValueFromTableData(column, rowIndex, container) {
  const cell = getCellFromTable(column, rowIndex + 1, container);
  return getValueFromCellRendererLeafNode(cell);
}

/**
 * Get the text value of a single cell in the table footer row.
 * @param {string} columnId - The property name in the data
 *   associated with the column you want.
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {string}
 */
export function getCellValueFromTableFooter(column, container) {
  const cell = getCellFromTableFooter(
    column,
    getTableFooterRowCount(container) - 1,
    container
  );
  return getValueFromCellRendererLeafNode(cell);
}

/**
 * Get all of the text values for the cells in a table row.
 * @param {string} columnId - The property name in the data
 *   associated with the column you want.
 * @param {number} [rowIndex]
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {string[]}
 */
export function getAllCellValuesFromTableRow(rowIndex, container) {
  return getAllCellsFromTableRow(rowIndex, container)
    .map(getValueFromCellRendererLeafNode);
}

/**
 * Get all of the text values for the cells in a table header.
 * @param {string} columnId - The property name in the data
 *   associated with the column you want.
 * @param {number} [rowIndex]
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {string[]}
 */
export function getAllCellValuesFromTableHeaderRow(rowIndex, container) {
  return getAllCellsFromTableHeaderRow(rowIndex, container)
    .map(getValueFromCellRendererLeafNode);
}

/**
 * Get all of the text values for the cells in a table footer row.
 * @param {string} columnId - The property name in the data
 *   associated with the column you want.
 * @param {number} [rowIndex]
 * @param {HTMLElement} [container] - A specific container
 *   within which to constrain selection.
 * @return {string[]}
 */
export function getAllCellValuesFromTableFooterRow(rowIndex, container) {
  return getAllCellsFromTableFooterRow(rowIndex, container)
    .map(getValueFromCellRendererLeafNode);
}

/**
 * Get all cell values from one of the data rows in a table. This allows you
 * to specify the row index as relative to it's associated data row index
 * which should make your tests more clear as to their intent.
 * @param {number} [dataRowIndex]
 * @param {HTMLElement} [container]
 * @return {string[]}
 */
// TODO Remove this in favor of the previous
export function getAllCellValuesFromTableDataRow(dataRowIndex = 0, container) {
  // Add the header row to the data row index.
  return getAllCellValuesFromTableRow(dataRowIndex, container);
}

/**
 * Get all cell values from the table data.
 * @param {HTMLElement} [container]
 * @return {string[][]}
 */
export function getAllCellValuesFromTableData(container) {
  const count = getTableRowCount(container);
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(getAllCellValuesFromTableDataRow(i, container));
  }
  return out;
}

/**
 * Get all cell values from the header row of a table.
 * @param {HTMLElement} [container]
 * @return {string[]}
 */
export function getAllCellValuesFromTableHeader(container) {
  return getAllCellValuesFromTableHeaderRow(0, container);
}

/**
 * Get all cell values from the footer row of a table.
 * @param {HTMLElement} [container]
 * @return {string[]}
 */
export function getAllCellValuesFromTableFooter(rowIndex = 0, container) {
  return getAllCellValuesFromTableFooterRow(rowIndex, container);
}

/**
 * Count the number of rows in a table.
 * @param {HTMLElement} [container]
 * @return {number}
 */
export function getTableRowCount(container) {
  return queryAllRowsFromTable(container)?.length || 0;
}

/**
 * Count the number of rows in a table footer.
 * @param {HTMLElement} [container]
 * @return {number}
 */
export function getTableFooterRowCount(container) {
  return queryAllRowsFromTableFooter(container)?.length || 0;
}

/**
 * Count the number of cells in a table.
 * @param {HTMLElement} [container]
 * @return {number}
 */
export function getTableCellCount(container) {
  return queryAllCellsFromTable()?.length || 0;
}

/**
 * Count the number of columns in a table.
 * @param {HTMLElement} [container]
 * @return {number}
 */
export function getSpreadsheetColumnCount(container) {
  return queryAllCellsFromTableRow(0, container).length;
}


/**
 * @name getEditableCell
 * @function
 * @description Get the input element from an Editable cell.
 * @param {HTMLElement} container
 * @param {string} column - The name of the column field
 * @param {number} rowIndex
 * @param {object} [options]
 * @return {HTMLElement}
 */
/**
 * @name queryEditableCell
 * @function
 * @description Query the input element from an Editable cell
 *   without throwing an error.
 * @param {HTMLElement} container
 * @param {string} column - The name of the column field
 * @param {number} rowIndex
 * @param {object} [options]
 * @return {HTMLElement}
 */
/**
 * @name findEditableCell
 * @function
 * @description Wait for the input element from an Editable cell
 *   to appear in the DOM.
 * @param {HTMLElement} container
 * @param {string} column - The name of the column field
 * @param {number} rowIndex
 * @param {object} [options]
 * @return {HTMLElement}
 */
export const [
  queryEditableCell,
  /*getAllInputCells*/,
  getEditableCell,
  /*findAllInputCells*/,
  findEditableCell,
] = buildQueries(
  (container, column, row, options) => {
    const cell = getCellFromTable(column, row, container);
    const customRenderer = getCellRenderer(cell);
    const inputs = customRenderer.querySelectorAll('input');

    if (inputs.length > 1) {
      throw queryHelpers.getElementError(
        `Found multiple input elements inside the cell column("${column}") row("${row}")`,
        customRenderer
      );
    }
    else if (inputs.length === 0) {
      throw queryHelpers.getElementError(
        `Could not find any input elements inside the cell column("${column}") row("${row}")`,
        customRenderer
      );
    }

    return inputs;
  }
);

/**
 * Get the trigger element from a selectable cell.
 * @param {HTMLElement} container
 * @param {string} column - The name of the column field
 * @param {number} rowIndex
 * @param {object} [options]
 * @return {HTMLElement}
 */
export function getSelectableCell(container, column, row, options) {
  const cell = getCellFromTable(column, row, container);
  const customRenderer = getCellRenderer(cell);
  const selects = queryAllByTestId(customRenderer, 'SelectableCell');

  if (selects.length === 0 ) {
    throw queryHelpers.getElementError(
      `Could not find a Select trigger inside cell column("${column}") row("${row}")`,
      cell
    );
  }
  else if (selects.length > 1) {
    throw queryHelpers.getElementError(
      `Found multiple Select triggers inside cell column("${column}") row("${row}")`,
      cell
    );
  }

  return selects[0];
}

/**
 * Get the menu element associated with the trigger element
 * in a selectable cell.
 * @param {HTMLElement} container
 * @param {string} column - The name of the column field
 * @param {number} rowIndex
 * @param {object} [options]
 * @return {HTMLElement}
 */
export function getSelectableCellMenu(container, column, row, options) {
  const trigger = getSelectableCell(container, column, row, options);
  return getSelectMenuByTrigger(container, trigger, options);
}

/**
 * Get an option from the menu associated with the trigger element
 * in a selectable cell.
 * @param {HTMLElement} container
 * @param {string} column - The name of the column field
 * @param {number} rowIndex
 * @param {string} optionText - The display text of the option to get.
 * @param {object} [options]
 * @return {HTMLElement}
 */
export function getSelectableCellMenuOption(container, column, row, optionText, options) {
  const trigger = getSelectableCell(container, column, row, options);
  return getSelectMenuOptionByTrigger(container, trigger, optionText, options);
}

/**
 * Wait for the select menu associated with a selectable cell
 * to open.
 * @param {HTMLElement} container
 * @param {string} column - The name of the column field
 * @param {number} rowIndex
 * @param {object} [options]
 */
export async function waitForSelectableCellMenuToOpen(container, column, row, options) {
  await waitFor(() =>
    getSelectableCell(container, column, row, options)
  );
  return waitForTrue(() => {
    const trigger = getSelectableCell(container, column, row, options);
    return trigger.getAttribute('aria-expanded') === 'true';
  });
}

/**
 * Wait for the select menu associated with a selectable cell
 * to close.
 * @param {HTMLElement} container
 * @param {string} column - The name of the column field
 * @param {number} rowIndex
 * @param {object} [options]
 */
export async function waitForSelectableCellMenuToClose(container, column, row, options) {
  await waitFor(() =>
    getSelectableCell(container, column, row, options)
  );
  return waitForTrue(() => {
    const trigger = getSelectableCell(container, column, row, options);
    return trigger.getAttribute('aria-expanded') !== 'true';
  });
}

/**
 * @name getRemoveCell
 * @function
 * @description
 * Get a remove cell from the given table container.
 * @param {HTMLElement} container
 * @param {object} options
 * @return {HTMLElement}
 */
export const [
  queryRemoveCell,
  getAllRemoveCells,
  getRemoveCell,
  findAllRemoveCells,
  findRemoveCell
] = buildQueries(
  (container, options) => {
    return queryAllByTestId(container, 'RemoveCell', options);
  },
  () => {
    return 'Found multiple Remove cells';
  },
  () => {
    return 'Could not find any Remove cells';
  }
);

