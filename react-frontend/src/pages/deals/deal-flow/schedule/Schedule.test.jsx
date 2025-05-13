import React from 'react';
import { render, screen } from '@testing-library/react';

import { Schedule } from './Schedule.jsx';

describe('Schedule', function() {
  beforeEach(() => {
    render(
      <Schedule deal={{}} />
    );
  });

  it('should render', () => {
    expect(screen.getByTestId('Schedule')).toBeInTheDocument();
  });

  describe('with an existing deal', () => {
    xit('should set the correct show schedule values.', () => {});
    xit('should set the correct performance schedule values.', () => {});
  });
});
