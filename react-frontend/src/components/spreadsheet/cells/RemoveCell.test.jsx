import React from 'react';
import { render, screen } from '@testing-library/react';

import { RemoveCell } from './RemoveCell.jsx';

describe('RemoveCell', function() {
  beforeEach(() => {
    render(
      <RemoveCell
      />
    );
  });

  it('should render', () => {
    expect(screen.getByTestId('RemoveCell')).toBeInTheDocument();
  });
});
