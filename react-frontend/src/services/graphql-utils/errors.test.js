import { graphQLErrorHandler, makeGraphQLErrorLink } from './errors'

describe('graphql-utils/errors', () => {
  describe('graphQLErrorHandler', () => {
    beforeEach(() => {
      // Silence console statements
      jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    it('should call the onAuthFailure callback on network authentication errors.', () => {
      const onAuthFailure = jest.fn()
      const networkError = { statusCode: 401 }

      graphQLErrorHandler({ onAuthFailure, networkError })

      expect(onAuthFailure).toHaveBeenCalledTimes(1)
    })

    it('should call the onAuthFailure callback on GraphQL authentication errors.', () => {
      const onAuthFailure = jest.fn()
      const graphQLErrors = [{ extensions: { code: 'UNAUTHENTICATED' } }]

      graphQLErrorHandler({ onAuthFailure, graphQLErrors })

      expect(onAuthFailure).toHaveBeenCalledTimes(1)
    })
  })

  describe('makeGraphQLErrorLink', () => {
    it('should return a link function.', () => {
      const onAuthFailure = jest.fn()

      const link = makeGraphQLErrorLink(onAuthFailure)
      expect(link).toEqual({ request: expect.any(Function) })
    })
  })
})
