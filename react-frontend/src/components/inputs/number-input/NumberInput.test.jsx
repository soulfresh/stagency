import React from 'react';
import { render } from '@testing-library/react';

import { InputPageObject } from '../Input.page-object.js';
import { NumberInput } from './NumberInput.jsx';

describe('NumberInput', function() {
  let input;
  const value = 2020;

  beforeEach(() => {
    input = InputPageObject();
  });

  describe('by default', () => {
    beforeEach(() => {
      render(
        <NumberInput value={value} locale="en-US" />
      );
    });

    it('should render the value.', async () => {
      await input.exists();
      await input.has({value: '2,020'});
    });
  });

  describe('clearable', () => {
    beforeEach(() => {
      render(
        <NumberInput defaultValue={value} locale="en-US" clearable />
      );
    });

    it('should be able to clear the input value.', async () => {
      await input.has({value: '2,020'});
      await input.is({clearable: true});

      await input.clear();
      await input.is({empty: true});
    });
  });
});
