import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import ResizeObserver from "resize-observer-polyfill";

import { EditableCell } from './EditableCell.jsx';

describe('EditableCell', function() {
  let setValue, column, columnApi, api, unmount, inputRef, keyDownHandler;
  const value = 'Foo Bar';
  const rowIndex = 0;
  const tableName = 'Expenses';

  beforeEach(() => {
    setValue = jest.fn();
    keyDownHandler = jest.fn();

    inputRef = {current: undefined};

    column = {
      colId: 'foo'
    };
    columnApi = {
      getAllColumns: () => [{}, {}, column],
    }

    api = {
      getFocusedCell: jest.fn(),
      setFocusedCell: jest.fn(),
      getEditingCells: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
  });

  describe('default', () => {
    beforeEach(() => {
      ({unmount} = render(
        <EditableCell
          value={value}
          setValue={setValue}
          rowIndex={rowIndex}
          tableName={tableName}
          column={column}
          api={api}
          columnApi={columnApi}
          ResizeObserver={ResizeObserver}
          ref={inputRef}
        />
      ));
    });

    it('should render an input by default', () => {
      const cell = screen.getByDisplayValue(value);
      expect(cell).toBeInTheDocument();
      expect(cell.tagName).toEqual('INPUT');
    });

    it('should render the expected aria-label.', () => {
      const cell = screen.getByDisplayValue(value);
      expect(cell).toHaveAttribute('aria-label', 'Expenses Row 1 Column 3');
    });

    it('should listen for cell key presses.', () => {
      expect(api.addEventListener).toHaveBeenCalledWith('cellKeyPress', expect.any(Function));
    });

    describe('after focusing the cell and typing Enter', () => {
      beforeEach(() => {
        api.getFocusedCell.mockReturnValue({rowIndex, column});

        const calls = api.addEventListener.mock.calls;
        const keyPressHandler = calls[calls.length - 1][1];
        act(() => {
          keyPressHandler({});
        });
      });

      it('should focus the input element.', () => {
        expect(inputRef.current).toBeDefined();
        expect(inputRef.current).toBeInTheDocument();
        expect(document.activeElement).toEqual(inputRef.current);
      });

      describe('and then typing an arrow key', () => {
        beforeEach(() => {
          inputRef.current.addEventListener('keydown', keyDownHandler);

          const cell = screen.getByDisplayValue(value);
          fireEvent.keyDown(cell, {key: 'ArrowUp', code: 'ArrowUp'});
        });

        it('should prevent the arrow event from bubbling up to the Spreadsheet.', () => {
          expect(keyDownHandler).not.toHaveBeenCalled();
        });
      });

      describe('and then typing Escape', () => {
        beforeEach(() => {
          const cell = screen.getByDisplayValue(value);
          fireEvent.keyDown(cell, {key: 'Escape', code: 'Escape'});
        });

        it('should move focus back to the Spreadsheet.', async () => {
          await waitFor(() => expect(api.setFocusedCell).toHaveBeenCalledTimes(1));
          expect(api.setFocusedCell).toHaveBeenCalledWith(rowIndex, column.colId);
        });
      });

      describe('and then typing Enter', () => {
        beforeEach(() => {
          const cell = screen.getByDisplayValue(value);
          fireEvent.keyDown(cell, {key: 'Enter', code: 'Enter'});
        });

        it('should move focus back to the Spreadsheet.', async () => {
          await waitFor(() => expect(api.setFocusedCell).toHaveBeenCalledTimes(1));
          expect(api.setFocusedCell).toHaveBeenCalledWith(rowIndex, column.colId);
        });
      });
    });

    describe('after it is destroyed', () => {
      beforeEach(() => {
        unmount();
      });

      it('should remove all event listeners.', () => {
        expect(api.removeEventListener).toHaveBeenCalledWith('cellKeyPress', expect.any(Function));
      });
    });
  });

  describe('with a sync validator and a valid value', () => {
    let validate;

    beforeEach(() => {
      validate = jest.fn(v => 'bar');

      render(
        <EditableCell
          value="foo"
          setValue={setValue}
          rowIndex={rowIndex}
          tableName={tableName}
          column={column}
          api={api}
          columnApi={columnApi}
          validate={validate}
          ResizeObserver={ResizeObserver}
          ref={inputRef}
        />
      );
    });

    it('should call the validator.', () => {
      expect(validate).toHaveBeenCalledWith('foo', expect.any(Object));
    });

    it('should set the coerced value.', () => {
      expect(setValue).toHaveBeenCalledWith('bar');
      expect(setValue).not.toHaveBeenCalledWith('foo');
    });

    describe('after changing the value', () => {
      beforeEach(async () => {
        const input = screen.getByTestId('Input');
        fireEvent.change(input, {target: {value: 'baz'}});
      });

      it('should set the new value.', () => {
        expect(setValue).toHaveBeenCalledWith('baz');
      });
    });
  });

  describe('with a sync validator and an invalid value', () => {
    let validate;

    beforeEach(() => {
      validate = jest.fn(v => {
        throw new Error('bad');
      });

      render(
        <EditableCell
          value="foo"
          setValue={setValue}
          rowIndex={rowIndex}
          tableName={tableName}
          column={column}
          columnApi={columnApi}
          api={api}
          validate={validate}
          ResizeObserver={ResizeObserver}
          ref={inputRef}
        />
      );
    });

    it('should call the validator.', () => {
      expect(validate).toHaveBeenCalledWith('foo', expect.any(Object));
    });

    it('should not set a new value.', () => {
      expect(setValue).not.toHaveBeenCalled();
    });

    it('should show an error.', () => {
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('with an async validator and a valid value', () => {
    let validate;

    beforeEach(async () => {
      validate = jest.fn(v => Promise.resolve('bar'));

      render(
        <EditableCell
          value="foo"
          setValue={setValue}
          rowIndex={rowIndex}
          tableName={tableName}
          column={column}
          columnApi={columnApi}
          api={api}
          validate={validate}
          ResizeObserver={ResizeObserver}
          ref={inputRef}
        />
      );

      await waitFor(() => {
        expect(validate).toHaveBeenCalledTimes(1);
      });
    });

    it('should call the validator.', () => {
      expect(validate).toHaveBeenCalledWith('foo', expect.any(Object));
    });

    it('should set the coerced value.', () => {
      expect(setValue).toHaveBeenCalledWith('bar');
      expect(setValue).not.toHaveBeenCalledWith('foo');
    });
  });

  describe('with an async validator and an invalid value', () => {
    let validate;

    beforeEach(() => {
      validate = jest.fn(v => Promise.reject('no bueno'));

      // Ignore warning from @testing-library about using act()
      // because it's not relevant in this case.
      jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <EditableCell
          value="foo"
          setValue={setValue}
          rowIndex={rowIndex}
          tableName={tableName}
          column={column}
          api={api}
          columnApi={columnApi}
          validate={validate}
          ResizeObserver={ResizeObserver}
          ref={inputRef}
        />
      );

      return waitFor(() => expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true'));
    });

    it('should call the validator.', () => {
      expect(validate).toHaveBeenCalledWith('foo', expect.any(Object));
    });

    it('should not set a new value.', () => {
      expect(setValue).not.toHaveBeenCalled();
    });

    it('should show an error.', () => {
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('should show the error message in a tooltip.', () => {
      const input = screen.getByRole('textbox');
      const tooltip = document.querySelector(`#${input.getAttribute('aria-describedby')}`);
      expect(tooltip).toBeInTheDocument();
      expect(tooltip.textContent).toContain('no bueno');
    });
  });

  describe('with a custom renderer', () => {
    let children;

    beforeEach(() => {
      children = jest.fn((props, ref, {value}) =>
        <textarea value={value} {...props} ref={ref} />
      );

      render(
        <EditableCell
          value={value}
          setValue={setValue}
          rowIndex={rowIndex}
          tableName={tableName}
          column={column}
          api={api}
          columnApi={columnApi}
          ResizeObserver={ResizeObserver}
        >
          { children }
        </EditableCell>
      );
    });

    it('should be able to render its children as a function.', () => {
      const cell = screen.getByDisplayValue(value);
      expect(cell).toBeInTheDocument();
      expect(cell.tagName).toEqual('TEXTAREA');
      expect(children).toHaveBeenCalledTimes(1);
      expect(children).toHaveBeenCalledWith(
        expect.objectContaining({ onChange: expect.any(Function) }),
        expect.any(Function),
        expect.objectContaining({ value })
      );
    });

    describe('after changing the value', () => {
      beforeEach(() => {
        const calls = children.mock.calls;
        const onChange = calls[calls.length - 1][0].onChange;
        act(() =>
          onChange(20)
        );
      });

      it('should use the non-event parameter as the new value.', () => {
        expect(setValue).toHaveBeenCalledWith(20);
      });
    });
  });
});

