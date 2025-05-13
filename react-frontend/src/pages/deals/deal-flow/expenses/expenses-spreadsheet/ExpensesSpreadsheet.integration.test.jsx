import { render, screen } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';

import { matchingArray, any, anything, EXPENSE_TYPES } from '~/test';
import {
  SpreadsheetPageObject as Spreadsheet,
  SpreadsheetRowPageObject as Row,
  EditableCellPageObject as EditableCell,
  SelectableCellPO as SelectableCell,
} from '~/components/page-objects';
import { ExpensesSpreadsheet } from './ExpensesSpreadsheet.jsx';

const timeout = 15000;

// Set a longer timeout for these tests because they can take a while
// when running in parallel with other tests.
if (jest?.setTimeout) jest.setTimeout(timeout);

describe('ExpensesSpreadsheet', function() {
  const sellableTickets = 10;
  const sellableGrossPotential = 10000;
  const breakEvenTickets = 5;
  const breakEvenGrossPotential = 5000;

  const maxAmountCell = EditableCell({rowName: 'ASCAP', columnName: 'Max Amount'});

  beforeEach((done) => {
    render(
      <ExpensesSpreadsheet
        data={[{name: 'ASCAP'}, {name: 'APRA'}]}
        types={EXPENSE_TYPES}
        domLayout="print"
        sellableTickets={sellableTickets}
        sellableGrossPotential={sellableGrossPotential}
        breakEvenTickets={breakEvenTickets}
        breakEvenGrossPotential={breakEvenGrossPotential}
        onContentReady={() => done()}
        ResizeObserver={ResizeObserver}
      />
    );
  });

  it('should render', () => {
    expect(screen.getByTestId('ExpensesSpreadsheet')).toBeInTheDocument();
  });

  it('should render the given expenses.', async () => {
    await Spreadsheet().has({cellValues: matchingArray([
      ['Name'  , 'Expense Type' , 'Cost' , 'Max Amount' , 'At Break Even' , 'At Sell Out' , 'Notes' , 'Remove Row'] ,
      ['ASCAP' , 'Select Type'  , ''     , ''           , '$0.00'         , '$0.00'       , ''      , anything()]  ,
      ['APRA'  , 'Select Type'  , ''     , ''           , '$0.00'         , '$0.00'       , ''      , anything()]  ,
      [''      , 'Select Type'  , ''     , ''           , '$0.00'         , '$0.00'       , ''      , anything()]  ,
    ])});
  });

  describe('after setting a Flat Cost', () => {
    beforeEach(async () => {
      await SelectableCell({rowName: 'ASCAP', columnName: 'Expense Type'}).choose('Flat Cost');
      await EditableCell({rowName: 'ASCAP', columnName: 'Cost'}).fillIn('3');
    });

    it('should update the derived columns.', async () => {
      await Row('ASCAP').has({cellValues: matchingArray([
        'ASCAP',
        'Flat Cost', // Type
        '$3.00',     // Cost
        '',          // Max Amount
        '$3.00',     // At Break Even
        '$3.00',     // At Sell Out
        '',
        any(String)
      ])});
    });
  });

  describe('after setting a Per Ticket Cost', () => {
    beforeEach(async () => {
      await SelectableCell({rowName: 'ASCAP', columnName: 'Expense Type'}).choose('Per Ticket Cost');
      await EditableCell({rowName: 'ASCAP', columnName: 'Cost'}).fillIn('8');
    });

    it('should update the derived columns.', async () => {
      await Row('ASCAP').has({cellValues: matchingArray([
        'ASCAP',
        'Per Ticket Cost', // Type
        '$8.00',           // Cost
        '',                // Max Amount
        `$40.00`,          // At Break Even
        `$80.00`,          // At Sell Out
        '',
        any(String)
      ])});
    });
  });

  describe('after setting a Percentage Cost', () => {
    beforeEach(async () => {
      await SelectableCell({rowName: 'ASCAP', columnName: 'Expense Type'}).choose('Percentage Cost');
      await EditableCell({rowName: 'ASCAP', columnName: 'Cost'}).fillIn('5');
    });

    it('should update the derived columns.', async () => {
      await Row('ASCAP').has({cellValues: matchingArray([
        'ASCAP',
        'Percentage Cost', // Type
        '5.00%',           // Cost
        '',                // Max Amount
        '$250.00',         // At Break Even
        '$500.00',         // At Sell Out
        '',
        'close.svg'
      ])});
    });
  });

  describe('with a max cost', () => {
    beforeEach(async () => {
      await maxAmountCell.fillIn('5');
    });

    describe('and a flat cost', () => {
      beforeEach(async () => {
        await SelectableCell({rowName: 'ASCAP', columnName: 'Expense Type'}).choose('Flat Cost');
        await EditableCell({rowName: 'ASCAP', columnName: 'Cost'}).fillIn('6');
      });

      it('should not allow expenses to exceed the max cost.', async () => {
        await Row('ASCAP').has({cellValues: matchingArray([
          'ASCAP',
          'Flat Cost', // Type
          '$6.00',     // Cost
          '$5.00',     // Max Amount
          '$5.00',     // At Break Even
          '$5.00',     // At Sell Out
          '',
          'close.svg'
        ])});
      });
    });

    describe('and a pre ticket cost', () => {
      beforeEach(async () => {
        await SelectableCell({rowName: 'ASCAP', columnName: 'Expense Type'}).choose('Per Ticket Cost');
        await EditableCell({rowName: 'ASCAP', columnName: 'Cost'}).fillIn('2');
      });

      it('should not allow expenses to exceed the max cost.', async () => {
        await Row('ASCAP').has({cellValues: matchingArray([
          'ASCAP',
          'Per Ticket Cost', // Type
          '$2.00',           // Cost
          '$5.00',           // Max Amount
          '$5.00',           // At Break Even
          '$5.00',           // At Sell Out
          '',
          'close.svg'
        ])});
      });
    });

    describe('and a percentage cost', () => {
      beforeEach(async () => {
        await SelectableCell({rowName: 'ASCAP', columnName: 'Expense Type'}).choose('Percentage Cost');
        await EditableCell({rowName: 'ASCAP', columnName: 'Cost'}).fillIn('9');
      });

      it('should not allow expenses to exceed the max cost.', async () => {
        await Row('ASCAP').has({cellValues: matchingArray([
          'ASCAP',
          'Percentage Cost', // Type
          '9.00%',           // Cost
          '$5.00',           // Max Amount
          '$5.00',           // At Break Even
          '$5.00',           // At Sell Out
          '',
          'close.svg'
        ])});
      });
    });
  });
});

