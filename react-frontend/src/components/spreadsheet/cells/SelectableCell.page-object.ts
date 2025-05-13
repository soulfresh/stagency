import { elementContent, Interactor } from '~/test';
import { SpreadsheetCellPageObject } from '../Spreadsheet.page-object2';
import { SelectPageObject2 as SelectPageObject } from '../../inputs/page-objects';

/**
 * Interact with editable cells.
 *
 * Example: `SelectableCellPO({rowName: 'Foo', columnName: 'Bar'}).choose('Boz')`
 *
 * __Selector__: `[role=gridcell]`
 * __Locator__: The aria label of the cell.
 * __Extends__: {@link SpreadsheetCellPageObject}
 * __Filters__:
 * - `rowIndex` {number}
 * - `columnIndex` {number}
 * - `rowName` {string} The text content of the cell in the first column of the cell row.
 * - `columnName` {string} The text content of the header above the current cell.
 * - `selected` The selected option text
 * __Actions__:
 * - `choose` Select one of the items inside the selectedable cell.
 *   - @param {string} text
 */
export const SelectableCellPO = SpreadsheetCellPageObject.extend('editable cell')
  .locator((el: HTMLInputElement) => elementContent(el, ['label']))
  .filters({
    // TODO Delegate to SelectPageObject.selected
    // selected: (el: HTMLInputElement) => elementContent(el, ['value']),
  })
  .actions({
    choose: async (cell: Interactor<any, any>, value: string) => {
      await cell.find(SelectPageObject()).choose(value);
    }
  });
