import { replaceItems, replaceOrInsertItems } from './array';

describe('utils/array', () => {
  describe('replaceItems', () => {
    it('should replace items that already exist in an array.', () => {
      const input = [
        {id: 'a', name: 'A'},
        {id: 'c', name: 'C'},
        {id: 'e', name: 'E'},
        {id: 'z', name: 'Z'},
      ];
      const result = replaceItems(
        input,
        [
          {id: 'c', name: 'foo'},
          {id: 'e', name: 'bar'},
          {id: 'x', name: 'Bob'},
        ],
        (a, b) => a.id === b.id
      );

      expect(result).toEqual({
        updated: [
          {id: 'a', name: 'A'},
          {id: 'c', name: 'foo'},
          {id: 'e', name: 'bar'},
          {id: 'z', name: 'Z'},
        ],
        skipped: [{id: 'x', name: 'Bob'}]
      })
    });

    it('should not make any changes if it cannot find the items in the array.', () => {
      const input = [
        {id: 'a', name: 'A'},
        {id: 'c', name: 'C'},
        {id: 'e', name: 'E'},
        {id: 'z', name: 'Z'},
      ];
      const result = replaceItems(
        input,
        [
          {id: 'b', name: 'B'},
          {id: 'x', name: 'X'},
        ],
        (a, b) => a.id === b.id
      );

      expect(result).toEqual({
        updated: input,
        skipped: [
          {id: 'b', name: 'B'},
          {id: 'x', name: 'X'},
        ]
      })
    });
  });

  describe('replaceOrInsertItems', () => {
    it('should be able to replace items in a list and also insert missing items at the end of the list.', () => {
      const input = [
        {id: 'a', name: 'A'},
        {id: 'c', name: 'C'},
        {id: 'e', name: 'E'},
        {id: 'z', name: 'Z'},
      ];
      const result = replaceOrInsertItems(
        input,
        [
          {id: 'c', name: 'foo'},
          {id: 'e', name: 'bar'},
          {id: 'x', name: 'Bob'},
        ],
        (a, b) => a.id === b.id
      );

      expect(result).toEqual([
        {id: 'a', name: 'A'},
        {id: 'c', name: 'foo'},
        {id: 'e', name: 'bar'},
        {id: 'z', name: 'Z'},
        {id: 'x', name: 'Bob'},
      ]);
    });
  });
});
