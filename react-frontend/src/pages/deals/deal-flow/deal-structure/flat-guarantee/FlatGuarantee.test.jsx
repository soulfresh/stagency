import React from 'react';
import { render } from '@testing-library/react';

import { FlatGuarantee } from './FlatGuarantee.jsx';
import { FlatGuaranteePageObject } from './FlatGuarantee.page-object';

describe('FlatGuarantee', function() {
  let page;

  describe('without data', () => {
    beforeEach(() => {
      page = FlatGuaranteePageObject();
      render(
        <FlatGuarantee
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
