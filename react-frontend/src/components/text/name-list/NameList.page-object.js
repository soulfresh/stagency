import { HTMLPageObject, elementContent } from '~/test';

/**
 * @param {HTMLElement} el
 * @return {HTMLElement}
 */
const getTooltip = el => {
  const tooltipWrapper = el.querySelector('[aria-describedby]');
  if (tooltipWrapper) {
    const id = tooltipWrapper.getAttribute('aria-describedby');
    if (id) {
      return document.querySelector(`#${id}`);
    }
  }
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
export const NameListPageObject = HTMLPageObject.extend('name-list')
  .selector('span')

  // Filters are used both to refine which element is being selected
  // and in the `has` clause which is equivalent to a Jest `expect(y).toHave*` clause.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#filters
  .filters({
    tooltip: getTooltip,
    tooltipText: el => {
      const tooltip = getTooltip(el);
      return tooltip
        ? elementContent(tooltip, ['text'])
        : '';
    },
  })

  // Actions are used to perform actions on the selected element
  // like `click` or `fillIn`.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#actions
  //.actions({})
