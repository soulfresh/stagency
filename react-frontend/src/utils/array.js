
/**
 * Get a new array with one or more items replaced. The return from this
 * function is an object with `updated` and `skipped` properties. `updated` is
 * your new list with the replaced items. `skipped` is a list of any items that
 * could not be replaced.
 *
 * Usage example:
 *
 * ```js
 * const {updated, skipped} = replaceItems(myList, itemsToReplace, (a,b) => a.id === b.id);
 * console.log('Your updated list:', updated);
 * console.log('Could not replace these items:', skipped);
 * ```
 *
 * @param {any[]} list - The target list to replace items in.
 * @param {any} items - Either a single object to replace or a list of multiple
 * objects to replace.
 * @param {(any, any) => boolean} compare - A function used to determine if each
 * item in `items` exists in `list`. Called with the item in `list` and then the
 * item in `items`.
 * @return {{updated: any[], skipped: any[]}} The new updated array and the list
 * of skipped items.
 */
export function replaceItems(list, items, compare) {
  const updated = [...list];
  const skipped = [];
  if (!Array.isArray(items)) items = [items];
  items.forEach(item => {
    const index = updated.findIndex(x => compare(x, item));
    // If it was found, replace it.
    if (index > -1) {
      updated.splice(index, 1, item);
    }
    // Otherwise, add it to the end.
    else {
      skipped.push(item);
    }
  });
  return {updated, skipped};
}

/**
 * Get a new array with one or more items replaced. If items aren't found, they
 * will be added to the end of the list.
 * @param {any[]} list - The target list to replace items in.
 * @param {any} items - Either a single object to replace or a list of multiple
 * objects to replace.
 * @param {(any, any) => boolean} compare - A function used to determine if each
 * item in `items` exists in `list`. Called with the item in `list` and then the
 * item in `items`.
 * @return {any[]} The new array with items replaced.
 */
export function replaceOrInsertItems(list, items, compare) {
  const {updated, skipped} = replaceItems(list, items, compare);
  // Just add the skipped items to the end of the list.
  return updated.concat(skipped);
}
