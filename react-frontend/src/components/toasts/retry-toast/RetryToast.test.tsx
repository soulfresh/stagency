import React from 'react';
import { render } from '~/test';

import { RetryToast } from './RetryToast';
import { RetryToastPO } from './RetryToast.page-object';

describe('RetryToast', function() {
  let component: typeof RetryToastPO;
  let onDismiss: () => void;

  beforeEach(() => {
    component = RetryToastPO({ testId: 'RetryToast' });
    onDismiss = jest.fn();
    render(
      <RetryToast
        data-testid="RetryToast"
        dismiss={onDismiss}
      />
    );
  });

  xit('should render.', async () => {
    await component.exists();
  });

  xit('should be able to accept the retry.', () => {});
  xit('should be able to cancel the retry.', () => {});
});

