import React from 'react';
import { render } from '@testing-library/react';

import { DateRange } from './DateRange.jsx';
import { DateRangePageObject } from './DateRange.page-object';

describe('DateRange', function() {
  let page, dates;

  beforeEach(() => {
    dates = [
      new Date('1/1/2020'),
      new Date('2/2/2020'),
      new Date('3/3/2020'),
    ];

    page = DateRangePageObject({testId: 'DateRange'});
  });

  describe('with no dates', () => {
    beforeEach(() => {
      render(
        <DateRange data-testid="DateRange" />
      );
    });

    it('should render without dates', async () => {
      await page.exists();
      await page.has({text: ''});
    });
  });

  describe('with 1 date', () => {
    beforeEach(() => {
      render(
        <DateRange data-testid="DateRange" dates={dates.slice(0, 1)} />
      );
    });

    it('should render the date in the expected format.', async () => {
      await page.has({text: 'Jan 1, 2020'});
    });
  });

  describe('with 2 dates', () => {
    beforeEach(() => {
      render(
        <DateRange data-testid="DateRange" dates={dates.slice(0, 2)} />
      );
    });

    it('should render both dates.', async () => {
      await page.has({text: 'Jan 1 - Feb 2, 2020'});
    });
  });

  describe('with 3 dates', () => {
    beforeEach(() => {
      render(
        <DateRange data-testid="DateRange" dates={dates} />
      );
    });

    it('should only render the earliest and latest dates.', async () => {
      await page.has({text: 'Jan 1 - Mar 3, 2020'});
    });
  });
});

