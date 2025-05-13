import deepmerge from 'deepmerge';

// Merge arrays by index...
// If a[index] is empty, put the b[index] there
// If b[index] is an object, merge it with a[index]
// Otherwise, replace a[index] with b[index]
const combineMerge = (target, source, options) => {
  const destination = target.slice();

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
    } else if (options.isMergeableObject(item)) {
      destination[index] = merge(target[index], item, options);
    } else {
      destination[index] = item;
    }
  })
  return destination;
}

// Merge arrays by a hybrid of combineMerge and concating.
// So if objects are encountered in b, merge a and b;
// but if b[index] is a value, add it to the end of the array.
//
// If a[index] is empty, put the b[index] there
// If b[index] is an object, merge it with a[index]
// Otherwise, add b[index] to the end of the output
const combineHybrid = (target, source, options) => {
  const destination = target.slice();

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
    // TODO This should be searching for the object.
    } else if (options.isMergeableObject(item)) {
      destination[index] = merge(target[index], item, options);
    } else if (target.indexOf(item) === -1) {
      destination.push(item);
    }
  })
  return destination;
}

// Merge arrays by replacing the left side with the right side.
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;

/**
 * Alias for `deepmerge` library but handles falsy
 * values for `a` or `b` (ie. if a or b are null,
 * a copy of the other object is returned).
 * @param {*} a
 * @param {*} b - Properties on b overwrite those on a
 * @param {object} [options]
 * @return {*} Will return the same type as the inputs.
 */
export function merge(a, b, options) {
  if (!b) return copy(a);
  else if (!a) return copy(b);
  else return deepmerge(a, b, options);
}

/**
 * Make a deep copy of an object.
 * @param {object} a - The object to copy.
 */
export function copy(a) {
  if (!a) return {};
  else return deepmerge({}, a);
}

/**
 * Merge arrays using Array.concat. Elements in
 * `b` will appear after the elements in `a`.
 * @param {*} a
 * @param {*} b - The properties on b overwrite those on a.
 * @return {*} Will return the same type as the inputs.
 */
export function mergeConcat(a, b) {
  return merge(a, b);
}

/**
 * Merge arrays by replacing the array on `a`
 * with the array on `b`.
 * @param {*} a
 * @param {*} b - The properties on b overwrite those on a.
 * @return {*} Will return the same type as the inputs.
 */
export function mergeReplace(a, b) {
  return merge(a, b, {
    arrayMerge: overwriteMerge,
  });
}

/**
 * Merge arrays by merging elements at the same
 * index. For example, if element 0 is an object
 * in both arrays, those objects will get merged
 * together.
 * @param {*} a
 * @param {*} b - The properties on b overwrite those on a.
 * @return {*} Will return the same type as the inputs.
 */
export function mergeCombine(a, b) {
  return merge(a, b, {
    arrayMerge: combineMerge,
  });
}

/**
 * Merge arrays by merging objects that exist in b
 * with the item at the same index in a. However,
 * if b[index] is not an object, push b[index] to the
 * end of the array instead. This is the default
 * from deepmerge v1.
 * @param {*} a
 * @param {*} b - The properties on b overwrite those on a.
 * @return {*} Will return the same type as the inputs.
 */
export function mergeHybrid(a, b) {
  return merge(a, b, {
    arrayMerge: combineHybrid,
  });
}

