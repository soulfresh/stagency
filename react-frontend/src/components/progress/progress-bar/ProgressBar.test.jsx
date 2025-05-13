import React from 'react';
import { render } from '@testing-library/react';

import { silenceLogs } from '~/test';
import { ProgressBarPageObject } from './ProgressBar.page-object';
import { ProgressBar } from './ProgressBar.jsx';

describe('ProgressBar', function() {
  let bar;

  beforeEach(() => {
    bar = ProgressBarPageObject();
  });

  describe('by default', () => {
    beforeEach(() => {
      // Silence PropType warnings for this test.
      silenceLogs('error');

      render(<ProgressBar />);
    });

    it('should render at 0% progress', async () => {
      await bar.exists();
      await bar.has({value: 0});
    });

    it('should set a default aria label.', async () => {
      await bar.has({label: 'Progress: 0%'});
    });
  });

  describe('at 50%', () => {
    beforeEach(() => {
      render(
        <ProgressBar
          progress={0.5}
          aria-label="Deal Progress"
        />
      );
    });

    it('should set the aria label.', async () => {
      await bar.has({label: 'Deal Progress: 50%'});
    });

    it('should set the progress bar aria properties.', async () => {
      await bar.has({
        role: 'progressbar',
        percent: 50,
        min: 0,
        max: 100,
      });
    });

    it('should set the width to 50%.', async () => {
      await bar.has({width: '50%'});
    });
  });

  describe('at 120%', () => {
    beforeEach(() => {
      render(
        <ProgressBar
          progress={1.2}
          aria-label="Deal Progress"
        />
      );
    });

    it('should set the width to 100%.', async () => {
      await bar.has({width: '100%'});
    });

    it('should set the progress bar aria properties to 100%.', async () => {
      await bar.has({
        percent: 100,
        min: 0,
        max: 100,
      });
    });
  });
});
