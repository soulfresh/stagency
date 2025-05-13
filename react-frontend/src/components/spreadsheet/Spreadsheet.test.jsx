import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  getByText,
  findByDisplayValue,
} from '@testing-library/react';
import ResizeObserver from "resize-observer-polyfill";

import { Currency } from '@thesoulfresh/react-tools';

import { CurrencyInput } from '../inputs';

import {
  getTableRowCount,
  getTableCellCount,
  getCellFromTable,
  getCellFromTableFooter,
  getAllCellValuesFromTableHeader,
  getAllCellValuesFromSpreadsheetColumn,
  getEditableCell,
  getSelectableCell,
  getSelectableCellMenu,
  getSelectableCellMenuOption,
  waitForSelectableCellMenuToOpen,
  getAllRemoveCells,
  getAllCellValuesFromTableRow,
  getAllCellValuesFromTableData,
} from './Spreadsheet.page-object';
import { EditableCellPageObject as EditableCellPO } from './cells/page-objects';
import { waitForTrue } from '~/test';

import {
  SpreadsheetColumn,
  EditableSpreadsheetColumn,
  SelectableSpreadsheetColumn
} from './Columns.jsx';
import {
  isRowEmpty,
  prepareSpreadsheetData,
  Spreadsheet
} from './Spreadsheet.jsx';

// I'm fairly certain we can get rid of these long time outs by replacing AgGrid
const timeout = 10000;

// Set a longer timeout for these tests because they can take a while
// when running in parallel with other tests.
if (jest?.setTimeout) jest.setTimeout(timeout);

describe('Spreadsheet', function() {
  let onChange, onRowChange, onCellChange, onRemoveRow, data;

  describe('isRowEmpty', () => {
    it('should be able to tell if row data is empty.', () => {
      expect(isRowEmpty({})).toBe(true);
      expect(isRowEmpty({foo: null, bar: undefined})).toBe(true);
      expect(isRowEmpty({foo: ''})).toBe(false);
      expect(isRowEmpty({foo: false})).toBe(false);
      expect(isRowEmpty({foo: 0})).toBe(false);
      expect(isRowEmpty({foo: 'bar'})).toBe(false);
    });

    it('should take into account the blacklisted properties.', () => {
      expect(isRowEmpty({foo: 'bar'}, ['foo'])).toBe(true);
      expect(isRowEmpty({bar: 'bar'}, ['foo'])).toBe(false);
      expect(isRowEmpty({foo: 'bar', bar: true}, ['foo'])).toBe(false);
      expect(isRowEmpty({foo: 'bar', bar: null}, ['foo'])).toBe(true);
      expect(isRowEmpty({foo: 'bar', bar: undefined}, ['foo'])).toBe(true);
    });
  });

  describe('prepareTableData', () => {
    it('should make a copy of each row.', () => {
      const input = [{foo: 'a'}, {foo: 'b'}, {foo: 'c'}];
      const output = prepareSpreadsheetData(input);

      expect(output).toEqual(input);
      expect(output).not.toBe(input);
      input.forEach((obj, i) => {
        expect(obj).not.toBe(output[i]);
      });
    });

    it('should not modify the original data.', () => {
      const input = [{foo: 'a'}, {foo: 'b'}, {foo: 'c'}];
      const output = prepareSpreadsheetData(input, true);

      expect(input).not.toEqual(output);
      input.forEach((obj, i) => {
        expect(output[i]).toEqual({
          ...obj,
          sortOrder: expect.any(String),
        });
      });
    });

    it('should sort the data by sortOrder.', () => {
      const input = [
        {foo: 'a', sortOrder: 'n'},
        {foo: 'b', sortOrder: 'z'},
        {foo: 'c', sortOrder: 'a'},
      ];
      const output = prepareSpreadsheetData(input);

      expect(output).toEqual([
        {foo: 'c', sortOrder: 'a'},
        {foo: 'a', sortOrder: 'n'},
        {foo: 'b', sortOrder: 'z'},
      ]);
    });

    it('should add sortOrder properties to any rows that are missing them.', () => {
      expect(prepareSpreadsheetData(
        [
          {foo: 'bar', sortOrder: 'a'},
          {foo: 'baz'},
          {foo: 'boz', sortOrder: 'z'},
        ],
        true
      )).toEqual([
        {foo: 'bar', sortOrder: 'a'},
        {foo: 'baz', sortOrder: 'n'},
        {foo: 'boz', sortOrder: 'z'},
      ]);
    });

    it('should create sortOrder properties for all rows if none of them had it.', () => {
      expect(prepareSpreadsheetData(
        [
          {foo: 'bar'},
          {foo: 'baz'},
          {foo: 'boz'},
        ],
        true
      )).toEqual([
        {foo: 'bar', sortOrder: 'a'},
        {foo: 'baz', sortOrder: 'b'},
        {foo: 'boz', sortOrder: 'c'},
      ]);
    });
  });

  beforeEach(() => {
    data = [
      { make: "Toyota"  , model: "Celica" , price: 3500000 } ,
      { make: "Ford"    , model: "Mondeo" , price: 3200000 } ,
      { make: "Porsche" , model: "Boxter" , price: 7200000 } ,
    ];

    onChange = jest.fn();
    onRowChange = jest.fn();
    onCellChange = jest.fn();
    onRemoveRow = jest.fn();
  });

  describe('with standard SpreadsheetColumns', () => {
    beforeEach((done) => {
      render(
        <Spreadsheet
          domLayout='autoHeight'
          rowData={data}
          disableAnimations
          ResizeObserver={ResizeObserver}
          onContentReady={() => done()}
        >
          <SpreadsheetColumn field="make" />
          <SpreadsheetColumn field="model" />
          <SpreadsheetColumn field="price" />
        </Spreadsheet>
      );
    });

    it('should render the column headers.', async () => {
      expect(getAllCellValuesFromTableHeader()).toEqual([
        'Make',
        'Model',
        'Price'
      ])
    });

    it('should render the car makes.', () => {
      expect(getAllCellValuesFromSpreadsheetColumn('make')).toEqual([
        'Make',
        'Toyota',
        'Ford',
        'Porsche'
      ]);
    });

    it('should render the expected number of cells.', () => {
      const rowCount = data.length;
      expect(getTableRowCount()).toEqual(rowCount);
      expect(getTableCellCount()).toEqual(rowCount * 3);
    });

    it('should render the car models.', () => {
      expect(getAllCellValuesFromSpreadsheetColumn('model')).toEqual([
        'Model',
        'Celica',
        'Mondeo',
        'Boxter',
      ]);
    });

    it('should render the car prices.', () => {
      expect(getAllCellValuesFromSpreadsheetColumn('price')).toEqual([
        'Price',
        // We're not using a Currency renderer so pennies will
        // be rendered instead of dollars.
        '3500000',
        '3200000',
        '7200000',
      ]);
    });
  });

  describe('with customized cell renderers', () => {
    let children;

    beforeEach((done) => {
      children = jest.fn((props, ref, {value}) =>
        <Currency data-testid="Cell" {...props} ref={ref} value={value} pennies />
      );

      render(
        <Spreadsheet
          domLayout='autoHeight'
          rowData={data}
          onContentReady={() => done()}
          disableAnimations
          ResizeObserver={ResizeObserver}
        >
          <SpreadsheetColumn field="make" />
          <SpreadsheetColumn field="model" />
          <SpreadsheetColumn field="price">
            { children }
          </SpreadsheetColumn>
        </Spreadsheet>
      );
    });

    it('should render the expected number of cells.', () => {
      const rowCount = data.length;
      expect(getTableCellCount()).toEqual(rowCount * 3);
    });

    it('should use the custom render function.', () => {
      expect(children).toHaveBeenCalledTimes(data.length);
    });

    it('should render the price values.', () => {
      expect(getAllCellValuesFromSpreadsheetColumn('price')).toEqual([
        'Price',
        '$35,000',
        '$32,000',
        '$72,000',
      ]);
    });
  });

  describe('with editable cells', () => {
    beforeEach((done) => {
      render(
        <Spreadsheet
          domLayout='autoHeight'
          rowData={data}
          disableAnimations
          ResizeObserver={ResizeObserver}
          onContentReady={() => done()}
          onChange={onChange}
          onRowChange={onRowChange}
          onCellChange={onCellChange}
          onRemoveRow={onRemoveRow}
        >
          <EditableSpreadsheetColumn field="make" />
          <EditableSpreadsheetColumn field="model" />
          <EditableSpreadsheetColumn field="price" />
        </Spreadsheet>
      );
    });

    it('should render the car makes.', () => {
      expect(getAllCellValuesFromSpreadsheetColumn('make')).toEqual([
        'Make',
        'Toyota',
        'Ford',
        'Porsche',
      ]);
    });

    describe('after editing a value', () => {
      beforeEach(async () => {
        const cell = getCellFromTable('make', 0);
        const input = await findByDisplayValue(cell, 'Toyota');
        fireEvent.change(input, {target: {value: 'foo'}});

        return waitFor(() =>
          expect(screen.getByDisplayValue('foo')).toBeInTheDocument()
        );
      });

      it('should emit a change event.', () => {
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith([
          // We are not using our CurrencyInput so it will render pennies.
          { make: "foo"     , model: "Celica" , price: 3500000 } ,
          { make: "Ford"    , model: "Mondeo" , price: 3200000 } ,
          { make: "Porsche" , model: "Boxter" , price: 7200000 } ,
        ]);

        expect(onRowChange).toHaveBeenCalledTimes(1);
        expect(onRowChange).toHaveBeenCalledWith(
          0,
          {
            make: "foo",
            model: "Celica",
            price: 3500000
          },
          expect.any(String)
        );

        expect(onCellChange).toHaveBeenCalledTimes(1);
        expect(onCellChange).toHaveBeenCalledWith(0, 'make', 'foo');

        expect(onRemoveRow).not.toHaveBeenCalled();
      });
    });
  });

  describe('with customized editable cells', () => {
    let children;

    beforeEach((done) => {
      children = jest.fn(({onChange, ...props}, ref, {value}) =>
        <CurrencyInput
          data-testid="CurrencyInput"
          value={value}
          ref={ref}
          onValueChange={e => onChange(e.pennies)}
          {...props}
        />
      );

      render(
        <Spreadsheet
          data-testid="TableRoot"
          domLayout='autoHeight'
          rowData={data}
          onContentReady={() => done()}
          onChange={onChange}
          onRowChange={onRowChange}
          onCellChange={onCellChange}
          onRemoveRow={onRemoveRow}
          disableAnimations
          ResizeObserver={ResizeObserver}
        >
          <EditableSpreadsheetColumn field="make" />
          <EditableSpreadsheetColumn field="model" />
          <EditableSpreadsheetColumn field="price">
            { children }
          </EditableSpreadsheetColumn>
        </Spreadsheet>
      );
    });

    it('should render the price values.', () => {
      expect(getAllCellValuesFromSpreadsheetColumn('price')).toEqual([
        'Price',
        '$35,000.00',
        '$32,000.00',
        '$72,000.00',
      ]);
    });

    describe('after editing a value', () => {
      beforeEach(async () => {
        const input = EditableCellPO({rowName: 'Toyota', columnName: 'Price'});
        await input.fillIn('1');
      });

      it('should emit a change event.', async () => {
        await waitFor(() => {
          expect(onChange).toHaveBeenCalledWith([
            { make: "Toyota"  , model: "Celica" , price: 100 } ,
            { make: "Ford"    , model: "Mondeo" , price: 3200000 } ,
            { make: "Porsche" , model: "Boxter" , price: 7200000 } ,
          ]);
        });

        expect(onRowChange).toHaveBeenCalledWith(
          0,
          {
            make: "Toyota",
            model: "Celica",
            price: 100
          },
          expect.any(String)
        );

        expect(onCellChange).toHaveBeenCalledWith(0, 'price', 100);

        expect(onRemoveRow).not.toHaveBeenCalled();
      });
    });
  });

  describe('with selectable cells', () => {
    beforeEach((done) => {
      render(
        <Spreadsheet
          domLayout='autoHeight'
          rowData={[
            { make: "Toyota"  , model: "Celica" , color: '' } ,
            { make: "Toyota"  , model: "Corola" , color: 'red' } ,
            { make: "Toyota"  , model: "Tacoma" , color: 'red' } ,
          ]}
          onContentReady={() => done()}
          onChange={onChange}
          onRowChange={onRowChange}
          onCellChange={onCellChange}
          onRemoveRow={onRemoveRow}
          disableAnimations
          ResizeObserver={ResizeObserver}
        >
          <SpreadsheetColumn field="make" />
          <SelectableSpreadsheetColumn
            field="model"
            options={['Celica', 'Corola', 'Tacoma']}
            placeholder="Select a Model"
          />
        </Spreadsheet>
      );
    });

    it('should render the select menus.', () => {
      const selects = screen.getAllByTestId('SelectMenu');
      expect(selects.length).toEqual(3);

      selects.forEach((select) => {
        expect(getByText(select, 'Celica')).toBeInTheDocument();
        expect(getByText(select, 'Corola')).toBeInTheDocument();
        expect(getByText(select, 'Tacoma')).toBeInTheDocument();
      });
    });

    describe('after clicking a select trigger', () => {
      beforeEach(() => {
        const selectTrigger = getSelectableCell(document.body, 'model', 1);

        // TODO Figure out what is causing:
        // Warning: Can't perform a React state update on an unmounted component.
        // This is a no-op, but it indicates a memory leak in your application.
        // To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
        //   at /react-frontend/node_modules/@thesoulfresh/react-tools/lib/cjs/Popover.js:220:3
        //   at /react-frontend/node_modules/@thesoulfresh/react-tools/lib/cjs/Select.js:159:3
        //   at /react-frontend/src/components/inputs/select/Select.jsx:48:3
        //   at /react-frontend/src/components/tables/cells/SelectableCell.jsx:35:3
        //   at div
        //   at AgGridReact (/react-frontend/node_modules/ag-grid-react/lib/agGridReact.js:46:28)
        //   at div
        //   at Table (/react-frontend/src/components/tables/Table.jsx:173:3)
        jest.spyOn(console, 'error');

        fireEvent.click(selectTrigger);

        return waitForSelectableCellMenuToOpen(
          document.body,
          'model',
          1
        );
      });

      it('should show the options for that select.', () => {
        expect(getSelectableCellMenu(document.body, 'model', 1))
          .toBeInTheDocument()
      });

      describe('and then selecting a new value', () => {
        beforeEach(() => {
          const option = getSelectableCellMenuOption(
            document.body,
            'model',
            1,
            'Tacoma'
          );

          fireEvent.click(option);
        });

        it('should emit a change event.', () => {
          return waitFor(() => {
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith([
              { make: "Toyota"  , model: "Celica" , color: '' } ,
              { make: "Toyota"  , model: "Tacoma" , color: 'red' } ,
              { make: "Toyota"  , model: "Tacoma" , color: 'red' } ,
            ]);

            expect(onRowChange).toHaveBeenCalledTimes(1);
            expect(onRowChange).toHaveBeenCalledWith(
              1,
              {
                make: "Toyota",
                model: "Tacoma",
                color: 'red'
              },
              expect.any(String)
            );

            expect(onCellChange).toHaveBeenCalledTimes(1);
            expect(onCellChange).toHaveBeenCalledWith(1, 'model', 'Tacoma');

            expect(onRemoveRow).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('with the totals row', () => {
    beforeEach((done) => {
      data = [
        { make: "Toyota", model: "Corola"    , count: 100 , price: 35000 } ,
        { make: "Honda" , model: "Accord"    , count:  20 , price: 32000 } ,
        { make: "Chevy" , model: "Silvarado" , count: 132 , price: 72000 } ,
      ];

      render(
        <Spreadsheet
          domLayout='autoHeight'
          rowData={data}
          totals
          onContentReady={() => done()}
          disableAnimations
          ResizeObserver={ResizeObserver}
        >
          <SpreadsheetColumn
            field="make"
            footer="Total"
          />
          <SpreadsheetColumn
            field="model"
          />
          <SpreadsheetColumn
            field="count"
            reduce={(value, total) => total + value}
          />
          <EditableSpreadsheetColumn
            field="price"
            reduce={(value, total) => total + value}
            footer={(props, ref, {value}) =>
              <Currency {...props} ref={ref} value={value} />
            }
          >
            {({onChange, ...props}, ref, {value}) =>
              <CurrencyInput
                transparent
                currency="USD"
                locale="en-US"
                value={value}
                {...props}
                ref={ref}
                onValueChange={e => onChange(e.pennies)}
              />
            }
          </EditableSpreadsheetColumn>
        </Spreadsheet>
      );
    });

    it('should add header and footer rows to the data.', () => {
      expect(getTableRowCount()).toEqual(data.length);
    });

    it('should leave the footer cell empty if it does not have the footer or reducer props.', () => {
      expect(getCellFromTableFooter('model').textContent).toEqual('');
    });

    it('should show the footer text if only the footer prop is passed.', () => {
      return waitFor(() => {
        expect(getCellFromTableFooter('make').textContent).toEqual('Total');
      });
    });

    it('should show the column total when using the reduce prop.', () => {
      return waitFor(() => {
        expect(getCellFromTableFooter('count').textContent).toEqual('252');
        expect(getCellFromTableFooter('price').textContent).toEqual('$139,000');
      });
    });
  });

  describe('with user controlled rows', () => {
    beforeEach((done) => {
      data = [
        { make: "Toyota", count: 100 , price: 3500000 } ,
        { make: "Honda" , count:  20 , price: 3200000 } ,
        { make: "Chevy" , count: 132 , price: 7200000 } ,
      ];

      render(
        <Spreadsheet
          domLayout='autoHeight'
          rowData={data}
          userControlledRows
          onChange={onChange}
          onRowChange={onRowChange}
          onCellChange={onCellChange}
          onRemoveRow={onRemoveRow}
          onContentReady={() => done()}
          disableAnimations
          ResizeObserver={ResizeObserver}
        >
          <SpreadsheetColumn
            field="make"
          />
          <EditableSpreadsheetColumn
            field="count"
            validate={v => v != null ? Number(v) : v}
          />
          <EditableSpreadsheetColumn
            field="price"
            validate={v => v != null ? Number(v) : v}
          >
            {({onChange, ...props}, ref, {value}) =>
              <CurrencyInput
                transparent
                currency="USD"
                locale="en-US"
                value={value}
                {...props}
                ref={ref}
                onValueChange={e => onChange(e.pennies)}
              />
            }
          </EditableSpreadsheetColumn>
        </Spreadsheet>
      );
    });

    it('should add a column with the remove buttons.', () => {
      const allRemoveButtons = getAllRemoveCells(document.body);
      expect(allRemoveButtons.length).toBeGreaterThan(0);
      expect(allRemoveButtons.length).toEqual(data.length + 1);
    });

    it('should add an empty row at the bottom of the grid.', () => {
      return waitFor(() => {
        expect(getTableRowCount()).toEqual(data.length + 1);
        expect(getAllCellValuesFromTableRow(data.length)).toEqual(['', '', '']);
      });
    });

    describe('after editing the first row', () => {
      beforeEach(async () => {
        await waitFor(() => getEditableCell(document.body, 'count', 0));
        const input = getEditableCell(document.body, 'count', 0);
        fireEvent.change(input, {target: {value: 200}});
        return waitForTrue(() => onChange.mock.calls.length > 0);
      });

      it('should emit a change event.', () => {
        expect(onChange).toHaveBeenCalledWith([
          {...data[0], count: 200, sortOrder: expect.any(String)},
          {...data[1], sortOrder: expect.any(String)},
          {...data[2], sortOrder: expect.any(String)},
        ]);

        expect(onRowChange).toHaveBeenCalledWith(
          0,
          {
            ...data[0],
            count: 200,
            sortOrder: expect.any(String)
          },
          expect.any(String)
        );

        expect(onCellChange).toHaveBeenCalledWith(0, 'count', '200');

        expect(onRemoveRow).not.toHaveBeenCalled();
      });

      it('should not change the number of rows.', () => {
        expect(getTableRowCount()).toEqual(data.length + 1);
      });
    });

    describe('after editing the last row', () => {
      beforeEach(() => {
        const input = getEditableCell(document.body, 'count', 3);
        fireEvent.change(input, {target: {value: 50}});
        return waitForTrue(() => onChange.mock.calls.length > 0);
      });

      // FLAKE Update this test to bigTest to hopefully fix this.
      // TODO This flaky test may have been fixed by adding the return
      xit('should emit a change event.', () => {
        return waitFor(() => {
          expect(onChange).toHaveBeenCalledWith([
            ...data,
            {count: 50},
          ]);

          expect(onRowChange).toHaveBeenCalled();
          expect(onCellChange).toHaveBeenCalled();
          expect(onRemoveRow).not.toHaveBeenCalled();
        }, {timeout: 1000});
      });

      it('should add a new row to the bottom of the grid.', () => {
        expect(getTableRowCount()).toEqual(data.length + 2);
      });
    });

    describe('after clicking the first remove buttons', () => {
      beforeEach(() => {
        const button = getAllRemoveCells(document.body)[0];
        fireEvent.click(button);
        return waitForTrue(() => onChange.mock.calls.length > 0);
      });

      it('should remove the associated row.', () => {
        // The data - 1 row + 1 empty row
        expect(getTableRowCount()).toEqual(data.length);
        expect(getAllCellValuesFromTableData()).toEqual([
          ['Honda',  '20', '$32,000.00'],
          ['Chevy', '132', '$72,000.00'],
          [     '',    '',           ''],
        ]);
      });

      it('should emit a change event.', () => {
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith([
          {...data[1], sortOrder: expect.any(String)},
          {...data[2], sortOrder: expect.any(String)},
        ]);
        expect(onRemoveRow).toHaveBeenCalledTimes(1);
        expect(onRowChange).not.toHaveBeenCalled();
        expect(onCellChange).not.toHaveBeenCalled();
      });
    });

    describe('after clicking the last remove button.', () => {
      beforeEach((done) => {
        const button = getAllRemoveCells(document.body)[data.length];
        fireEvent.click(button);

        // There will not be any externally observable effect
        // of the remove button click so we'll just wait for a while.
        setTimeout(done, 500);
      });

      // TODO Figure out why this test fails.
      // For some reason, this test adds the empty row at the top
      // of the list instead of the bottom. However, running the code
      // in a browser works fine.
      xit('should keep an empty row at the bottom of the grid.', () => {
        expect(getTableRowCount()).toEqual(data.length + 1);
        expect(getAllCellValuesFromTableData()).toEqual([
          ['Toyota', '100', '$35,000'],
          [ 'Honda',  '20', '$32,000'],
          [ 'Chevy', '132', '$72,000'],
          [      '',    '',        ''],
        ]);
      });

      it('should not emit a change event.', () => {
        expect(onChange).not.toHaveBeenCalled();
        expect(onRowChange).not.toHaveBeenCalled();
        expect(onCellChange).not.toHaveBeenCalled();
      });

      // TODO Figure out why checking onRemoveRow crashes Jest
      xit('should not emit an onRemoveRow event', () => {
        expect(onRemoveRow).not.toHaveBeenCalled();
      })
    });
  });
});

