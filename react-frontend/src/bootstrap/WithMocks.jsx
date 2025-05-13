import React from 'react';

import {
  env,
} from '../env';
import {
  GraphQLService,
  GraphQLServiceProvider,
  makeGraphQLErrorLink,
  makeGraphQLServiceCacheClient,
} from '~/services';
import {
  createGraphQLServiceMockClient,
} from '~/services/mocks';
import { useServiceOptions } from '~/utils'

import { Main } from './Main.jsx';

function useGraphQLService({authResponse, onAuthFailure, exampleService, options}) {
  return React.useMemo(() => {
    if (exampleService) {
      // Use the mocked client if one was passed in.
      /* istanbul ignore next: It's not important how the report service is created during testing */
      return exampleService
    } else if (authResponse?.token) {
      // Generate a mock client if none was passed.
      /* istanbul ignore next: It's not important how the report service is created during testing */
      return new GraphQLService({
        client: createGraphQLServiceMockClient({
          errorLink: makeGraphQLErrorLink(onAuthFailure),
          cache: makeGraphQLServiceCacheClient(),
          mocks: {}, // Extra mocks
          generatorOptions: options, // Generator options
          debug: env.verbose,
        }),
        debug: env.verbose,
      })
    } else {
      return undefined
    }
  }, [authResponse, onAuthFailure, exampleService, options])
}

/**
 * Render the application with mock services.
 *
 * This component can be used directly in integration tests.
 *
 * @param {object} props
 * @param {object} [props.mockOptions] - Options that can be passed to
 *   mock service factories to configure how those services are mocked.
 * @param {*} [props.authResponse] - The response from the authentication service.
 * @param {function} [props.onLogout] - A callback function that will log the user out.
 * @param {function} [props.onAuthFailure] - A callback function to call when the user's
 *   session expires.
 * @param {object} [props.history] - Override the history object.
 * @param {...*} rest - Anything else you need to pass through to the main app.
 * @return {ReactElement}
 */
export default function WithMocks({
  mockOptions,
  // Allow passing services during testing...
  // xService,
  exampleService,
  onAuthFailure,
  authResponse,
  ...rest
}) {
  // Merge URL query prameters with any mock factory options
  // passed in.
  const options = useServiceOptions(mockOptions);

  // Construct service API clients here...

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
