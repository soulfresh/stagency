import React from 'react';
import { render, screen } from '@testing-library/react';
import ResizeObserver from "resize-observer-polyfill";

import { PerformanceScheduleSpreadsheet } from './PerformanceScheduleSpreadsheet.jsx';

describe('PerformanceScheduleSpreadsheet', function() {
  beforeEach((done) => {
    render(
      <PerformanceScheduleSpreadsheet
        data-testid="PerformanceScheduleSpreadsheet"
        onFirstDataRendered={() => done()}
        ResizeObserver={ResizeObserver}
      />
    );
  });

  it('should render', () => {
    expect(screen.getByTestId('PerformanceScheduleSpreadsheet')).toBeInTheDocument();
  });

  xit('should render the expected cell values.', () => {});
  describe('after updating a row', () => {
    xit('should emit the new values.', () => {});
  });
});
