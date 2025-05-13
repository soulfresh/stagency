import {
  waitFor as waitForBase,
  queryHelpers,
  screen,
  getAllByText,
  getAllByTestId,
} from '@testing-library/react';

/**
 * Wait for the given callback to return true.
 * This functions similarly to the waitFor method
 * from @testing-library except that your callback
 * should return a boolean, rather than throwing an exception.
 * This makes it a little easier to read and write
 * terse wait for statements.
 * @example
 *   await waitFor(() => foo.calls.count > 0);
 * @param {function} cb
 */
export const waitForTrue = async cb => {
  await waitForBase(() => {
    if (!cb()) throw new Error('waitForTrue timed out waiting for a truthy value.');
  });
};

/**
 * Get an element by its text, test id and its index
 * in the list of matching elements. Use this if there
 * could be multiple elements on the page with the same
 * text and test id.
 *
 * @param {string} text
 * @param {string} id
 * @param {number} [index]
 * @param {*} [container] - Either the screen object or an
 *   HTMLElement.
 * @return {HTMLElement}
 */
export const getByTextAndIdAndIndex = (text, id, index = 0, container = screen) => {
  const nodes = container === screen
    ? container.getAllByText(text)
    : getAllByText(container, text);
  const textMatches = nodes.filter(n => n.getAttribute('data-testid') === id);
  if (textMatches.length === 0)
    throw new Error(`Could not find any elements with both the text ${text} and test id ${id}.`);
  if (index > textMatches.length - 1)
    throw new Error(`Could not find an element with the text ${text}, test id ${id} and index ${index}. Only ${textMatches.length} elements were found.`);
  return textMatches[index];
};

/**
 * Get all elements matching the given test id and filter callback.
 * @param {string} id - The data-testid attribute you are searching for.
 * @param {function} filter - A filter used to filter the elements that match
 *   the specified id.
 * @param {HTMLElement} [container]
 * @return {HTMLElement[]}
 */
export function getAllByTestIdAndFilter(id, filter, container) {
  const nodes = !container
    ? screen.getAllByTestId(id)
    : getAllByTestId(container, id);
  const matches = nodes.filter(filter);

  if (matches.length === 0) {
    throw queryHelpers.getElementError(
      `Could not find any elements with both the test id ${id} and the specified filter.

      ${filter.toString()}`,
      container || document.body
    );
  }

  return matches;
}

/**
 * Get a single element matching the given test id and filter callback.
 * @param {string} id - The data-testid attribute you are searching for.
 * @param {function} filter - A filter used to filter the elements that match
 *   the specified id.
 * @param {HTMLElement} [container]
 * @return {HTMLElement[]}
 */
export function getByTestIdAndFilter(id, filter, container) {
  const matches = getAllByTestIdAndFilter(id, filter, container);

  if (matches.length > 1) {
    throw queryHelpers.getElementError(
      `Found ${matches.length} elements with both the test id ${id} and the specified filter.

      ${filter.toString()}`,
      container || document.body
    );
  }

  return matches[0];
}

/**
 * Get an element by its text and test id.
 * Use this if there are multiple elements with
 * either the same text or the same test id and
 * you need to disambiguate between them.
 *
 * @param {string} text
 * @param {string} id
 * @param {*} [container] - Either the screen object or an
 *   HTMLElement.
 * @return {HTMLElement}
 */
export const getByTextAndId = (text, id, container) =>
  getByTextAndIdAndIndex(text, id, 0, container);

