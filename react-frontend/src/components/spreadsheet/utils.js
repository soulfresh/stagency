

/**
 * Determine if the cell at the given row and column is currently
 * focused.
 * @param {object} api - The agGrid API
 * @param {number} rowIndex - The row of the cell you want to test.
 * @param {number|string} colId - The column of the cell being tested.
 * @return {boolean}
 */
export function isFocusedCell(api, rowIndex, colId) {
  const cell = api.getFocusedCell();
  return cell && cell.rowIndex === rowIndex && cell.column.colId === colId;
}

/**
 * Determine if the cell at the given rown and column is currently
 * being edited.
 * @param {object} api - The agGrid API
 * @param {number} rowIndex - The row of the cell you want to test.
 * @param {number|string} colId - The column of the cell being tested.
 * @return {boolean}
 */
export function isBeingEdited(api, rowIndex, colId) {
  return !!api.getEditingCells()
    .find(curr => curr.rowIndex === rowIndex && curr.column.colId === colId);
}

/**
 * Get the list of standard column widths. This allows
 * us to consistently size our columns and also adapts
 * to mobile screens.
 */
export function getStandardColumnWidths() {
  // Unfortunately AgGrid `minWidth` is only respected on initial render
  // so watching this query will have no effect.
  const mobile = window.matchMedia('(max-width: 360px)').matches;

  // Column widths
  return {
    s  : 120,
    m  : 150,
    l  : 200,
    xl : mobile ? 270 : 400,
  };
}

/**
 * Generate the aria label for a cell.
 * @param {number} rowIndex
 * @param {object} column
 * @param {object} columnApi
 * @param {string} [tableName]
 * @return {string}
 */
export function getAriaLabel(rowIndex, column, columnApi, tableName) {
  // TODO When we move away from AgGrid,
  // the aria label should be:
  // {column[0].thisRow.value} {thisColumn.headerName}
  // Expenses Spreadsheet Example: {Catering} {Per Ticket Cost}
  const columnIndex = columnApi.getAllColumns().reduce((acc, col, i) => col === column ? i : acc, 0);
  return `${tableName ? tableName + ' ' : ''}Row ${rowIndex + 1} Column ${columnIndex + 1}`;
}

/**
 * Get the props intended to be passed through
 * to the custom cell renderer (ie. Input or Select
 * element inside of a cell).
 * @param {object} props
 * @return {object} Any props that aren't part of the
 * AgGrid API or the Spreadsheet API.
 */
export function getCellProps(props) {
  // Get the props intended for the input element
  // by pulling out all of the know AgGrid API props.
  const {
    // AgGrid API
    addRenderedRowListener,
    addRowCompListener,
    agGridReact,
    colDef,
    columnApi,
    data,
    eGridCell,
    eParentOfValue,
    field,
    optionToString,
    frameworkComponentWrapper,
    formatValue,
    getValue,
    headerName,
    node,
    reactContainer,
    refreshCell,
    registerRowDragger,
    tableApi,
    valueFormatted,
    equals,
    // Other common props
    compact,
    reduce,
    footer,
    validate,
    ResizeObserver,
    // Anything left should be applied to the input
    ...passThroughProps
  } = props;
  return passThroughProps;
}
