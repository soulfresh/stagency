import { elementContent } from '~/test';
import { SpreadsheetCellPageObject } from '../Spreadsheet.page-object2';

/**
 *
 * __Extends__: {@link SpreadsheetCellPageObject}
 */
export const TextCellPageObject = SpreadsheetCellPageObject.extend('text cell')
  .filters({
    value: el => elementContent(el, ['text']),
  });
