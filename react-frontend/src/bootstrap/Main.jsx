import React from 'react';

import { Router } from './Router.jsx';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

import { ToastProvider } from '~/components';
import { useGraphQLService } from '~/services';
import { env } from '~/env';

import styles from './Main.module.scss';

/**
 * This is the main layout for your application.
 *
 * @param {object} props
 * @param {object} props.history - The history object to pass to ReactRouter.
 *   This can be an in memory history object during tests.
 * @param {*} [props.authResponse] - The response from the authentication service.
 * @param {function} [props.onLogout] - A callback function that will log the user out.
 * @param {function} [props.onAuthFailure] - A callback function to call when the user's
 *   session expires.
 * @param {object} [props.history] - Override the history object.
 * @param {...*} rest - Anything else you need to pass through to each page.
 * @return {ReactElement}
 */
export function Main({
  onLogout,
  ...rest
}) {
  const api = useGraphQLService();
  React.useEffect(() => {
    // Cache application config stored in GraphQL so it can be quickly loaded on
    // inner pages.
    api.getAppConfig().then(c => {
      if (env.verbose) console.debug('[Main] Retrieved App Config', c);
    });
  }, [api])

  return (
    <div data-testid="Main" className={styles.Main}>
      <Header onLogout={onLogout} />
      <Router {...rest} />
      <Footer />
      <ToastProvider />
    </div>
  );
}

