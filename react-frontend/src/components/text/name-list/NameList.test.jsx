import React from 'react';
import { render } from '@testing-library/react';

import { ResizeObserver } from '~/test';
import { NameList } from './NameList.jsx';
import { NameListPageObject } from './NameList.page-object';

describe('NameList', function() {
  let page, names;

  beforeEach(() => {
    names = [
      'Jimi Hendrix',
      'Natalie Cole',
      'Diana Ross',
    ]
    page = NameListPageObject({testId: 'NameList'});
  })

  describe('without names', () => {
    beforeEach(() => {
      render(
        <NameList data-testid="NameList" />
      );
    });

    it('should render without names.', async () => {
      await page.exists();
    });
  });

  describe('with 1 name', () => {
    beforeEach(() => {
      render(
        <NameList data-testid="NameList" names={names.slice(0, 1)} />
      );
    });

    it('should render a single name.', async () => {
      await page.has({text: 'Jimi Hendrix'});
    });
  });

  describe('with 3 names', () => {
    beforeEach(() => {
      render(
        <NameList
          data-testid="NameList"
          names={names}
          layerOptions={{
            ResizeObserver,
          }}
        />
      );
    });

    it('should render just the first name + 2 more.', async () => {
      await page.has({text: 'Jimi Hendrix + 2 more'});
    });

    it('should include all of the names in the tooltip.', async () => {
      await page.has({tooltipText: names.join('')});
    });
  });
});
