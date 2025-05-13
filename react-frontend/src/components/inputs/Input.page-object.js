import {
  HTMLPageObject,
  TextFieldPageObject,
  act,
  elementText,
} from '~/test'
import {
  ActionPageObject,
} from '../buttons/page-objects';

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
export const InputPageObject = HTMLPageObject.extend('input')
  // Treat the InputDecorator wrapping element as the root of our input.
  .selector('[data-inputdecorator]')

  // Filters are used both to refine which element is being selected
  // and in the `has` clause which is equivalent to a Jest `expect(y).toHave*` clause.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#filters
  .filters({
    clearButton: ActionPageObject({label: 'Clear Input'}),
    title: TextFieldPageObject().title(),
    value: TextFieldPageObject().value(),
    empty: el => el.querySelector('input').value === '',
    disabled: TextFieldPageObject().disabled(),
    placeholder: TextFieldPageObject().placeholder(),
    id: TextFieldPageObject().id(),
    visible: TextFieldPageObject().visible(),
    focused: TextFieldPageObject().focused(),
    loading: HTMLPageObject({role: 'progressbar'}).exists(),
    valid: el => el.querySelector('input')?.getAttribute('aria-invalid') === 'false',
    errored: el => el.querySelector('input')?.getAttribute('aria-invalid') === 'true',
    errorMessage: el => {
      const id = el.querySelector('input')?.getAttribute('aria-errormessage');
      if (id) {
        return elementText(
          el.querySelector(`#${id}`)
        );
      } else {
        return '';
      }
    },
    clearable: ActionPageObject({label: 'Clear Value', hidden: false}).exists(),
    // TODO
    // success:
    // warning:
  })
  //
  // Actions are used to perform actions on the selected element
  // like `click` or `fillIn`.
  // https://frontside.com/bigtest/docs/interactors/locators-filters-actions#actions
  .actions({
    clear  : forwardTo(ActionPageObject(), 'click'),
    fillIn : forwardTo(TextFieldPageObject(), 'fillIn'),
    click  : forwardTo(TextFieldPageObject(), 'click'),
    focus  : forwardTo(TextFieldPageObject(), 'focus'),
    blur   : forwardTo(TextFieldPageObject(), 'blur'),
  });
