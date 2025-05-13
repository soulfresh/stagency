import React from 'react';

import { Analytics, AnalyticsProvider } from '@thesoulfresh/react-tools';

// Import the following components directly so we don't accidentally
// import anything unnecessary.
import { LoginConnected } from './pages/login/Login.jsx';
import { PageLoader } from './components/loader/PageLoader.jsx';
import { LoaderServiceProvider, LoaderService } from './components/loader/loader.service';
import { env } from './env';
import { useAuthService } from './services/auth';

env.log();

// Lazy load the main App bundle so it's not required
// for login.
// Also, create two separate bundles so we don't bloat
// the production app with mock data.
const Main = env.mock
  ? React.lazy(() => import('./bootstrap/WithMocks.jsx'))
  : React.lazy(() => import('./bootstrap/WithServer.jsx'));

/**
 * Display the login page as an overlay above the main application
 * bundle.
 *
 * @param {object} props
 * @param {boolean} [props.loading] - Whether the authentication mechanism is
 *   currently running
 * @param {boolean} [props.authenticated] - Whether the user is authenticated.
 * @param {*} [props.authResponse] - The response from the authentication service.
 * @param {function} [props.onLogin] - A callback function to authenticate the user.
 * @param {function} [props.onForgotLogin] - A callback for when the user needs
 *   help signing in (ex. send a forgot password email or sms).
 * @param {function} [props.onLogout] - A callback function that will log the user out.
 * @param {function} [props.onAuthFailure] - A callback function to call when the user's
 *   session expires.
 * @param {object} [props.history] - Override the history object.
 * @return {React.ReactElement}
 */
export function LoginOverlay({
  loading, // trap this so it's not passed to the Main component.
  initialized,
  authenticated,
  onLogin,
  onForgotLogin,
  ...rest
}) {
  return (
    <>
      {!authenticated &&
        <LoginConnected onLogin={onLogin} onForgotLogin={onForgotLogin} />
      }
      {initialized &&
        <React.Suspense fallback={<PageLoader id="App.LoginOverlay" />}>
          <Main {...rest} />
        </React.Suspense>
      }
    </>
  );
}


/**
 * The root of the application. It will render either:
 * 1) The page loader embedded in the HTML page while trying
 *    determine if the users is already authenticated.
 * 2) The login page if the user is not yet authenticated.
 * 3) Either the mock or live application bundles depending on
 *    the type of build.
 *
 * By providing the authentication functionality at this level,
 * we minimize the size of the initial bundle in the case that
 * the user needs to authenticate.
 *
 * The login page is rendered as an overlay on top of
 * the main app bundle. This has the advantage that the application state is
 * maintained if the user's authenticated state changes during
 * their session. For example, if their session times out
 * and a service requests returns a 401, the main application
 * state will be maintained while the user logs back in
 * through the login overlay.
 *
 * @param {object} props
 * @param {object} [props.authService] - Override the auth service.
 *   This is useful during testing or rendering the mock version of
 *   the app.
 * @return {React.ReactElement}
 */
export default function App({
  verbose = env.verbose,
  // Any services can be provided to the application
  // through props
  authService,
  analyticsService,
  ...rest
}) {
  const auth = useAuthService(authService);

  const analyticsClient = React.useMemo(
    () => analyticsService || new Analytics(env.analyticsId, {debug: env.verbose, testMode: env.test}),
    [analyticsService]
  );

  if (verbose) {
    console.groupCollapsed('Authentication State: loading?', auth.loading, 'authenticated?', auth.authenticated);
    console.log('Starting Up?', auth.startup)
    console.log('Auth is initialized?', auth.initialized)
    console.log('User is authenticated?', auth.authenticated)
    console.log('Auth is loading?', auth.loading)
    console.log('Auth Response:', auth.authResponse)
    console.groupEnd();
  }

  const props = {
    ...auth,
    ...rest,
    // Use this callback to handle the case that the user
    // made a request and their authentication is no longer
    // valid. By default, this will simply log out the user
    // but you may need to handle this differently based on
    // your authentication mechanism.
    onAuthFailure: auth.onLogout,
  };

  return (
    <LoaderServiceProvider value={new LoaderService()}>
      <AnalyticsProvider value={analyticsClient}>
        {auth.startup &&
          // While we are in the process of determining if the
          // user was previously authenticated, show the
          // loader embedded in the index.html.
          <PageLoader immediate={false} id="App" autoStop={false} />
        }
        <LoginOverlay {...props} />
      </AnalyticsProvider>
    </LoaderServiceProvider>
  );
}

