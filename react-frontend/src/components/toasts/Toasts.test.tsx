import React from 'react';
import { render } from '~/test';

import { Action } from '../buttons';
import { ActionPageObject } from '../buttons/page-objects';
import { toast, ToastProvider } from './Toasts';
import { ToastsPO } from './Toasts.page-object';

type ToastLevels = keyof typeof toast;

describe('Toasts', function() {
  let component: typeof ToastsPO;
  const message = "My toast message";

  (describe as any).each([
    'success',
    'warn',
    'error'
  ])('%s', (level: ToastLevels) => {

    beforeEach(async () => {
      component = ToastsPO();
      render(
        <>
          <Action onClick={() => toast[level](message)}>Click</Action>
          <ToastProvider />
        </>
      );

      await ActionPageObject('Click').click()
    });

    xit('should render.', async () => {
      // TODO This is failing because the toast wrapper stays at opacity: 0.
      // Will need to figure out how to get it to become visible in the test
      // environment.
      await component.exists();
    });

    xit('should show the message.', () => {});
    xit('should be able to hide the icon.', () => {});
    xit('should be able to set the duration using one of the duration names.', () => {});
    xit('should be able to close the toast.', () => {});
  });

});

