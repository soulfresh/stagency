import { onError } from '@apollo/client/link/error'

/**
 * A global error handler used to handle GraphQL errors
 * before they are dispatched to individual GraphQL query
 * handlers. This method is called for each error with
 * parameters describing any GraphQL or network errors.
 */
export function graphQLErrorHandler({
  /**
   * A callback to handle authentication failures. This can
   * be used to refresh the auth token.
   */
  onAuthFailure,
  /**
   * The list of GraphQL errors from the Apollo client.
   */
  graphQLErrors,
  /**
   * Any network errors from the Apollo client.
   */
  networkError,
}) {
  if (graphQLErrors) {
    console.error('[GRAPHQL ERROR]:', graphQLErrors)
    for (let err of graphQLErrors) {
      if (err.extensions) {
        switch (err.extensions.code) {
          case 'UNAUTHENTICATED':
          case 'invalid-jwt':
            onAuthFailure()

          // TODO After login, modify the operation context with
          // the new auth token and then retry the operation.
          // const oldHeaders = operation.getContext().headers;
          // operation.setContext({
          //   headers: {
          //     ...oldHeaders,
          //     authorization: getNewToken(),
          //   },
          // });
          // return forward(operation);
        }
      }
    }
  } else if (networkError) {
    console.error('[Network error]:', networkError)
    if (
      networkError.statusCode &&
      networkError.statusCode === 401
    ) {
      onAuthFailure()

      // TODO After login, modify the operation context with
      // the new auth token and then retry the operation.
    }
  }
}

/**
 * Make an apollo-link-error instance that is configured to use the
 * global error handler.
 */
/* istanbul ignore next: Difficult to test */
export function makeGraphQLErrorLink(
  /**
   * A callback used when the error is an authentication failure.
   * Use this to refresh the authentication token or ask the user
   * to login.
   */
  onAuthFailure,
) {
  return onError((error) => graphQLErrorHandler({ ...error, onAuthFailure }))
}
