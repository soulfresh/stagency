

/**
 * A non-breaking space character for use in React Component templates.
 *
 * In the following example, the variable values for `foo` and `bar` would have
 * their whitespace collapsed without the NBSP character inserted between them.
 * ```jsx
 * <Text>
 *   {foo}{NBSP}
 *   {bar}
 * </Text>
 * ```
 */
export const NBSP = "\u00a0";

/**
 * Recurse until we find the last element in a DOM branch,
 * following only the first branch path.
 * @param {HTMLElement} el
 * @return {HTMLElement}
 */
export function getFirstLeafNode(el) {
  return el.firstChild ? getFirstLeafNode(el.firstChild) : el;
}

/**
 * Get the text value from the leaf element of
 * the first DOM branch in the given root element.
 * This will get either the text content of the
 * element or the value if it is an input element.
 *
 * This is useful for getting the data out of a custom
 * cell renderer in an AgGrid table because it is
 * guaranteed that there will only be one DOM branch
 * inside of table cell elements.
 *
 * @param {HTMLElement} root
 * @return {string}
 */
export function getValueFromFirstLeafNode(root) {
  const leaf = getFirstLeafNode(root);
  switch (leaf.tagName) {
    case 'INPUT':
      return leaf.value;
    default:
      return leaf.textContent;
  }
}
