import React from 'react';
import { render, screen } from '@testing-library/react';
import ResizeObserver from "resize-observer-polyfill";

import { wrapWithAnalytics } from '~/test';
import { Action } from '../buttons';
import { Dropdown } from './Dropdown.jsx';

describe('Dropdown', function() {
  beforeEach(() => {
    render(wrapWithAnalytics(
      <Dropdown
        content={(first, last) =>
          <div>
            <div>My Menu</div>
            <Action ref={first}>Action 1</Action>
            <Action>Action 2</Action>
            <Action ref={last}>Action 3</Action>
          </div>
        }
        layerOptions={{ResizeObserver}}
      >
        <Action>Menu</Action>
      </Dropdown>
    ));
  });

  it('should render', () => {
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });
});

