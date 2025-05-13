import React from 'react';
import { render } from '@testing-library/react';

import { ResizeObserver } from '~/test';
import { DealStructure } from './DealStructure.jsx';
import { DealStructurePageObject } from './DealStructure.page-object';

describe('DealStructure', function() {
  let page, onChange;

  describe('with an empty deal', () => {
    beforeEach(() => {
      onChange = jest.fn();

      page = DealStructurePageObject();
      render(
        <DealStructure
          onChange={onChange}
          ResizeObserver={ResizeObserver}
        />
      );
    });

    it('should render', async () => {
      await page.exists();
    });

    it('should render the deal structure select.', async () => {
      await page.has({dealType: 'Select a deal structure'});
      await page.has({dealSelected: false});
    });

    it('should not show any of the deal forms.', async () => {
      await page.is({showingPercentOfNetForm: false});
      await page.is({showingFlatGuaranteeForm: false});
      await page.is({showingPromoterProfitForm: false});
    });

    describe('after selecting a deal structure', () => {
      beforeEach(async () => {
        await page.selectDealStructure('Percentage of Net');
        // Make sure the form loads before proceeding.
        await page.is({showingPercentOfNetForm: true});
      })

      it('should show the correct deal structure form.', async () => {
        await page.is({showingPercentOfNetForm: true});
      });

      it('should not have called onChange.', () => {
        expect(onChange).not.toHaveBeenCalled();
      });

      describe('and filling in the form', () => {
        xit('should should call the onChange event.', () => {});
      });
    });
  });

  describe('with an existing deal', () => {
    xit('should set the expected deal data.', () => {});
  });
});
