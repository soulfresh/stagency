import {
  createSortIndex,
  generateDataSortIndexes,
  addDataSortIndexes,
} from './sort';

describe('utils/sort', () => {
  describe('createSortIndex', () => {
    it('should be able to create strings that would be sorted between two other strings.', () => {
      // Given two empty strings, treat the first as 'a'
      // and the second as 'b' and then find the letter
      // in between.
      expect(createSortIndex('', '')).toEqual('n');
      // With no parameters, it should pick the value in
      // the middle of the alphabet.
      expect(createSortIndex()).toEqual('n');
      expect(createSortIndex('a', 'z')).toEqual('n');
      expect(createSortIndex('a', 'c')).toEqual('b');
      // If there is no string between the two given strings,
      // add a new string one level deeper.
      expect(createSortIndex('a', 'b')).toEqual('an');
      // If the first string is a level deeper than the
      // second string, treat the second string's deepest
      // level as 'a' and create a match between the two.
      expect(createSortIndex('an', 'b')).toEqual('au');
      expect(createSortIndex('aaa', 'aac')).toEqual('aab');
      expect(createSortIndex('aaa', 'aab')).toEqual('aaan');
      // With only one parameter, it should pick the character
      // between that character and z
      expect(createSortIndex('a')).toEqual('n');
      // With only one parameter which is the last in the alphabet,
      // it should use the letter in the middle of the alphabet but
      // one level deeper.
      expect(createSortIndex('z')).toEqual('zn');
      expect(createSortIndex('waeokaawx')).toEqual('y');
    });
  });

  describe('generateDataSortIndexes', () => {
    it('should generate sort indexes for all objects in a compact manner.', () => {
      expect(generateDataSortIndexes([
        {foo: 'bar'},
        {foo: 'baz'},
        {foo: 'boz'},
      ])).toEqual([
        {foo: 'bar', sortOrder: 'a'},
        {foo: 'baz', sortOrder: 'b'},
        {foo: 'boz', sortOrder: 'c'},
      ]);
    });
  });

  describe('addDataSortIndexes', () => {
    it('should add sortOrder properties to any rows that need them.', () => {
      expect(addDataSortIndexes([
        {foo: 'bar', sortOrder: 'a'},
        {foo: 'baz'},
        {foo: 'boz', sortOrder: 'z'},
      ])).toEqual([
        {foo: 'bar', sortOrder: 'a'},
        {foo: 'baz', sortOrder: 'n'},
        {foo: 'boz', sortOrder: 'z'},
      ]);
    });
  });
});
