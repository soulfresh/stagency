import React from 'react';
import { render } from '~/test';

import { DealSummary } from './DealSummary';
import { DealSummaryPO } from './DealSummary.page-object';

describe('DealSummary', function() {
  let component: typeof DealSummaryPO;

  beforeEach(() => {
    component = DealSummaryPO({ testId: 'DealSummary' });
    const deal = {}
    render(
      <DealSummary
        data-testid="DealSummary"
        deal={deal}
      />
    );
  });

  it('should render.', async () => {
    await component.exists();
  });

  xit('should show the quick summary of the deal event type.', () => {});
  xit('should show the deal venues.', () => {});
  xit('should show the deal event dates.', () => {});
  xit('should show the deal artist.', () => {});
  xit('should show the deal structure.', () => {});
  xit('should show the deal split point.', () => {});
  xit('should show the deal walkout potential.', () => {});
});

