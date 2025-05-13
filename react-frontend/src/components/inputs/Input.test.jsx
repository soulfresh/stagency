import React from 'react';
import { render } from '@testing-library/react';

import { InputPageObject } from './Input.page-object.js';
import { Input } from './Input.jsx';

describe('Input', function() {
  let page;
  const value = 'foo bar';

  beforeEach(() => {
    page = InputPageObject();
  })

  describe('default', () => {
    beforeEach(() => {
      render(
        <Input value={value} readOnly />
      );
    });

    it('should render', async () => {
      await page.exists();
      await page.has({value});
    });

    it('should not be loading.', async () => {
      await page.is({loading: false});
    });
  });

  describe('with an error', () => {
    beforeEach(() => {
      render(
        <Input value={value} error="No Bueno" readOnly />
      );
    });

    it('should be invalid.', async () => {
      await page.is({valid: false});
      await page.is({errored: true});
      await page.has({errorMessage: 'No Bueno'});
    });
  });

  describe('loading', () => {
    beforeEach(() => {
      render(
        <Input value={value} loading />
      );
    });

    it('should show the loading indicator.', async () => {
      await page.is({loading: true});
    });
  });

  describe('clearable', () => {
    beforeEach(async () => {
      render(
        <Input defaultValue={value} placeholder="Username" clearable />
      );
    });

    it('should be able to clear the input value.', async () => {
      await page.is({clearable: true});
      await page.clear();
      await page.has({value: ''});
    });
  });
});
