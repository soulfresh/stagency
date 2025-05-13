import React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render as renderer } from '@testing-library/react';
import {
  GraphQLService,
  GraphQLServiceProvider,
  makeGraphQLErrorLink,
  makeGraphQLServiceCacheClient,
} from '~/services';
import {
  createGraphQLServiceMockClient,
} from '~/services/mocks';
import { TICKET_TYPES } from './fake';

import {
  Analytics,
  AnalyticsProvider,
} from '@thesoulfresh/react-tools';

export const RouterProvider = ({
  children,
  url,
  history,
}) => {
  if (!history) {
    const initialEntries = Array.isArray(url)
      ? url
      : url != null
      ? [url]
      : undefined;
    history = createMemoryHistory({
      initialEntries,
      initialIndex: 0,
    });
  }

  return (
    <Router history={history}>
      <Route
        render={props => {
          const next = {...props};
          // Remove the staticContext prop because that's currently
          // never used in the app. However, if we start using it,
          // we should find another way to prevent the error logs:
          // "React does not recognize the `staticContext` prop on a DOM element."
          delete next.staticContext;
          return React.cloneElement(children, next);
        }}
      />
    </Router>
  );
}

export function wrapWithRouter(
  component,
  url,
  history
) {
  return (
    <RouterProvider
      url={url}
      history={history}
    >
      {component}
    </RouterProvider>
  );
}

/**
 * @param {any} component
 * @param {object} [options]
 * @param {string} [options.url]
 * @param {string[]} [options.history] - List of URLs in history
 */
export function renderWithRouter(component, {url, history, ...rest} = {}) {
  return renderer(wrapWithRouter(component, url, history), rest);
}

export function wrapWithAnalytics(
  component,
  analytics = new Analytics({testMode: true, verbose: false}),
) {
  return (
    <AnalyticsProvider value={analytics}>
      { component }
    </AnalyticsProvider>
  );
}

/**
 * @param {any} component
 * @param {object} [options]
 * @param {object} [options.analytics] - The analytics service mock to use.
 */
export function renderWithAnalytics(component, {analytics, ...rest} = {}) {
  return renderer(wrapWithAnalytics(component, analytics), rest);
}

export function wrapWithRouterAndAnalytics(component, url, analytics) {
  return wrapWithRouter(
    wrapWithAnalytics(
      component,
      analytics,
    ),
    url
  );
}

/**
 * @param {React.ReactNode} component
 * @param {object} [options]
 * @param {boolean} [options.debug]
 * @param {object} [options.generatorOptions]
 * @param {object} [options.mocks]
 * @param {function} [options.onAuthFailure]
 * @param {object} [options.graphQLService]
 */
export function wrapWithGraphQLService(component, {
  debug,
  generatorOptions,
  mocks,
  onAuthFailure = () => {},
  graphQLService = new GraphQLService({
    client: createGraphQLServiceMockClient({
      errorLink: makeGraphQLErrorLink(onAuthFailure),
      cache: makeGraphQLServiceCacheClient(),
      mocks, // Extra mocks
      generatorOptions, // Generator options
      debug,
    }),
    debug,
  }),
} = {}) {
  // Mock the App Config request
  if (!jest.isMockFunction(graphQLService.getAppConfig)) {
    jest.spyOn(graphQLService, 'getAppConfig')
      .mockReturnValue(Promise.resolve({
        TICKET_TYPES,
      }));
  }

  return (
    <GraphQLServiceProvider value={graphQLService}>
      {component}
    </GraphQLServiceProvider>
  );
}

export function renderWithGraphQLService(component, options) {
  return renderer(wrapWithGraphQLService(component, options), options);
}

/**
 * @param {any} component
 * @param {object} [options]
 * @param {string} [options.url]
 * @param {string[]} [options.history] - List of URLs in history
 * @param {object} [options.analytics] - The analytics service mock to use.
 */
export function renderWithRouterAndAnalytics(component, {url, analytics, ...rest} = {}) {
  return renderer(wrapWithRouterAndAnalytics(component, url, analytics), rest)
}

export function wrapWithAllDependencies(component, store, url, analytics) {
  return wrapWithGraphQLService(
    wrapWithRouterAndAnalytics(component, url, analytics)
  )
}

/**
 * @param {any} component
 * @param {object} [options]
 * @param {object} [options.analytics] - The analytics service mock to use.
 */
export function renderWithAllDeps(component, {url, analytics, ...options} = {}) {
  return renderer(
    wrapWithGraphQLService(
      wrapWithRouterAndAnalytics(component, url, analytics),
      options
    ),
    options
  )
}

