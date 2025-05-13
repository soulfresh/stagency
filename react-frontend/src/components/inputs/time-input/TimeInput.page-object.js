import { HTMLPageObject } from '~/test';

function findMenu(id) {
  return document.querySelector(`[role=listbox][aria-labelledby=${id}]`)
}

function findColumn(menuId, columnLabel) {
  const menu = findMenu(menuId);
  if (menu) {
    return menu.querySelector(`[aria-label="${columnLabel} options"]`);
  }
  return undefined;
}

/**
 * description
 *
 * __Selector__: ``
 *
 * __Locator__: Text content of the element.
 *
 * __Extends__: {@link HTMLPageObject}
 *
 * __Filters__:
 *
 * - `name` {type} description
 *
 * __Actions__:
 *
 * - `name` description
 *   - @param {type} name
 */
export const TimeInputPO = HTMLPageObject.extend('time-input')
  // The locator is used to pick one of the available elements
  // returned by the `selector`. By default it will be the text
  // content of the element but you can use the aria-label or
  // any other accessible attribute/data.
  // .locator(el => el.getAttribute('aria-label'))
  //
  // The selector is used to find DOM elements with querySelectorAll.
  // You should use some aria or other accessible attribute to find
  // all of the instances of this component on the page.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#the-locator
  .selector('[role=combobox]')

  // Filters are used both to refine which element is being selected
  // and in the `has` clause which is equivalent to a Jest `expect(y).toHave*` clause.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#filters
  .filters({
    open: el => !!findMenu(el.id),
    h24: el => {
      const column = findColumn(el.id, 'hour');
      if (column) {
        const h24 = column.querySelectorAll('[role=option]').length === 24;
        const ampm = findColumn(el.id, 'meridiem');
        return h24 && !ampm;
      }
      return false;
    },
    hourCount: el => {
      const column = findColumn(el.id, 'hour');
      if (column) {
        return column.querySelectorAll('[role=option]').length;
      }
      return false;
    },
    minuteCount: el => {
      const column = findColumn(el.id, 'minute');
      if (column) {
        return column.querySelectorAll('[role=option]').length;
      }
      return false;
    },
    secondsColumn: el => {
      return !!findColumn(el.id, 'second');
    },
    meridiemColumn: el => {
      return !!findColumn(el.id, 'AM/PM');
    }
  })

  // Actions are used to perform actions on the selected element
  // like `click` or `fillIn`.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#actions
  .actions({

  })
