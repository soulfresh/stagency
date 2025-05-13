import {
  HTMLPageObject,
  elementContent
} from '~/test';
import { InputPageObject } from '../inputs/page-objects';
import { act, prettyDOM } from '@testing-library/react';

/**
 * `Search` component page object.
 *
 * __Selector__: ``
 *
 * __Locator__: Text content of the element.
 *
 * __Extends__: {@link HTMLPageObject}
 *
 * __Filters__:
 *
 * - `resultCount` {number} The number of results being displayed.
 * - `results` {string[]} The content from within each list item.
 * - `searchTerm` {string} The current text in the search input.
 *
 * __Actions__:
 *
 * - `search` Perform a search
 *   - @param {string} searchTerm
 * - `debugDOM` Pretty print the current DOM.
 * - `debugState` Pretty print the current state of the component.
 */
export const SearchPageObject = HTMLPageObject.extend('search')
  // The locator is used to pick one of the available elements
  // returned by the `selector`. By default it will be the text
  // content of the element but you can use the aria-label or
  // any other accessible attribute/data.
  .locator(el => el.querySelector('input')?.getAttribute('placeholder'))

  // The selector is used to find DOM elements with querySelectorAll.
  // You should use some aria or other accessible attribute to find
  // all of the instances of this component on the page.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#the-locator
  .selector('[role=search]')

  // Filters are used both to refine which element is being selected
  // and in the `has` clause which is equivalent to a Jest `expect(y).toHave*` clause.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#filters
  .filters({
    searchTerm: el => el.querySelector('input[data-testid=search-input]').value,
    resultCount: (el) => el.querySelectorAll('li').length,
    results: el => Array.from(el.querySelectorAll('li')).map(li => elementContent(li)),
  })

  // Actions are used to perform actions on the selected element
  // like `click` or `fillIn`.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#actions
  .actions({
    debugState: async (interactor) => {
      const term = await interactor.searchTerm();
      const results = await interactor.results();
      console.log(
        `Search Term: "${term}"\n` +
        `Results:\n` +
        results.map(r => `- ${r}\n`)
      )
    },
    search: async (interactor, value) =>
      act(async () =>
        interactor.find(InputPageObject({testId: 'search-input'})).fillIn(value),
      ),
    selectResult: async (interactor, index) =>
      await act(() =>
        interactor.perform(el => {
          const results = el.querySelectorAll('li');
          if (results.length > index) {
            const result = results[index];
            const buttons = result.querySelectorAll('button, a');
            if (buttons.length === 0) {
              console.warn(`[SearchPageObject] did not find any buttons inside of search result ${index}. Clicking the outer <li> element.`);
              console.log(prettyDOM(result));
            } else {
              if (buttons.length > 1) {
                console.warn(`[SearchPageObject] found multiple buttons/links inside of search result ${index}. Clicking the first <button> or <a> element.`);
                console.log(prettyDOM(result));
              }
              buttons[0].click();
            }
          }
          else console.warn(`[SearchPageObject] could select result ${index} because there are only ${results.lengt} results.`);
        })
      )
  })

