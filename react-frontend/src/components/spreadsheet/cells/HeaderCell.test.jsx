import React from 'react';
import { render, screen } from '@testing-library/react';
import ResizeObserver from "resize-observer-polyfill";

import { HeaderCell } from './HeaderCell.jsx';

describe('HeaderCell', function() {
  let columnApi, api, tableApi, column;
  const rowIndex = 0;

  beforeEach(() => {
    column = {};
    columnApi = {getDisplayNameForColumn: jest.fn()};
    api = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    tableApi = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    render(
      <HeaderCell
        displayName="Foo Bar"
        headerTooltip="Header Tooltip"
        column={column}
        rowIndex={rowIndex}
        columnApi={columnApi}
        api={api}
        tableApi={tableApi}
        tooltipDelay={0}
        ResizeObserver={ResizeObserver}
      />
    );
  });

  it('should render', () => {
    expect(screen.getByTestId('HeaderCell')).toBeInTheDocument();
  });

  it('should render the display name.', () => {
    expect(screen.getByText('Foo Bar')).toBeInTheDocument();
  });

  it('should not show the tooltip.', () => {
    expect(screen.getByTestId('Tooltip')).toHaveAttribute('aria-hidden', 'true');
  });

  describe('after the parent cell receives focus', () => {
    xit('should open the tooltip.', () => {});
    describe('and then loses focus', () => {
      xit('should close the toolitp', () => {});
    });
    describe('and then the table loses focus', () => {
      xit('should close the toolitp', () => {});
    });
  });
});
