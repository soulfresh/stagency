- root
  - <a href="#spreadsheetcellpageobject">SpreadsheetCellPageObject</a>
  - <a href="#spreadsheetpageobject">SpreadsheetPageObject</a>
  - <a href="#spreadsheetrowpageobject">SpreadsheetRowPageObject</a>
  - <a href="#cellcolumnindex">cellColumnIndex</a>
  - <a href="#cellrowindex">cellRowIndex</a>
  - <a href="#columnname">columnName</a>
  - <a href="#columnvalue">columnValue</a>
  - <a href="#flatcells">flatCells</a>
  - <a href="#gridcells">gridCells</a>


## SpreadsheetCellPageObject

Interact with table cells. If you have issues
with a table cell returning the wrong data, try
one of the more specialized table cell page objects
like `TextCell` or `EditableCell`.

__Selector__: `[role=gridcell]`

__Locator__: Text content of the cell

__Extends__: {@link HTMLPageObject}

__Filters__:

- `rowIndex` {number}
- `columnIndex` {number}
- `rowName` {string} The text content of the cell in the first column of the cell row.
- `columnName` {string} The text content of the header above the current cell.
- `value` Any type of content in this cell.
    See {@link elementContent} for more info.

__Actions__:

- `fillIn` Type text into the first input element in the cell
  - `string` __text__




`any`

#### Defined in
- *[Spreadsheet.page-object2.js:237](https://github.com/soulfresh/react-website-template/tree/master/src/components/spreadsheet/Spreadsheet.page-object2.js#L237)*

<br/>
## SpreadsheetPageObject

Interact with a table element.

__Selector__: `[role=grid]`

__Locator__: `[data-spreadsheet-root]` `aria-label` value

__Extends__: {@link HTMLPageObject}

__Filters__:

- `string[][]` __cellValues__  The string value of all cells in the table.
- `string[]` __headers__ The column names.
- `number` __rowCount__ The number of DATA rows. This does not include the
  header row!

__Actions__:

- __debugState__ Print the current spreadsheet data as a table.




`any`

#### Defined in
- *[Spreadsheet.page-object2.js:134](https://github.com/soulfresh/react-website-template/tree/master/src/components/spreadsheet/Spreadsheet.page-object2.js#L134)*

<br/>
## SpreadsheetRowPageObject

Interact with a row in a Spreadsheet.

__Selector__: `[role=row]`

__Locator__: Text content of the left most column.

__Extends__: {@link HTMLPageObject}

__Filters__:

- `string[]` __cellValues__ The value of all cells in the row.




`any`

#### Defined in
- *[Spreadsheet.page-object2.js:195](https://github.com/soulfresh/react-website-template/tree/master/src/components/spreadsheet/Spreadsheet.page-object2.js#L195)*

<br/>
## cellColumnIndex

  ▸ **cellColumnIndex**(`cell`) => `number`

Get the column index associated with a cell element.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| cell | `HTMLElement` | *-* |


#### Returns
`number` 



#### Defined in
- *[Spreadsheet.page-object2.js:11](https://github.com/soulfresh/react-website-template/tree/master/src/components/spreadsheet/Spreadsheet.page-object2.js#L11)*

<br/>
## cellRowIndex

  ▸ **cellRowIndex**(`cell`) => `number`

Get the row index associated with a cell element.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| cell | `HTMLElement` | *-* |


#### Returns
`number` 



#### Defined in
- *[Spreadsheet.page-object2.js:17](https://github.com/soulfresh/react-website-template/tree/master/src/components/spreadsheet/Spreadsheet.page-object2.js#L17)*

<br/>
## columnName

  ▸ **columnName**(`cell`) => `string`

Get the text content from the header cell
above the cell element passed. This is useful
for generating the aria-label of a cell.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| cell | `HTMLElement` | *-* |


#### Returns
`string` 



#### Defined in
- *[Spreadsheet.page-object2.js:48](https://github.com/soulfresh/react-website-template/tree/master/src/components/spreadsheet/Spreadsheet.page-object2.js#L48)*

<br/>
## columnValue

  ▸ **columnValue**(`el`, `index`, `valueConstraint`) => `string`

Get the text content from another cell
in the same row as the element passed.
This is useful for finding the value
of the element in the first column of
of a cell row which should be used to define
the aria-label of a cell.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| el | `HTMLElement` | *-* |
| index |  | `1` |
| valueConstraint |  | *-* |


#### Returns
`string` 



#### Defined in
- *[Spreadsheet.page-object2.js:35](https://github.com/soulfresh/react-website-template/tree/master/src/components/spreadsheet/Spreadsheet.page-object2.js#L35)*

<br/>
## flatCells

  ▸ **flatCells**(`el`, `selector`) => `void`

Return a flat list of cells by their column.
If your root element includes multiple rows
of data, you'll need to use `gridCells` instead
so cells are organized by row and column.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| el | `HTMLElement` | *-* |
| selector |  | `'[role=gridcell]'` |


#### Returns
`void` 



#### Defined in
- *[Spreadsheet.page-object2.js:68](https://github.com/soulfresh/react-website-template/tree/master/src/components/spreadsheet/Spreadsheet.page-object2.js#L68)*

<br/>
## gridCells

  ▸ **gridCells**(`el`, `rowOffset`, `selector`) => `void`

Get a multi-dimensional array of cells by
row and column. You can pass an offset value
to determine at which row you want to start
collecting cells. This is useful in combination
with the selector for getting 'columnheader' cells
and then combining those with 'gridcell' cells.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| el | `HTMLElement` | *-* |
| rowOffset |  | `1` |
| selector |  | `'[role=gridcell]'` |


#### Returns
`void` 



#### Defined in
- *[Spreadsheet.page-object2.js:95](https://github.com/soulfresh/react-website-template/tree/master/src/components/spreadsheet/Spreadsheet.page-object2.js#L95)*

<br/>
