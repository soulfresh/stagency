import React from 'react';
import {
  render,
} from '@testing-library/react';
import ResizeObserver from "resize-observer-polyfill";

import {
  silenceLogs,
  silenceActWarning,
  TICKET_TYPES,
} from '~/test';
import {
  SpreadsheetPageObject,
  SpreadsheetRowPageObject,
  EditableCellPageObject,
} from '~/components/page-objects';
import { TicketScalingSpreadsheet } from './TicketScalingSpreadsheet.jsx';

// I'm fairly certain we can get rid of these long time outs by replacing AgGrid
const timeout = 20000;

// Set a longer timeout for these tests because they can take a while
// when running in parallel with other tests.
if (jest?.setTimeout) jest.setTimeout(timeout);

describe('TicketScalingSpreadsheet', function() {
  let data;

  beforeEach(() => {
    // This is not idea but going with it until we can replace AgGrid
    silenceActWarning();
  });

  describe('without data', () => {
    beforeEach((done) => {
      // Disable the console warnings that there are no rows in the data.
      silenceLogs('warn')

      render(
        <TicketScalingSpreadsheet
          types={TICKET_TYPES}
          onContentReady={() => done()}
          ResizeObserver={ResizeObserver}
        />
      );
    });

    it('should render the table headers.', async () => {
      await SpreadsheetPageObject().has({headers: [
        'Type',
        'Cap.',
        'Comps',
        'Kills',
        'Sellable',
        'Price',
        'Gross Potential',
        'Sellable Gross Potential',
        'Facility',
        'Charity',
        'Secondary',
        'Other',
        'Net Price',
        'Notes',
        'Remove Row',
      ]});
    });

    it('should add an empty row.', async () => {
      await SpreadsheetPageObject().has({rowCount: 1});
    });

    it('should render the expected footer values.', async () => {
      await SpreadsheetRowPageObject('Total').has({cellValues: [
        'Total', // type
        '0', // capcity
        '0', // complimentary
        '0', // kills
        '0', // sellable
        '', // price
        '$0.00', // gross potential
        '$0.00', // sellable gross potential
        '', // facility
        '', // charity
        '', // secondary
        '', // other
        '', // net price
        '', // notes
      ]})
    });
  });

  describe('with existing data', () => {
    beforeEach((done) => {
      data = [
        {type: TICKET_TYPES[0], capacity: 10, complimentary: 2, kills: 1, price: 1000, facility: 4, charity: 3, secondary: 2, other: 1, notes: 'first row notes'},
        {type: TICKET_TYPES[1], capacity: 20, complimentary: 4, kills: 2, price: 2000, facility: 8, charity: 6, secondary: 4, other: 2, notes: 'second row notes'},
      ];

      render(
        <TicketScalingSpreadsheet
          types={TICKET_TYPES}
          data={data}
          onContentReady={() => done()}
          ResizeObserver={ResizeObserver}
        />
      );
    });

    it('should render', async () => {
      await SpreadsheetPageObject().exists();
    });

    it('should render the expected data values.', async () => {
      await SpreadsheetRowPageObject('GA Standing').has({cellValues: [
        'GA Standing', // type
        '10', // capcity
        '2', // complimentary
        '1', // kills
        '7', // sellable
        '$10.00', // price
        '$100.00', // gross potential
        '$70.00', // sellable gross potential
        '$0.04', // facility
        '$0.03', // charity
        '$0.02', // secondary
        '$0.01', // other
        '$9.90', // net price
        'first row notes', // notes
      ]})
    });

    it('should render the correct footer values.', async () => {
      await SpreadsheetRowPageObject('Total').has({cellValues: [
        'Total', // type
        '30', // capcity
        '6', // complimentary
        '3', // kills
        '21', // sellable
        '', // price
        '$500.00', // gross potential
        '$350.00', // sellable gross potential
        '', // facility
        '', // charity
        '', // secondary
        '', // other
        '', // net price
        '', // notes
      ]})
    });

    describe('after changing a ticket capacity', () => {
      beforeEach(async () => {
        const cell = EditableCellPageObject({columnName: 'Cap.', rowName: 'GA Standing'});
        await cell.fillIn('20');
      });

      it('should refresh the edited row.', async () => {
        await SpreadsheetRowPageObject('GA Standing').has({cellValues: [
          'GA Standing', // type
          '20', // capcity
          '2', // complimentary
          '1', // kills
          '17', // sellable
          '$10.00', // price
          '$200.00', // gross potential
          '$170.00', // sellable gross potential
          '$0.04', // facility
          '$0.03', // charity
          '$0.02', // secondary
          '$0.01', // other
          '$9.90', // net price
          'first row notes', // notes
        ]});
      });

      it('should update the footer values.', async () => {
        await SpreadsheetRowPageObject('Total').has({cellValues: [
          'Total', // type
          '40', // capcity
          '6', // complimentary
          '3', // kills
          '31', // sellable
          '', // price
          '$600.00', // gross potential
          '$450.00', // sellable gross potential
          '', // facility
          '', // charity
          '', // secondary
          '', // other
          '', // net price
          '', // notes
        ]});
      });
    });

    describe('after changing a ticket comps', () => {
      beforeEach(async () => {
        const cell = EditableCellPageObject({columnName: 'Comps', rowName: 'GA Standing'});
        await cell.fillIn('3');
      });

      it('should refresh the edited row.', async () => {
        await SpreadsheetRowPageObject('GA Standing').has({cellValues: [
          'GA Standing', // type
          '10', // capcity
          '3', // complimentary
          '1', // kills
          '6', // sellable
          '$10.00', // price
          '$100.00', // gross potential
          '$60.00', // sellable gross potential
          '$0.04', // facility
          '$0.03', // charity
          '$0.02', // secondary
          '$0.01', // other
          '$9.90', // net price
          'first row notes', // notes
        ]});
      });

      it('should refresh the footer row.', async () => {
        await SpreadsheetRowPageObject('Total').has({cellValues: [
          'Total', // type
          '30', // capcity
          '7', // complimentary
          '3', // kills
          '20', // sellable
          '', // price
          '$500.00', // gross potential
          '$340.00', // sellable gross potential
          '', // facility
          '', // charity
          '', // secondary
          '', // other
          '', // net price
          '', // notes
        ]});
      });
    });

    describe('after changing a ticket kills', () => {
      beforeEach(async () => {
        const cell = EditableCellPageObject({columnName: 'Kills', rowName: 'GA Standing' /*, rowName: 'GA Seated'*/});
        await cell.fillIn('3');
        // const cell = getCellFromTableData('kills', 0);
        // const input = await findByRole(cell, 'textbox');
        // fireEvent.change(input, {target: {value: '3'}});
      });

      it('should refresh the edited row.', async () => {
        await SpreadsheetRowPageObject('GA Standing').has({cellValues: [
          'GA Standing', // type
          '10', // capcity
          '2', // complimentary
          '3', // kills
          '5', // sellable
          '$10.00', // price
          '$100.00', // gross potential
          '$50.00', // sellable gross potential
          '$0.04', // facility
          '$0.03', // charity
          '$0.02', // secondary
          '$0.01', // other
          '$9.90', // net price
          'first row notes', // notes
        ]});
      });

      it('should refresh the footer row.', async () => {
        await SpreadsheetRowPageObject('Total').has({cellValues: [
          'Total', // type
          '30', // capcity
          '6', // complimentary
          '5', // kills
          '19', // sellable
          '', // price
          '$500.00', // gross potential
          '$330.00', // sellable gross potential
          '', // facility
          '', // charity
          '', // secondary
          '', // other
          '', // net price
          '', // notes
        ]});
      });
    });

    describe('after changing a ticket price', () => {
      beforeEach(async () => {
        const cell = EditableCellPageObject({columnName: 'Price', rowName: 'GA Standing'});
        await cell.fillIn('1');
      });

      it('should refresh the edited row.', async () => {
        await SpreadsheetRowPageObject('GA Standing').has({cellValues: [
          'GA Standing', // type
          '10', // capcity
          '2', // complimentary
          '1', // kills
          '7', // sellable
          '$1.00', // price
          '$10.00', // gross potential
          '$7.00', // sellable gross potential
          '$0.04', // facility
          '$0.03', // charity
          '$0.02', // secondary
          '$0.01', // other
          '$0.90', // net price
          'first row notes', // notes
        ]});
      });

      it('should refresh the footer row.', async () => {
        await SpreadsheetRowPageObject('Total').has({cellValues: [
          'Total', // type
          '30', // capcity
          '6', // complimentary
          '3', // kills
          '21', // sellable
          '', // price
          '$410.00', // gross potential
          '$287.00', // sellable gross potential
          '', // facility
          '', // charity
          '', // secondary
          '', // other
          '', // net price
          '', // notes
        ]});
      });
    });

    describe('after changing a ticket facility charge', () => {
      beforeEach(async () => {
        const cell = EditableCellPageObject({columnName: 'Facility', rowName: 'GA Standing'});
        await cell.fillIn('1');
      });

      it('should update the net ticket price.', async () => {
        await SpreadsheetRowPageObject('GA Standing').has({cellValues: [
          'GA Standing', // type
          '10', // capcity
          '2', // complimentary
          '1', // kills
          '7', // sellable
          '$10.00', // price
          '$100.00', // gross potential
          '$70.00', // sellable gross potential
          '$1.00', // facility
          '$0.03', // charity
          '$0.02', // secondary
          '$0.01', // other
          '$8.94', // net price
          'first row notes', // notes
        ]});
      });
    });

    describe('after changing a ticket charity charge', () => {
      beforeEach(async () => {
        const cell = EditableCellPageObject({columnName: 'Charity', rowName: 'GA Standing'});
        await cell.fillIn('1');
      });

      it('should update the net ticket price.', async () => {
        await SpreadsheetRowPageObject('GA Standing').has({cellValues: [
          'GA Standing', // type
          '10', // capcity
          '2', // complimentary
          '1', // kills
          '7', // sellable
          '$10.00', // price
          '$100.00', // gross potential
          '$70.00', // sellable gross potential
          '$0.04', // facility
          '$1.00', // charity
          '$0.02', // secondary
          '$0.01', // other
          '$8.93', // net price
          'first row notes', // notes
        ]});
      });
    });

    describe('after changing a ticket secondary charge', () => {
      beforeEach(async () => {
        const cell = EditableCellPageObject({columnName: 'Secondary', rowName: 'GA Standing'});
        await cell.fillIn('1');
      });

      it('should update the net ticket price.', async () => {
        await SpreadsheetRowPageObject('GA Standing').has({cellValues: [
          'GA Standing', // type
            '10', // capcity
            '2', // complimentary
            '1', // kills
            '7', // sellable
            '$10.00', // price
            '$100.00', // gross potential
            '$70.00', // sellable gross potential
            '$0.04', // facility
            '$0.03', // charity
            '$1.00', // secondary
            '$0.01', // other
            '$8.92', // net price
            'first row notes', // notes
        ]});
      });
    });

    describe('after changing a ticket other charges', () => {
      beforeEach(async () => {
        const cell = EditableCellPageObject({columnName: 'Other', rowName: 'GA Standing'});
        await cell.fillIn('1');
      });

      it('should update the net price.', async () => {
        await SpreadsheetRowPageObject('GA Standing').has({cellValues: [
          'GA Standing', // type
          '10', // capcity
          '2', // complimentary
          '1', // kills
          '7', // sellable
          '$10.00', // price
          '$100.00', // gross potential
          '$70.00', // sellable gross potential
          '$0.04', // facility
          '$0.03', // charity
          '$0.02', // secondary
          '$1.00', // other
          '$8.91', // net price
          'first row notes', // notes
        ]});
      });
    });
  });
});

