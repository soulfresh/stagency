import { HTMLPageObject, act, elementText, elementContent } from '~/test';
import { ActionPageObject } from '../../buttons/page-objects';
import { InputPageObject } from '../../inputs/page-objects';
import { SearchPageObject } from '../../search/page-objects';

/**
 * Get an async function that will call the given
 * action on a child interactor.
 */
const forwardTo = (child, action) =>
  async (interactor, ...rest) =>
    await act(() =>
      interactor.find(child)[action](...rest)
    )

const searchButton = HTMLPageObject({testId: 'InputWrapper'}).find(ActionPageObject());

// TODO ensure there is a [role=search] inside
const getModal = () => document.querySelector('[aria-modal]');

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
export const AvatarSearchPageObject = InputPageObject.extend('avatar-search')
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
  .selector('[data-inputdecorator]')
  //
  // Filters are used both to refine which element is being selected
  // and in the `has` clause which is equivalent to a Jest `expect(y).toHave*` clause.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#filters
  .filters({
    placeholder: searchButton.placeholder(),
    modal: el => !!getModal(),
    resultCount: el => getModal().querySelectorAll('li').length,
    results: el => Array.from(getModal().querySelectorAll('li')).map(li => elementContent(li)),
    value: el => elementText(el),
    // TODO
    // title: TextFieldPageObject().title(),
    // empty: el => el.querySelector('input').value === '',
    // disabled: TextFieldPageObject().disabled(),
    // id: TextFieldPageObject().id(),
    // visible: TextFieldPageObject().visible(),
    // focused: TextFieldPageObject().focused(),
    // loading: HTMLPageObject({role: 'progressbar'}).exists(),
    // valid: el => el.querySelector('input')?.getAttribute('aria-invalid') === 'false',
    // errored: el => el.querySelector('input')?.getAttribute('aria-invalid') === 'true',
    // errorMessage: el => {
    //   const id = el.querySelector('input')?.getAttribute('aria-errormessage');
    //   if (id) {
    //     return elementText(
    //       el.querySelector(`#${id}`)
    //     );
    //   } else {
    //     return '';
    //   }
    // },
  })
  //
  // Actions are used to perform actions on the selected element
  // like `click` or `fillIn`.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#actions
  .actions({
    // TODO
    // fillIn : forwardTo(, 'fillIn'),
    // focus  : forwardTo(, 'focus'),
    // blur   : forwardTo(, 'blur'),
    clear  : forwardTo(ActionPageObject({label: 'Clear Value'}), 'click'),
    click  : forwardTo(searchButton, 'click'),
    searchFor: async (interactor, term) =>
      await act(() =>
        SearchPageObject().search(term)
      ),
    selectResult: async (interactor, index) =>
      await act(() =>
        SearchPageObject().selectResult(index)
      ),
  });

