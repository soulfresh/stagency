import React from 'react';
import { render, screen } from '@testing-library/react';

import { NativeSelect } from './NativeSelect.jsx';

describe('NativeSelect', function() {
  beforeEach(() => {
    render(
      <NativeSelect narrow value="apples" onChange={jest.fn()}>
        <option>Choose one</option>
        <option value="apples">Apples</option>
        <option value="oranges">Oranges</option>
      </NativeSelect>
    );
  });

  it('should render', () => {
    const select = screen.getByTestId('NativeSelect');
    expect(select).toBeInTheDocument();
    expect(select.tagName).toEqual('SELECT');
    expect(select).toHaveClass('narrow');
    expect(select).toHaveClass('hasValue');
  });
});
