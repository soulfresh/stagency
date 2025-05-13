import React from 'react';
import { render } from '@testing-library/react';

import { PercentageOfNet } from './PercentageOfNet.jsx';
import { PercentageOfNetPageObject } from './PercentageOfNet.page-object';

describe('PercentageOfNet', function() {
  let page;

  beforeEach(() => {
    page = PercentageOfNetPageObject();
  });

  describe('without data', () => {
    beforeEach(() => {
      render(
        <PercentageOfNet
        />
      );
    });

    it('should render the form.', async () => {
      await page.exists();
    });

    xit('should show empty fields.', () => {});

    describe('after making valid changes', () => {
      xit('should emit the form data.', () => {});
    });

    describe('after entering invalid data', () => {
      xit('should show an error.', () => {});
      xit('should not emit the current data.', () => {});

      describe('and then fixing the data', () => {
        xit('should remove the error messages.', () => {});
        xit('should emit the updated values.', () => {});
      });
    });
  });

  describe('with initial data', () => {
    xit('should show the initial form values.', () => {});
  });
});
