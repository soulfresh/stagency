import React from 'react';
import { renderWithRouter } from '~/test';

import { Finished } from './Finished';
import { FinishedPO } from './Finished.page-object';

describe('Finished', function() {
  let component: typeof FinishedPO;
  let onShare: ReturnType<typeof jest.fn>
  let onSave: ReturnType<typeof jest.fn>
  const createDealURL = '/deal/create';

  beforeEach(() => {
    onShare = jest.fn();
    onSave = jest.fn();

    component = FinishedPO({ testId: 'Finished' });
    renderWithRouter(
      <Finished
        data-testid="Finished"
        deal={{}}
        onShare={onShare}
        onSave={onSave}
        createDealURL={createDealURL}
      />
    );
  });

  it('should render.', async () => {
    await component.exists();
  });

  xit('should show summary information about the deal.', () => {});
  xit('should be able to save the and exit the deal flow.', () => {});
  xit('should be able to create a new deal.', () => {});
  xit('should be able to share the deal.', () => {});
});

