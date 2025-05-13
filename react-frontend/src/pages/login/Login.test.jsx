import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithRouterAndAnalytics } from '~/test';
import { Login } from './Login.jsx';

class Selectors {
  get container() {
    return screen.getByTestId('Login');
  }
}
const selectors = new Selectors();

describe('Login', function() {
  beforeEach(() => {
    renderWithRouterAndAnalytics(
      <Login
      />
    );
  });

  it('should render the page.', () => {
    expect(selectors.container).toBeInTheDocument();
  });
});
