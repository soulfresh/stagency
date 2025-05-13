import React from 'react';
import { createMemoryHistory } from 'history';

import { renderWithAllDeps, ResizeObserver } from '~/test';
import { HTMLPageObject as HTML } from '~/test';
import { AuthServiceMock, createGraphQLServiceMockClient } from '~/services/mocks';
import { GraphQLService } from '~/services';

import WithServer from './WithServer.jsx';

describe('WithServer', () => {
  let authService, exampleService, history;

  beforeEach(() => {
    authService = new AuthServiceMock(true, true);
    exampleService = new GraphQLService({
      client: createGraphQLServiceMockClient(),
      debug: false,
    })
    history = createMemoryHistory({
      initialEntries: ['/'],
      initialIndex: 0,
    });
  });

  describe('by default', () => {
    beforeEach(() => {
      renderWithAllDeps(
        <WithServer
          authService={authService}
          exampleService={exampleService}
          history={history}
          ResizeObserver={ResizeObserver}
        />
      );
    });

    it('should render the home page.', async () => {
      await HTML({testId: 'Deals'}).exists();
    });
  });

  // TODO These should be implemented once you've
  // introduced your service APIs. Ideally, there should
  // be tests to verify that the desired error message/page
  // is displayed when a service failure will be fatal
  // and the user will not be able to continue.
  describe('after an auth error', () => {
    xit('should call the onAuthFailure callback.', () => {});
  });

  describe('after a server error', () => {
    xit('should render the not found page.', () => {});
    xit('should not call the onAuthFailure callback.', () => {});
  });
});

