import { HTMLPageObject, elementText } from '~/test';

const getLabel = el => elementText(
  el.querySelector(`#${el.getAttribute('aria-labelledby')}`)
);

/**
 * Interact with Avatar elements.
 *
 * __Selector__: `[role=group]`
 *
 * __Locator__: The aria-labelledby text content or the inner image alt or the
 *   initials text.
 *
 * __Extends__: {@link HTMLPageObject}
 *
 * __Filters__:
 *
 * - `src` {string} The inner image `src`
 * - `label` {string} The label text displayed next to the profile image (if there is one)
 * - `subtitle` {string} The subtitle text displayed next to the profile image (if there is one).
 */
export const AvatarPageObject = HTMLPageObject.extend('avatar')
  .selector('[role=group]')
  .locator(el =>
    // If the `label` prop is used
    elementText(document.querySelector(`#${el.getAttribute('aria-labelledby')}`)) ||
    // If using an image and no `label`
    el.querySelector('img[alt]')?.getAttribute('alt')?.replace('Profile', '').trim() ||
    // If using the abbreviation and no `label`
    el.querySelector('[aria-label]')?.getAttribute('aria-label')?.replace('Profile', '').trim()
  )
  .filters({
    src: el => el.querySelector('img[alt]')?.getAttribute('src'),
    initials: el => elementText(el.querySelector('[aria-label]')),
    label: getLabel,
    title: getLabel,
    subtitle: el => elementText(
      el.querySelector(`#${el.getAttribute('aria-describedby')}`)
    ),
    tooltip: el => {
      const tip = el.querySelector('[aria-describedby]')?.getAttribute('aria-describedby');
      if (tip) {
        return elementText(document.querySelector(`#${tip}`));
      }
      return '';
    },
  });

