import React from 'react';
import { render, screen } from '@testing-library/react';

import { Loader } from './Loader.jsx';

describe('Loader', function() {
  beforeEach(function() {
    render(<Loader />);
  });

  it('should show the loader icon.', () => {
    expect(screen.getByTestId('loaderComponent')).toBeInTheDocument();
  });
});
