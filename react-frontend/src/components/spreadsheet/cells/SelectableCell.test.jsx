import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import ResizeObserver from "resize-observer-polyfill";

import { wrapWithAnalytics } from '~/test';

import { SelectableCell } from './SelectableCell.jsx';

describe('SelectableCell', function() {
  let options, setValue, optionToString, column, api, columnApi;
  const value = 'Bar';
  const rowIndex = 0;
  const tableName = 'Expenses';

  beforeEach(() => {
    options = ['Foo', 'Bar', 'Baz'];

    setValue = jest.fn();
    optionToString = jest.fn();

    column = {
      colId: 'foo'
    };
    columnApi = {
      getAllColumns: () => [{}, column],
    };

    api = {
      getFocusedCell: jest.fn(),
      setFocusedCell: jest.fn(),
      getEditingCells: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
  });

  describe('by default', () => {
    beforeEach(() => {
      render(wrapWithAnalytics(
        <SelectableCell
          options={options}
          value={value}
          setValue={setValue}
          optionToString={optionToString}
          api={api}
          columnApi={columnApi}
          tableName={tableName}
          column={column}
          rowIndex={rowIndex}
          layerOptions={{ResizeObserver}}
        />
      ));
    });

    it('should render the trigger element.', () => {
      expect(screen.getByTestId('SelectableCell')).toBeInTheDocument();
    });

    it('should not render the menu.', () => {
      expect(screen.getByTestId('SelectableCell')).toHaveAttribute('aria-expanded', 'false');
    });

    it('should set the correct aria-label for the trigger.', () => {
      expect(screen.getByLabelText('Expenses Row 1 Column 2')).toBeInTheDocument();
    });

    describe('after typing the ArrowDown key', () => {
      beforeEach(() => {
        api.setFocusedCell.mockClear();

        fireEvent.keyDown(screen.getByTestId('SelectableCell'), {key: 'ArrowDown', code: 'ArrowDown'});
      });

      it('should focus the next cell.', () => {
        expect(api.setFocusedCell).toHaveBeenCalledTimes(1);
        expect(api.setFocusedCell).toHaveBeenCalledWith(rowIndex + 1, column.colId);
      });
    });

    describe('after clicking on the trigger', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByTestId('SelectableCell'));
      });

      it('should show the menu.', () => {
        return waitFor(() =>
          expect(screen.getByTestId('SelectableCell')).toHaveAttribute('aria-expanded', 'true')
        );
      });
    });

    describe('after typing the Enter key', () => {
      beforeEach(() => {
        api.getFocusedCell.mockReturnValue({rowIndex, column});

        const calls = api.addEventListener.mock.calls;
        const keyDownHandler = calls[calls.length - 1][1];

        act(() => {
          keyDownHandler({event: {code: 'Enter'}});
        });
      });

      it('should show the menu.', () => {
        return waitFor(() =>
          expect(screen.getByTestId('SelectableCell')).toHaveAttribute('aria-expanded', 'true')
        );
      });

      describe('and then typing the down key', () => {
        beforeEach(() => {
          fireEvent.keyDown(screen.getByTestId('SelectMenu'), {code: 'ArrowDown', key: 'ArrowDown'});
        });

        it('should select the first item in the menu.', () => {
          const menuOptions = screen.getAllByRole('option');

          expect(menuOptions.length).toEqual(options.length);
          expect(menuOptions[0]).toHaveAttribute('aria-selected', 'true');
        });
      });

      describe('and then hitting Escpace', () => {
        beforeEach(() => {
          fireEvent.keyDown(screen.getByTestId('SelectMenu'), {code: 'Escape', key: 'Escape'});
        });

        it('should hide the menu.', () => {
          return waitFor(() =>
            expect(screen.getByTestId('SelectableCell')).toHaveAttribute('aria-expanded', 'false')
          );
        });

        describe('followed by the down key', () => {
          beforeEach(() => {
            fireEvent.keyDown(screen.getByTestId('SelectableCell'), {code: 'ArrowDown', key: 'ArrowDown'});
          });

          it('should focus the next cell.', () => {
            expect(api.setFocusedCell).toHaveBeenCalledTimes(1);
            expect(api.setFocusedCell).toHaveBeenCalledWith(rowIndex + 1, column.colId);
          });
        });
      });
    });
  });
});

