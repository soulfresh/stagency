import { Select, HTMLPageObject, including } from '~/test/interactors';
import { getLabel } from '~/test/page-object-helpers';

export const ListBoxPageObject = HTMLPageObject.extend('listbox')
  .selector('select, [role=listbox]')
  .filters({
    // Find by the button associated with (used to open) this listbox.
    trigger: el => el.getAttribute('aria-labelledby'),
  })

export const OptionPageObject = HTMLPageObject.extend('option')
  .selector('option, [role=option]')

/**
 * Work with our Select component.
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
export const SelectPageObject2 = Select.extend('select')
  // The locator is used to pick one of the available elements
  // returned by the `selector`. By default it will be the text
  // content of the element but you can use the aria-label or
  // any other accessible attribute/data.
  .locator(getLabel)

  // The selector is used to find DOM elements with querySelectorAll.
  // You should use some aria or other accessible attribute to find
  // all of the instances of this component on the page.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#the-locator
  .selector('[aria-haspopup=listbox]')

  // Filters are used both to refine which element is being selected
  // and in the `has` clause which is equivalent to a Jest `expect(y).toHave*` clause.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#filters
  .filters({
    selected: el => {
      const id = el.id;
      const list = document.querySelector(`[role=listbox][aria-labelledby=${id}]`)
      if (list) {
        // TODO Clicking an element in the Select is not setting aria-selected to true!
        return Array.from(list.querySelectorAll('[role=listbox]'))
          .findIndex(el => el.ariaSelected === 'true') > -1;
      }
      return false;
    }
  })

  // Actions are used to perform actions on the selected element
  // like `click` or `fillIn`.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#actions
  .actions({
    choose: async (interactor, value) => {
      // Open the drop down.
      await interactor.click();
      // Select an item.
      await interactor.perform(async el => {
        const id = el.id;
        await ListBoxPageObject({trigger: id})
        // TODO Including should be specified outside of this function
          .find(OptionPageObject(including(value)))
          .click();
      })
    },
  })
