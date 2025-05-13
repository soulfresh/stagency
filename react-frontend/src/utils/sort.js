/**
 * Generate a unique id for elements in a sortable list
 * that can be guaranteed to be alpha sorted between the
 * two other ids without conflict. This algoritm ensures
 * that we can generate sort indexes for elements in a list
 * without having to update the sort index of other items
 * in the list when an item is moved or removed.
 *
 * In more detail, given two strings, generate a new string that can be
 * considered to be "between" the given strings. If there
 * is no string (character) that can be placed between them,
 * add a new character to the end of the first string to
 * create a "substring" that is considered between the given strings.
 * This will result in strings that can easily be sorted
 * using standard alphanumeric sorting using `Array.sort()`.
 *
 * For example:
 * a, c = b
 * a, b = an
 * aa, ac = ab
 * aa, ab = aan
 *
 * See the tests for more examples.
 *
 * Taken from:
 * https://stackoverflow.com/questions/38923376/return-a-new-string-that-sorts-between-two-given-strings/38927158#38927158
 *
 * @param {string} prev - The lower sort index.
 * @param {string} next - The higher sort index. This must be
 *   considered greater than the `prev` parameter in an
 *   alphanumeric sort. For example, if `prev = 'a'`, then
 *   next must be "aa" or greater ("b" would be considered
 *   greater than "aa" so would also work).
 * @return {string} A string that will be alpha sorted
 * between `prev` and `next`.
 */
export function createSortIndex(prev = '', next = '') {
  var p, n, pos, str;
  // eslint-disable-next-line
  for (pos = 0; p == n; pos++) {
    // find leftmost non-matching character
    p = pos < prev.length ? prev.charCodeAt(pos) : 96;
    n = pos < next.length ? next.charCodeAt(pos) : 123;
  }
  // copy identical part of string
  str = prev.slice(0, pos - 1);

  // prev string equals beginning of next
  // eslint-disable-next-line
  if (p == 96) {
    // next character is 'a'
    // eslint-disable-next-line
    while (n == 97) {
      // get char from next
      n = pos < next.length ? next.charCodeAt(pos++) : 123;
      // insert an 'a' to match the 'a'
      str += 'a';
    }

    // next character is 'b'
    // eslint-disable-next-line
    if (n == 98) {
      // insert an 'a' to match the 'b'
      str += 'a';
      // set to end of alphabet
      n = 123;
    }
  }
  // found consecutive characters
  // eslint-disable-next-line
  else if (p + 1 == n) {
    // insert character from prev
    str += String.fromCharCode(p);
    // set to end of alphabet
    n = 123;
    // p='z'
    // eslint-disable-next-line
    while ((p = pos < prev.length ? prev.charCodeAt(pos++) : 96) == 122) {
      // insert 'z' to match 'z'
      str += 'z';
    }
  }
  // append middle character
  return str + String.fromCharCode(Math.ceil((p + n) / 2));
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const addLetters = (letter, count) => {
  let out = '';
  for (let i = 0; i < count; i++) {
    out += letter;
  }
  return out;
};

/**
 * Given a list of objects, give each object has a `sortOrder`
 * property in the most compact manner possible. This will override
 * any exisiting `sortOrder` properties.
 * a, aa, aaa, b, bb, bbb, c, cc, ccc, etc.
 * @param {object[]} data - The list of objects to receive a `sortOrder`.
 * @return {object[]} A copy of data with sort indexes.
 */
export function generateDataSortIndexes(data) {
  const depth = Math.ceil(data.length / alphabet.length);
  return data.map((d, i) => {
    const letterCount = (i % depth) + 1;
    const letterIndex = Math.floor(i / depth);
    return {
      ...d,
      sortOrder: addLetters(alphabet[letterIndex], letterCount),
    };
  });
}

/**
 * Given a list of objects, ensure each object has a `sortOrder`
 * property using the `createSortIndex` function. This will check
 * the `sortOrder` of the previous and next object for each item
 * in the list and set the `sortOrder` to a letter in between them.
 * It will only modify objects that do not have a `sortOrder` set.
 * It also does not sort the objects before working on the list.
 * This funtion modifies the list in place.
 * @param {object[]} data - The list of objects to receive a `sortOrder`.
 * @return {object[]} Returns the original list back to you.
 */
export function addDataSortIndexes(rowData) {
  const data = [];
  rowData.forEach((d, i) => {
    const out = {...d};
    if (!out.sortOrder) {
      const prev = i > 0 ? data[i - 1]?.sortOrder : '';
      const next = i + 1 < rowData.length ? rowData[i + 1]?.sortOrder : '';
      out.sortOrder = createSortIndex(prev, next);
    }
    data.push(out);
  });
  return data;
}

