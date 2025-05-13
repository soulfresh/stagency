import React from 'react';
import { render } from '~/test';

import { Action } from '../buttons';
import { AreYouSure } from './AreYouSure';
// import { AreYouSurePO } from './AreYouSure.page-object';

describe('AreYouSure', function() {
  // let component: typeof AreYouSurePO;
  let onVerify: ReturnType<typeof jest.fn>;
  let onCancel: ReturnType<typeof jest.fn>;

  beforeEach(() => {
    // component = AreYouSurePO({ testId: 'AreYouSure' });

    onVerify = jest.fn();
    onCancel = jest.fn();

    render(
      <AreYouSure
        data-testid="AreYouSure"
        onVerify={onVerify}
        onCancel={onCancel}
      >
        <Action>Delete</Action>
      </AreYouSure>
    );
  });

  xit('should render the children.', () => {});
  describe('after clicking the Action', () => {
    xit('should show the Are You Sure dialog.', () => {});
    xit('should display the message and confirmation button text.', () => {});
    describe('and then clicking the confirmation button', () => {
      xit('should call the onVerify callback.', () => {});
    });
    describe('and then closing the dialog', () => {
      xit('should call the onCancel callback.', () => {});
    });
  })
});

