import React from 'react';
import PropTypes from 'prop-types';

// TODO Will this be ok in the long run? Maybe this file should move into pages?
import { PageLoader } from '~/components';
import { useGraphQLService } from '../../services/graphql-service/graphql-service.js';

/**
 * You can wrap this component around a Connected page component to provide it
 * with top level config values that need to be retrieved from the GraphQL API.
 * It will render a PageLoader while those values are being retrieved.
 * @param {object} props
 * @param {string} [props.children] A function that will recieve the config and
 *   should return the children to render.
 */
export function WithAppConfig({
  children,
  ...rest
}) {
  const [config, setConfig] = React.useState();

  const api = useGraphQLService();

  React.useEffect(() => {
    // We don't do any error handling here because this is an unrecoverable
    // error and we want the error to bubble up to the global error view.
    // TODO Or should we customize the messaging to indicate that the app cannot
    // connect to the backend? Is that too much information for users?
    api.getAppConfig().then(c => setConfig(c));
  }, [api]);

  return !!config ? children(config) : <PageLoader id="WithAppConfig" />;
}

WithAppConfig.propTypes = {
  /**
   * The children to render once the AppConfig is loaded.
   */
  children: PropTypes.func.isRequired,
};

