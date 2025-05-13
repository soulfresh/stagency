import React from 'react';
import { render, screen, act } from '@testing-library/react';

import { FooterCell } from './FooterCell.jsx';

describe('FooterCell', function() {
  let gridApi;
  const value = 'Foo Bar';
  const rowIndex = 3;

  beforeEach(() => {
    const column = {};
    gridApi = {
      api: {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        forEachNodeAfterFilter: jest.fn(),
        getValue: jest.fn(),
      },
      columnApi: {
        getAllColumns: () => [{}, column],
      },
      node: {},
      column,
      colDef: {
        field: 'foo'
      },
      rowIndex,
    };
  });

  describe('default', () => {
    beforeEach(() => {
      render( <FooterCell value={value} {...gridApi} tableName="Expenses" />);
    });

    it('should render a div by default', () => {
      const cell = screen.getByText(value);
      expect(cell).toBeInTheDocument();
    });

    it('should render the correct aria-label.', () => {
      expect(screen.getByText(value)).toHaveAttribute('aria-label', 'Expenses Row 4 Column 2');
    });
  });

  describe('with a custom renderer', () => {
    let children;

    beforeEach(() => {
      children = jest.fn((props, ref, {value}) =>
        <span {...props} ref={ref}>{value}</span>
      );

      render( <FooterCell value={value} footer={children} {...gridApi} /> );
    });

    it('should be able to render the footer prop as a function', () => {
      const cell = screen.getByText(value);
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

  describe('with static content', () => {
    beforeEach(() => {
      render( <FooterCell footer="Foo Bar" {...gridApi} /> );
    });

    it('should render the static content.', () => {
      expect(screen.getByText('Foo Bar')).toBeInTheDocument();
    });
  });

  describe('with a reducer', () => {
    let reduce, data, onCellValueChanged;

    beforeEach(() => {
      reduce = jest.fn((total, value) => total + value);

      gridApi.api.getValue.mockImplementation(() => 1);
      gridApi.api.forEachNodeAfterFilter.mockImplementation((cb) => {
        data.forEach(i => cb({}, i));
      });
      gridApi.api.addEventListener.mockImplementation((name, cb) => {
        if (name === 'cellValueChanged') onCellValueChanged = cb;
      });
    });

    describe('and data', () => {
      beforeEach(() => {
        data = [1, 1, 1];

        render(
          <FooterCell
            data-testid="FooterCell"
            reduce={reduce}
            {...gridApi}
          />
        );
      });

      it('should render the initial aggregate value', () => {
        expect(reduce).toHaveBeenCalledTimes(data.length);
        expect(screen.getByTestId('FooterCell')).toHaveTextContent(data.length);
      });

      describe('after a cell value changes', () => {
        beforeEach(() => {
          reduce.mockClear();
          gridApi.api.getValue.mockImplementation(() => 2);

          act(() => {
            onCellValueChanged({...gridApi, node: {}});
          });
        });

        it('should recalculate the aggregated value', () => {
          expect(reduce).toHaveBeenCalledTimes(data.length);
          expect(screen.getByTestId('FooterCell')).toHaveTextContent(data.length * 2);
        });
      });
    });

    describe('but no data', () => {
      beforeEach(() => {
        data = [];

        render(
          <FooterCell
            data-testid="FooterCell"
            reduce={reduce}
            {...gridApi}
          />
        );
      });

      // I'm not sure if we want to render 0 or nothing in this case.
      it('should render 0', () => {
        expect(reduce).not.toHaveBeenCalled();
        expect(screen.getByTestId('FooterCell')).toHaveTextContent(0);
      });
    });
  });
});

