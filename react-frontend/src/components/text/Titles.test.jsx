import React from 'react';
import { render, screen } from '@testing-library/react';

import { TitleXL, Title } from './Titles.jsx';

describe('Titles', function() {
  it('should be able to render a TitleXL', () => {
    render(<TitleXL>My Title</TitleXL>);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('should be able to render a Title', () => {
    render(<Title>My Title</Title>);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });
});
