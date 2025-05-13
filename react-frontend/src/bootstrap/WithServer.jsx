import React from 'react';

import {
  GraphQLService,
  GraphQLServiceProvider,
} from '~/services';
import { useServiceOptions } from '~/utils'

import { Main } from './Main.jsx';

/* istanbul ignore next: This will never be run in tests but may be imported */
function useGraphQLService({
  authResponse,
  onAuthFailure,
  exampleService,
  options,
}) {
  let clientCreationCount = React.useRef(0);
  return React.useMemo(() => {
    if (exampleService) {
      return exampleService
    } else if (authResponse?.token) {
      ++clientCreationCount.current
      if (clientCreationCount.current > 1) console.warn(`GraphQLService created ${clientCreationCount.current} times. This may or may not be an issue epending on your service implementation.`);
      return new GraphQLService({ onAuthFailure, authToken: authResponse?.token, options });
    } else {
      return undefined
    }
  }, [authResponse, onAuthFailure, exampleService, options])
}

/**
 * Render the application with live services.
 * @param {object} props
 * @param {*} [props.authResponse] - The response from the authentication service.
 * @param {function} [props.onLogout] - A callback function that will log the user out.
 * @param {function} [props.onAuthFailure] - A callback function to call when the user's
 *   session expires.
 * @param {object} [props.history] - Override the history object.
 * @param {...*} [rest] - Anything else you need to pass through to the main app.
 */
export default function WithServer({
  // Allow passing any services during testing
  exampleService,
  onAuthFailure,
  authResponse,
  ...rest
}) {
  // Merge URL query prameters with any factory options
  // passed in.
  const options = useServiceOptions();

  // Wrap the `Main` component in any API context providers...
  return (
    <GraphQLServiceProvider
      value={useGraphQLService({
        authResponse,
        onAuthFailure,
        exampleService,
        options
      })}
    >
      <Main {...rest} />
    </GraphQLServiceProvider>
  );
}

