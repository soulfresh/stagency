/**
 * Turn the given object into a generator
 * that returns the values defined on the object.
 * This is useful for converting the result of
 * our api data generator functions into the
 * factories expected by GraphQL schema mocks.
 *
 * ```js
 * const target = {a: true, b: 'foo'};
 * const generator = toGenerator(target);
 * // -> {a: () => true, b: () => 'foo'}
 * ```
 *
 * @param target - An object with properties
 */
export function toGenerator(target) {
  const out = {}
  for (let prop in target) {
    out[prop] = () => target[prop]
  }
  return out
}
