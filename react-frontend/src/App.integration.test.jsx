import React from 'react';
import { render, act } from '@testing-library/react';

import { AuthServiceMock, generateAuth } from './services/auth/mocks';
import { createGraphQLServiceMockClient } from './services/mocks';
import {
  GraphQLService,
} from './services';
import { HTMLPageObject as HTML, waitFor, Button, waitForPromise, ResizeObserver } from './test';

import App from './App.jsx';


describe('App', () => {
  let authService, user, exampleService;

  beforeEach(() => {
    user = generateAuth.user();

    exampleService = new GraphQLService({
      client: createGraphQLServiceMockClient(),
      debug: false,
    });
  });

  describe('using the login overlay functionality', () => {
    describe('initially logged in', () => {
      beforeEach(async () => {
        authService = new AuthServiceMock(true, true, user);

        render(
          <App
            authService={authService}
            exampleService={exampleService}
            verbose={false}
            ResizeObserver={ResizeObserver}
          />
        );

        await act(async () => {
          await HTML({testId: 'Main'}).exists();
        });
      });

      it('should render the main app.', async () => {
        await HTML({testId: 'Main'}).exists();
      });

      it('should not render the login page.', async () => {
        await HTML({testId: 'Login'}).absent();
      });
    });

    describe('initially logged out', () => {
      beforeEach(async () => {
        authService = new AuthServiceMock(false, true, user);

        let promise;
        const orig = authService.authenticate;
        jest.spyOn(authService, 'authenticate')
          .mockImplementation(() => promise = orig.call(authService))

        render(
          <App
            authService={authService}
            exampleService={exampleService}
            verbose={false}
            ResizeObserver={ResizeObserver}
          />
        );

        // We have to wait for authService.authenticate to be called.
        await waitFor(() => expect(promise).toBeDefined())

        await act(async () => {
          // Wait for the authentication test to finish.
          await waitForPromise(promise);
        });
      });

      it('should render the login page.', async () => {
        await HTML({testId: 'Login'}).exists();
      });

      it('should not bootstrap the main app yet.', async () => {
        await HTML({testId: 'Main'}).absent();
      });

      describe('after login', () => {
        beforeEach(async () => {
          await act(async () => {
            await Button('Login').click();
            await HTML({testId: 'Main'}).exists();
          });
        });

        it('should render the main app.', async () => {
          await HTML({testId: 'Main'}).exists();
        });

        it('should remove the login page.', async () => {
          await HTML({testId: 'Login'}).absent();
        });

        // TODO Implement these tests once your application has
        // implemented a service that could fail if the session
        // times out.
        describe('and the users session expires', () => {
          beforeEach(() => {
            // 1. Setup a service mock that will fail with an auth error.
            // 2. Perform an action that will trigger the service to fail.
          });

          xit('should render the login page.', () => {});
          xit('should retain the main app.', () => {});
        });

        describe('and then logging out', () => {
          beforeEach(async () => {
            await act(async () => {
              await Button('Logout').click();
              await HTML({testId: 'Login'}).exists();
            });
          });

          it('should render the login overlay.', async () => {
            await HTML({testId: 'Login'}).exists();
          });

          // In this case, we want to ensure that the state
          // is completely recreated so we don't accidentally
          // reveal the previous user data to the next user.
          it('should remove the main app entirely.', async () => {
            await HTML({testId: 'Main'}).absent();
          });
        });
      });
    });
  });
});

