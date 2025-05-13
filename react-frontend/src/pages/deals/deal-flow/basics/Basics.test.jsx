import React from 'react';
import { render } from '@testing-library/react';

import { ResizeObserver } from '~/test';

import { Basics } from './Basics.jsx';
import { BasicsPageObject } from './Basics.page-object';

describe('Basics', function() {
  let page;

  beforeEach(() => {
    page = BasicsPageObject();
    render(
      <Basics
        ResizeObserver={ResizeObserver}
      />
    );
  });

  it('should render', async () => {
    await page.exists();
  });

  xit('should be able to select an artist.', async () => {})
  xit('should be able to select an event type.', async () => {})
  xit('should be able to select a billing type.', async () => {})
  xit('should show one empty event by default.', () => {})
  xit('should be able to select an event venue.', async () => {})
  xit('should be able to select an event buyer.', async () => {})
  xit('should be able to select an event co-promoter.', async () => {})
  xit('should allow multiple events to be created.', async () => {})
  xit('should be able to delete events.', () => {})
});
