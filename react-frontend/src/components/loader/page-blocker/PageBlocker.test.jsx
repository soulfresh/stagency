import React from 'react';
import { render } from '~/test';

import { PageBlocker } from './PageBlocker.jsx';
import { PageBlockerPO } from './PageBlocker.page-object.js';

describe('PageBlocker', function() {
  let component;

  beforeEach(() => {
    component = PageBlockerPO({ testId: 'PageBlocker' });
    render(
      <PageBlocker
        data-testid="PageBlocker"
      />
    );
  });

  it('should render.', async () => {
    await component.exists();
  });

  xit('should show the loader.', () => {});
  xit('should show the message.', () => {});
  xit('should update the message if the request takes a long time.', () => {});
});

