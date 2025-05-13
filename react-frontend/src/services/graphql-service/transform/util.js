import cloneDeep from 'lodash.clonedeep'

/**
 * Transform an object with nested object properties into
 * GraphQL relationships (ie, replace those properties with
 * a data property that points to the nested object).
 *
 * ```js
 * prepareNestedRelationships({foo: {bar: 'baz'}});
 * // -> {foo: {data: {bar: 'baz'}}}
 * ```
 *
 * @param original - An object with nested objects that should
 *   be transformed into relationships.
 */
export function prepareNestedRelationships(original) {
  if (typeof original !== 'object') return original

  // const out = copy(original);
  const out = cloneDeep(original)
  for (let key in out) {
    const current = out[key]
    if (Array.isArray(current)) {
      out[key] = {
        data: current.map((i) => prepareNestedRelationships(i)),
      }
    } else if (current && typeof current === 'object') {
      out[key] = {
        data: prepareNestedRelationships(current),
      }
    }
  }
  return out
}

/**
 * Perform the inverse of `prepareNestedRelationships`.
 *
 * ```js
 * collapseNestedRelationships({foo: {data: {bar: 'baz'}}});
 * // -> {foo: {bar: 'baz'}}
 * ```
 *
 * @param original - An object with relationships (ie. data properties)
 *   that should be collapsed into direct properties.
 */
export function collapseNestedRelationships(original) {
  if (typeof original !== 'object') return original

  const out = cloneDeep(original)
  for (let key in out) {
    const current = out[key]
    if (current && typeof current === 'object') {
      if (Array.isArray(current)) {
        out[key] = current.map((o) => collapseNestedRelationships(o))
      } else if (current.data) {
        out[key] = collapseNestedRelationships(current.data)
      } else {
        out[key] = collapseNestedRelationships(current)
      }
    }
  }
  return out
}
