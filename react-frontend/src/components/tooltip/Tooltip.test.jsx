import React from 'react';
import { render, screen } from '@testing-library/react';

import { Tooltip } from './Tooltip.jsx';

describe('Tooltip', function() {
  beforeEach(() => {
    // Silence ResizeObserver warning logs.
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <Tooltip content="foo">Bar</Tooltip>
    );
  });

  it('should render', () => {
    expect(screen.getByText('Bar')).toBeInTheDocument();
  });
});
