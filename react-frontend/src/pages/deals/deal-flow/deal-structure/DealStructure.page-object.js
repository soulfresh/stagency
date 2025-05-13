import { HTMLPageObject, act } from '~/test';
import { SelectPageObject2 } from '~/components/page-objects';

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
export const DealStructurePageObject = HTMLPageObject.extend('deal-structure')
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
  .selector('[data-testid=DealStructure]')
  //
  // Filters are used both to refine which element is being selected
  // and in the `has` clause which is equivalent to a Jest `expect(y).toHave*` clause.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#filters
  .filters({
    dealType: SelectPageObject2('Deal Structure').text(),
    dealSelected: SelectPageObject2('Deal Structure').selected(),
    showingPercentOfNetForm: HTMLPageObject({testId: 'PercentageOfNet'}).exists(),
    showingFlatGuaranteeForm: HTMLPageObject({testId: 'FlatGuarantee'}).exists(),
    showingPromoterProfitForm: HTMLPageObject({testId: 'PromoterProfit'}).exists(),
  })

  // Actions are used to perform actions on the selected element
  // like `click` or `fillIn`.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#actions
  .actions({
    selectDealStructure: async (interactor, value) =>
      await act(async () =>
        await interactor.find(SelectPageObject2('Deal Structure')).choose(value)
      )
  })

