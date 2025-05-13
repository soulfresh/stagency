import React from 'react';
import { render, screen } from '@testing-library/react';

import { Cell } from './Cell.jsx';

describe('Cell', function() {
  let columnApi, column;
  const value = 'Foo Bar';
  const rowIndex = 3;
  const tableName = 'Expenses';

  beforeEach(() => {
    column = {};
    columnApi = {
      getAllColumns: () => [{}, column],
    };
  });

  describe('default', () => {
    beforeEach(() => {
      render(
        <Cell
          value={value}
          columnApi={columnApi}
          column={column}
          rowIndex={rowIndex}
          tableName={tableName}
        />
      );
    });

    it('should render a div by default', () => {
      const cell = screen.getByText(value);
      expect(cell).toBeInTheDocument();
    });

    it('should set the expected aria-label.', () => {
      const cell = screen.getByText(value);
      expect(cell).toHaveAttribute('aria-label', `Expenses Row ${rowIndex + 1} Column 2`);
    })
  });

  describe('with a custom renderer', () => {
    let children;

    beforeEach(() => {
      children = jest.fn((props, ref, {value}) =>
        <span {...props} ref={ref}>{value}</span>
      );

      render(
        <Cell
          value={value}
          columnApi={columnApi}
          column={column}
          rowIndex={rowIndex}
        >
          { children }
        </Cell>
      );
    });

    it('should be able to render its children as a function', () => {
      const cell = screen.getByLabelText('Row 4 Column 2');
      expect(cell).toBeInTheDocument();
      expect(cell.tagName).toEqual('SPAN');
      expect(children).toHaveBeenCalledTimes(1);
      expect(children).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.objectContaining({ value })
      );
    });
  });
});
