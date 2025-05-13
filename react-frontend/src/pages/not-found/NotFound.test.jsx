import React from 'react';
import { render, screen } from '@testing-library/react';

import { NotFound } from './NotFound.jsx';

describe('NotFound', function() {
  beforeEach(() => {
    render(
      <NotFound
      />
    );
  });

  it('should render the Not Found title.', () => {
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  it('should render the sorry message.', () => {
    expect(screen.getByText("Sorry, we couldn't find that page", {exact: false}))
      .toBeInTheDocument();
  });
});
