import React from 'react';
import { render, screen } from '@testing-library/react';

import { Home } from './Home.jsx';

class Selectors {
  get container() { return screen.getByTestId('Home'); }
};

const selectors = new Selectors();

describe('Home', function() {
  beforeEach(() => {
    render(
      <Home
      />
    );
  });

  it('should render the home page.', () => {
    expect(selectors.container).toBeInTheDocument();
  });
});
