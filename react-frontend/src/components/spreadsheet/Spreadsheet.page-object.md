## Constants

* [cellColumnIndex](#cellColumnIndex) ⇒ <code>number</code>
* [cellRowIndex](#cellRowIndex) ⇒ <code>number</code>
* [columnValue](#columnValue) ⇒ <code>string</code>
* [columnName](#columnName) ⇒ <code>string</code>
* [flatCells](#flatCells) ⇒ <code>Array.&lt;HTMLElement&gt;</code>
* [gridCells](#gridCells) ⇒ <code>Array.&lt;Array.&lt;HTMLElement&gt;&gt;</code>
* [SpreadsheetPageObject](#SpreadsheetPageObject)
* [SpreadsheetRowPageObject](#SpreadsheetRowPageObject)
* [SpreadsheetCellPageObject](#SpreadsheetCellPageObject)

<a name="cellColumnIndex"></a>

## cellColumnIndex ⇒ <code>number</code>
Get the column index associated with a cell element.

**Kind**: global constant  

| Param | Type |
| --- | --- |
| cell | <code>HTMLElement</code> | 

<a name="cellRowIndex"></a>

## cellRowIndex ⇒ <code>number</code>
Get the row index associated with a cell element.

**Kind**: global constant  

| Param | Type |
| --- | --- |
| cell | <code>HTMLElement</code> | 

<a name="columnValue"></a>

## columnValue ⇒ <code>string</code>
Get the text content from another cell
in the same row as the element passed.
This is useful for finding the value
of the element in the first column of
of a cell row which should be used to define
the aria-label of a cell.

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>HTMLElement</code> | The element relative in whos row you want   to find another cell. |
| [index] | <code>number</code> | The column index of the cell you want to access. |
| [valueConstraint] | <code>Array.&lt;string&gt;</code> | A list of content types you   want to use in determining what constitues the "value" of the cell.   See the `elementContent` function. |

<a name="columnName"></a>

## columnName ⇒ <code>string</code>
Get the text content from the header cell
above the cell element passed. This is useful
for generating the aria-label of a cell.

**Kind**: global constant  

| Param | Type |
| --- | --- |
| cell | <code>HTMLElement</code> | 

<a name="flatCells"></a>

## flatCells ⇒ <code>Array.&lt;HTMLElement&gt;</code>
Return a flat list of cells by their column.
If your root element includes multiple rows
of data, you'll need to use `gridCells` instead
so cells are organized by row and column.

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>HTMLElement</code> |  |
| [selector] | <code>string</code> | The selector to use   to determine a "cell" |

<a name="gridCells"></a>

## gridCells ⇒ <code>Array.&lt;Array.&lt;HTMLElement&gt;&gt;</code>
Get a multi-dimensional array of cells by
row and column. You can pass an offset value
to determine at which row you want to start
collecting cells. This is useful in combination
with the selector for getting 'columnheader' cells
and then combining those with 'gridcell' cells.

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>HTMLElement</code> |  |
| [rowOffset] | <code>number</code> | The offset to   use as the starting index into the grid   that you want to start collecting cells. |
| [selector] | <code>string</code> | The selector string   to use to determine a "cell". |

<a name="SpreadsheetPageObject"></a>

## SpreadsheetPageObject
Interact with a table element.

__Selector__: `[role=grid]`

__Locator__: `[data-spreadsheet-root]` `aria-label` value

__Extends__: [HTMLPageObject](HTMLPageObject)

__Filters__:

- `string[][]` __cellValues__  The string value of all cells in the table.

**Kind**: global constant  
<a name="SpreadsheetRowPageObject"></a>

## SpreadsheetRowPageObject
Interact with a row in a Spreadsheet.

__Selector__: `[role=row]`

__Locator__: Text content of the left most column.

__Extends__: [HTMLPageObject](HTMLPageObject)

__Filters__:

- `string[]` __cellValues__ The value of all cells in the row.

**Kind**: global constant  
<a name="SpreadsheetCellPageObject"></a>

## SpreadsheetCellPageObject
Interact with table cells. If you have issues
with a table cell returning the wrong data, try
one of the more specialized table cell page objects
like `TextCell` or `EditableCell`.

__Selector__: `[role=gridcell]`

__Locator__: Text content of the cell

__Extends__: [HTMLPageObject](HTMLPageObject)

__Filters__:

- `rowIndex` {number}
- `columnIndex` {number}
- `rowName` {string} The text content of the cell in the first column of the cell row.
- `columnName` {string} The text content of the header above the current cell.
- `value` Any type of content in this cell.
    See [elementContent](elementContent) for more info.

__Actions__:

- `fillIn` Type text into the first input element in the cell
  - `string` __text__

**Kind**: global constant  
