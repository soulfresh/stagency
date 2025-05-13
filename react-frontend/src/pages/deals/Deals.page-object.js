import { act } from '@testing-library/react';
import {
  HTMLPageObject,
  Link,
  TablePageObject,
  TextField,
} from '~/test';

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
export const DealsPageObject = HTMLPageObject.extend('deals')
  // The selector is used to find DOM elements with querySelectorAll.
  // You should use some aria or other accessible attribute to find
  // all of the instances of this component on the page.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#the-locator
  .selector('[data-testid=Deals]')

  // Filters are used both to refine which element is being selected
  // and in the `has` clause which is equivalent to a Jest `expect(y).toHave*` clause.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#filters
  .filters({
    headers: TablePageObject().headers(),
    dealCount: TablePageObject().dataCount(),
    deals: TablePageObject().dataValues(),
    newDealLink: Link(),
    newDealURL: Link().href(),
  })
  //
  // Actions are used to perform actions on the selected element
  // like `click` or `fillIn`.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#actions
  .actions({
    async search(deals, value) {
      await act(() =>
        deals
          .find(TextField({placeholder: 'Search Deals'}))
          .fillIn(value)
      );
    },
  });

