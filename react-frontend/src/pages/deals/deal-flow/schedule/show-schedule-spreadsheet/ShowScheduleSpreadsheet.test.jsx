import React from 'react';
import { render, screen } from '@testing-library/react';
import ResizeObserver from "resize-observer-polyfill";

import { ShowScheduleSpreadsheet } from './ShowScheduleSpreadsheet.jsx';

describe('ShowScheduleSpreadsheet', function() {
  beforeEach((done) => {
    render(
      <ShowScheduleSpreadsheet
        data-testid="ShowScheduleSpreadsheet"
        onFirstDataRendered={() => done()}
        ResizeObserver={ResizeObserver}
      />
    );
  });

  it('should render', () => {
    expect(screen.getByTestId('ShowScheduleSpreadsheet')).toBeInTheDocument();
  });

  xit('should render the expected cell values.', () => {});
  describe('after updating a row', () => {
    xit('should emit the new values.', () => {});
  });
});
