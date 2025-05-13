import { prepareNestedRelationships, collapseNestedRelationships } from './util'

describe('transform/util', () => {
  describe('prepareNestedRelationships', () => {
    describe('without relationships', () => {
      it('should be able to handle non-object values.', () => {
        expect(prepareNestedRelationships('foo')).toEqual('foo')
      })

      it('should just make a copy of the original object', () => {
        const original = {
          foo: 'foo',
          bar: 2,
          baz: null,
          boz: true,
        }
        const result = prepareNestedRelationships(original)

        expect(result).not.toBe(original)
        expect(result).toEqual(original)
      })
    })

    describe('with nested relationships', () => {
      it('should be able to handle direct child relationships.', () => {
        const original = {
          child: {
            prop: 'foo',
          },
        }
        const result = prepareNestedRelationships(original)

        expect(result).toEqual({
          ...original,
          child: expect.anything(),
        })

        expect(result.child).toEqual({
          data: original.child,
        })
      })

      it('should be able to handle sub relationships.', () => {
        const original = {
          child: {
            subChild: {
              prop: 'foo',
            },
          },
        }
        const result = prepareNestedRelationships(original)

        expect(result).toEqual({
          child: {
            data: {
              subChild: {
                data: original.child.subChild,
              },
            },
          },
        })
      })

      it('should be able to handle direct array relationships.', () => {
        const original = {
          list: [{ foo: 'a' }, { foo: 'b' }],
        }
        const result = prepareNestedRelationships(original)

        expect(result).toEqual({
          list: {
            data: original.list,
          },
        })
      })

      it('should be able to handle sub relationships inside of arrays.', () => {
        const original = {
          list: [
            {
              foo: {
                bar: 'bar',
              },
            },
          ],
        }
        const result = prepareNestedRelationships(original)

        expect(result).toEqual({
          list: {
            data: [
              {
                foo: {
                  data: original.list[0].foo,
                },
              },
            ],
          },
        })
      })
    })
  })

  describe('collapseNestedRelationships', () => {
    describe('without relationships', () => {
      it('should be able to handle non-object values.', () => {
        expect(collapseNestedRelationships('foo')).toEqual('foo')
      })

      it('should just copy the original.', () => {
        const original = {
          a: 'a',
          b: true,
          c: null,
          d: undefined,
          e: 7,
        }
        const result = collapseNestedRelationships(original)

        expect(result).toEqual(original)
        expect(result).not.toBe(original)
      })
    })

    describe('with nested relationships', () => {
      it('should be able to handle direct child relationships.', () => {
        const original = {
          child: {
            data: {
              foo: 'bar',
            },
          },
        }
        const result = collapseNestedRelationships(original)
        expect(result).toEqual({
          child: { foo: 'bar' },
        })
      })

      it('should be able to handle deep relationships.', () => {
        const original = {
          child: {
            data: {
              subChild: {
                data: {
                  foo: 'bar',
                },
              },
            },
          },
        }
        const result = collapseNestedRelationships(original)
        expect(result).toEqual({
          child: {
            subChild: { foo: 'bar' },
          },
        })
      })

      it('should be able to handle array relationships.', () => {
        const original = {
          list: {
            data: [{ foo: 'a' }, { bar: 'b' }],
          },
        }
        const result = collapseNestedRelationships(original)
        expect(result).toEqual({
          list: original.list.data,
        })
      })

      it('should be able to handle nested relationships in arrays.', () => {
        const original = {
          list: {
            data: [
              {
                child: {
                  data: {
                    foo: 'bar',
                  },
                },
              },
            ],
          },
        }
        const result = collapseNestedRelationships(original)
        expect(result).toEqual({
          list: [
            {
              child: {
                foo: 'bar',
              },
            },
          ],
        })
      })
    })
  })
})
