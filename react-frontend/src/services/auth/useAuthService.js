import React from 'react'
import { useProcessEvent } from '@thesoulfresh/react-tools'

import { env } from '~/env'
import { AuthService } from './AuthService'
// import { AuthMock as AuthService } from './mocks'

/**
 * This hook stores the user's authenticated state and provides
 * login, logout and forgot login callbacks. Internally it uses
 * an auth service to perform the authentication steps.
 *
 * @param {*} [authService] - overrides the default auth service instance.
 */
export function useAuthService(authService, debug = env.verbose) {
  const handleEvent = useProcessEvent()

  // Either use the auth service provided (for testing)
  // or generate one that gets reused between calls.
  const [service] = React.useState(() => {
    if (authService) return authService;
    else {
      if (debug) console.log('Generating new AuthService');
      return new AuthService();
    }
  });

  const [state, _setState] = React.useState({
    // Whether this render is the startup render where
    // we are determining the user's auth state for
    // the first time.
    startup: true,
    // Whether the user has been authenticated at least
    // once during the session. The main app bundle will
    // not be loaded until this flag is set to true.
    //
    // IMPORTANT: This should be reset to false when the
    // user explicitly logs out. This way the application
    // state will be fully refreshed on the next login
    // ensuring that the first user's data is never exposed
    // to the next user.
    initialized: false,
    // Whether the authentication service is currently working
    // to authenticate the user. When this flag is true,
    // the page loader is shown.
    loading: true,
    // This can be user data or whatever you get back from
    // your authentication service.
    authResponse: undefined,
  });

  // Duplicate the loading state using a Ref so we don't
  // need to regenerate the public callbacks whenever the
  // loading state changes.
  const internalLoadingState = React.useRef(state.loading)
  const setState = (s) => {
    internalLoadingState.current = s.loading;
    _setState(old => ({
      ...old,
      ...s,
    }))
  }

  const handleLogin = handleEvent((response) => {
    if (response) {
      setState({
        authResponse: response,
        // We have been authenticated at least once now.
        initialized: true,
        loading: false,
      })
    } else {
      setState({
        authResponse: null,
        loading: false,
      });
    }
  })

  const handleLogout = handleEvent(() => {
    setState({
      // Clear the auth data.
      authResponse: null,
      // Ensure that the initialized state is reset so that
      // no state is leaked to the next user.
      initialized: false,
    });
  })

  const onLogout = React.useCallback(async () => {
    if (!internalLoadingState.current) {
      // Show the login screen immediately.
      handleLogout()
      setState({
        loading: true,
      });

      try {
        await service.logout()
      } catch (e) {
        /* istanbul ignore next: Logs are skipped during testing */
        if (debug) console.debug('[useAuthService] Logout request failed', e)
      }
      setState({
        loading: false,
      });
    } else {
      throw new Error(
        'Cannot call onLogout while another authentication state is loading.',
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, debug])

  const onLogin = React.useCallback(
    async (...args) => {
      if (!internalLoadingState.current) {
        setState({
          loading: true,
        });

        let response
        try {
          // FYI, the loading state is not managed in this
          // function because it is dependent on the design of the login
          // page so it needs to be the Login page's responsibility.
          response = await service.login(...args)
        } catch (e) {
          // For now we'll catch the error here and continue normally
          // because that will turn off the loading indicator and will
          // show the login button again. If we decide to show custom
          // messages for certain errors, we'll need to allow the error
          // to bubble up further.
          /* istanbul ignore next: Logs are skipped during testing */
          if (debug) console.log('[useAuthService] Login failed', e)
        }

        handleLogin(response)
        return response
      } else {
        throw new Error(
          'Cannot call onLogin while another authentication state is loading.',
        )
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [service, debug],
  )

  // Lisen to login events
  React.useEffect(() => {
    service.addEventListener('login', handleLogin)
    return () => service.removeEventListener(handleLogin)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service])

  // Listen to logout events
  React.useEffect(() => {
    service.addEventListener('logout', handleLogout)
    return () => service.removeEventListener('logout', handleLogout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service])

  // This is similar to `onLogin` but should be used when
  // the user's session expires.
  // This function should NOT flip the initialized
  // flag because that will cause the main app bundle to be
  // reloaded.
  const onRefreshLogin = React.useCallback(
    async (...args) => {
      if (!internalLoadingState.current) {
        setState({
          // Clear the auth flag immediately
          authResponse: null,
          loading: true,
        });

        let response
        try {
          response = await service.login(...args)
        } catch (e) {
          /* istanbul ignore next: Logs are skipped during testing */
          if (debug)
            console.debug('[useAuthService] onRefreshLogin login request failed', e)
        }

        if (response) {
          setState({
            authResponse: response,
            loading: false,
          });
        } else {
          // FYI Do NOT flip the `initialized` flag here.
          setState({
            authResponse: null,
            loading: false,
          });
        }

        return response
      } else {
        throw new Error(
          'Cannot call onRefreshLogin while another authentication state is loading.',
        )
      }
    },
    [service, debug],
  )

  // Do whatever is necessary to get the user's
  // initial authenticated state.
  React.useEffect(() => {
    service
      .authenticate()
      .then((response) => {
        // If the user is authenticated, set the correct state
        // so the app removes the login window and shows the
        // main app.
        // eslint-disable-next-line brace-style
        if (response) {
          setState({
            authResponse: response,
            startup: false,
            loading: false,
            initialized: true,
          });
        } else {
          // If the user is not authenticated, ensure that
          // the login page is shown and the loader is removed.
          // Allow the existing initialized state to persist
          // unless you specifically want to reset the
          // full application state.
          setState({
            authResponse: null,
            startup: false,
            loading: false,
          });
        }
      })
      .catch(() => {
        setState({
          authResponse: null,
          startup: false,
          loading: false,
        });
        /* istanbul ignore next: Logs are skipped during testing */
        if (debug) console.debug('[useAuthService] User is logged out')
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Here we use the presence of auth response data
  // to indicate whether the user is currently authenticated
  // but this will vary based on your needs.
  const authenticated = !!state.authResponse
  // const authenticated = !!authResponse

  // How you implement authentication is up to you but
  // the following API is expected.
  return {
    ...state,
    // Whether the user is currently authenticated. When
    // this flag is false, the login screen is shown.
    authenticated,
    // A function to log the user out.
    onLogout,
    // A function to log the user in.
    onLogin,
    // A function to refresh the authenticated state of the user
    // without toggling the `initialized` flag. When using
    // the LoginOverlay component, using this function allows
    // you to maintain the application state during the re-authentication
    // process.
    onRefreshLogin,
  }
}
