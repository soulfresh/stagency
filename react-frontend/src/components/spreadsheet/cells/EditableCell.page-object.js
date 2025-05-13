import { act } from '@testing-library/react';
import { elementContent } from '~/test';
import { SpreadsheetCellPageObject } from '../Spreadsheet.page-object2';
import { InputPageObject } from '../../inputs/page-objects';

/**
 * Get an async function that will call the given
 * action on a child interactor.
 */
const forwardTo = (child, action) =>
  async (interactor, ...rest) =>
    await act(() =>
      interactor.find(child)[action](...rest)
    )

/**
 * Interact with editable cells.
 *
 * __Selector__: `[role=gridcell]`
 * __Locator__: The aria label of the cell.
 * __Extends__: {@link SpreadsheetCellPageObject}
 * __Filters__:
 * - `rowIndex` {number}
 * - `columnIndex` {number}
 * - `rowName` {string} The text content of the cell in the first column of the cell row.
 * - `columnName` {string} The text content of the header above the current cell.
 * - `value` The 'value' content of this cell.
 *     See `elementContent` for more info.
 * __Actions__:
 * - `fillIn` Type text into the first input element in the cell
 *   - @param {string} text
 */
export const EditableCellPageObject = SpreadsheetCellPageObject.extend('editable cell')
  .locator(el => elementContent(el, ['label']))
  .filters({
    value: el => elementContent(el, ['value']),
    error: el => Boolean(
      el.querySelector('[aria-invalid]')?.getAttribute('aria-invalid')
    ),
  })
  .actions({
    clear: async (interactor) => {
      await interactor.find(InputPageObject())
        .perform(async (input) => {
          input.focus();
          input.value = '';
        });
    },
    fillIn: forwardTo(InputPageObject(), 'fillIn'),
    // fillIn: (interactor, text, suppressWarning = false) => {
    //   if (!suppressWarning && String(text).length > 2) {
    //     // See the description below
    //     console.warn('You cannot type more than 2 characters into an EditableCell during testing.');
    //   }
    //   // TODO Figure out why the carat moves around during typing
    //   // which in turn prevents us from typing more than two characters.
    //   // When we replace AgGrid, we should use `fillIn` instead of
    //   // @testing-library userEvent:
    //   // return interactor.find(TextField()).fillIn(String(text))
    //   return interactor.find(TextField()).perform(async (input) => {
    //     await act(async () => {
    //       userEvent.clear(input);
    //       await userEvent.type(input, `{selectall}${text}`, {delay: 60});
    //     });
    //   })
    // },
  });
