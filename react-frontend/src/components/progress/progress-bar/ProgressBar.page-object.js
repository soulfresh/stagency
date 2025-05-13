import { HTMLPageObject } from '~/test';

/**
 * Interact with a progress bar
 *
 * __Selector__: `[role=progressbar]`
 * __Locator__: Text content of the element.
 * __Extends__: {@link HTMLPageObject}
 * __Filters__:
 * - `value` {number} A number from 0 - 1 representing the progress
 * - `percent` {number} A number from 0 - 100 representing the progress
 */
export const ProgressBarPageObject = HTMLPageObject.extend('progress bar')
  .selector('[role=progressbar]')
  .filters({
    value: el => {
      const value = Number(el.getAttribute('aria-valuenow'));
      if (isNaN(value)) return undefined;
      else return value / 100;
    },
    percent: el => Number(el.getAttribute('aria-valuenow')),
    min: el => Number(el.getAttribute('aria-valuemin')),
    max: el => Number(el.getAttribute('aria-valuemax')),
    width: el => el.style.width,
  });
