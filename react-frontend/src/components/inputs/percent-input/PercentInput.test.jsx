import React from 'react';
import { render } from '@testing-library/react';

import { InputPageObject } from '../Input.page-object.js';
import { PercentInput } from './PercentInput.jsx';

describe('PercentInput', function() {
  let input;
  const value = 8300;

  beforeEach(() => {
    input = InputPageObject();
  });

  describe('by default', () => {
    beforeEach(() => {
      render(
        <PercentInput defaultValue={value} />
      );
    });

    it('should render the formatted value.', async () => {
      await input.exists();
      await input.has({value: '83.00%'});
    });
  });

  describe('clearable', () => {
    beforeEach(() => {
      render(
        <PercentInput defaultValue={value} clearable />
      );
    });

    it('should be able to clear the input value.', async () => {
      await input.has({value: '83.00%'});
      await input.is({clearable: true});

      await input.clear();
      await input.is({empty: true});
    });
  });
});
