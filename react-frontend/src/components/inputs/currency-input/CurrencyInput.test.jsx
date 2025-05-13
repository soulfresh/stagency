import React from 'react';
import { render } from '@testing-library/react';

import { InputPageObject } from '../Input.page-object.js';
import { CurrencyInput } from './CurrencyInput.jsx';

describe('CurrencyInput', function() {
  let page;
  const value = 2020;

  beforeEach(() => {
    page = InputPageObject();
  });

  describe('by default', () => {
    beforeEach(() => {
      render(
        <CurrencyInput value={value} currency="USD" />
      );
    });

    it('should render the formatted value.', async () => {
      await page.exists();
      await page.has({value: '$20.20'});
    });
  });

  describe('clearable', () => {
    beforeEach(() => {
      render(
        <CurrencyInput defaultValue={value} currency="USD" clearable />
      );
    });

    it('should be able to clear the input value.', async () => {
      await page.has({value: '$20.20'});
      await page.is({clearable: true});

      await page.clear();
      await page.has({value: ''});
    });
  });
});
