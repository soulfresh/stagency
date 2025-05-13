import {
  mergeReplace,
  mergeCombine,
} from './merge';

describe('util/merge', () => {
  let objectArrayA, objectArrayB, stringArrayA, stringArrayB;
  let stringArrayResult, objectArrayResult;

  beforeEach(() => {
    stringArrayA = ['cat', 'dog', 'bear'];
    stringArrayB = ['apple', 'orange'];
    objectArrayA = [
      {name: 'cat' , hunger: 1, fuzz: 'soft'},
      {name: 'dog' , hunger: 3, fuzz: 'short'},
      {name: 'bear', hunger: 7, fuzz: 'rough'},
    ];
    objectArrayB = [
      {name: 'orange' , hunger: 0 , type: 'fruit'},
      {name: 'dog'    , hunger: 2 , type: 'animal'},
      {name: 'bear'   , hunger: 8},
    ];
  });

  describe('copy', () => { });
  describe('mergeConcat', () => { });

  describe('mergeReplace', () => {
    beforeEach(() => {
      stringArrayResult = stringArrayB;
      objectArrayResult = objectArrayB;
    });

    describe('with a list of strings', () => {
      it('should replace a with b.', () => {
        const result = mergeReplace(stringArrayA, stringArrayB);
        expect(result).toEqual(stringArrayB);
      });
    });

    describe('with a list of objects', () => {
      it('should combine the objects in the array.', () => {
        const result = mergeReplace(objectArrayA, objectArrayB);
        expect(result).toEqual(objectArrayB);
      });
    });

    describe('with two objects', () => {
      it('should replace left side properties with the right side.', () => {
        const result = mergeReplace(
          {shape: 'square'  , stringList: stringArrayA, other: 'foo'},
          {shape: 'triangle', stringList: stringArrayB }
        );
        expect(result).toEqual({
          shape: 'triangle',
          stringList: stringArrayB,
          other: 'foo',
        });
      });
    });
  });

  describe('mergeCombine', () => {
    beforeEach(() => {
      stringArrayResult = ['apple', 'orange', 'bear'];
      objectArrayResult = [
        {name: 'orange' , hunger: 0 , fuzz: 'soft' , type: 'fruit'},
        {name: 'dog'    , hunger: 2 , fuzz: 'short' , type: 'animal'},
        {name: 'bear'   , hunger: 8 , fuzz: 'rough'},
      ];
    });

    describe('with a list of strings', () => {
      it('should merge the two string arrays.', () => {
        const result = mergeCombine(stringArrayA, stringArrayB);
        expect(result).toEqual(stringArrayResult);
      });
    });

    describe('with a list of objects', () => {
      it('should combine the objects in the array.', () => {
        const result = mergeCombine(objectArrayA, objectArrayB);
        expect(result).toEqual(objectArrayResult);
      });
    });

    describe('with two objects', () => {
      it('should replace left side properties with the right side.', () => {
        const result = mergeCombine(
          {shape: 'square'  , stringList: stringArrayA, other: 'foo'},
          {shape: 'triangle', stringList: stringArrayB }
        );
        expect(result).toEqual({
          shape: 'triangle',
          stringList: stringArrayResult,
          other: 'foo',
        });
      });
    });
  });
});
