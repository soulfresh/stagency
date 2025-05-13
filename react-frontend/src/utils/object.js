
/**
 * Remove undefined properties from the given object. This allows
 * us to clean up configuration objects with undefined properties
 * so our GraphQL mocks will generate values for those properties.
 * Otherwise, some properties such as id fields will convert the
 * undefined properties to the string value "undefined".
 * @param {object} original - The object to clean up.
 * @return {object}
 */
export function clean(original) {
  if (typeof original !== 'object') return undefined
  return Object.keys(original).reduce((acc, key) => {
    if (original[key] !== undefined) acc[key] = original[key]
    return acc
  }, {})
}
