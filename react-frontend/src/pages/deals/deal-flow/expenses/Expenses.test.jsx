import React from 'react';
import { render } from '@testing-library/react';

import { matchingArray, anything, EXPENSE_TYPES } from '~/test';
import {
  SpreadsheetPageObject as Spreadsheet,
  TextCellPageObject as TextCell,
} from '~/components/page-objects';
import { ResizeObserver } from '~/test';
import { generate as mock } from '~/services/mocks';
import { Expenses } from './Expenses.jsx';

describe('Expenses', function() {
  let deal;

  beforeEach((done) => {
    const perTicketType = EXPENSE_TYPES.find(t => t.value === 'PER_TICKET_COST');
    const percentageType = EXPENSE_TYPES.find(t => t.value === 'PERCENTAGE_COST');
    deal = {
      tickets: [
        mock.app_ticket_scaling({price: 1, capacity: 100, complimentary: 10, kills: 5}), //  $85
        mock.app_ticket_scaling({price: 2, capacity: 200, complimentary:  5, kills: 5}), // $380
                                                                                  // Total: $465
      ],
      expenses: [
        mock.app_expense({name: 'Facility', type: perTicketType , cost:  10, maximum: null}), // $0.10
        mock.app_expense({name: 'PROs'    , type: percentageType, cost: 100, maximum: null}), // 1%
      ],
    };

    render(
      <Expenses
        deal={deal}
        ResizeObserver={ResizeObserver}
        onContentReady={() => done()}
        domLayout="print"
      />
    );
  });

  it('should set the correct derived values.', async () => {
    await TextCell({rowName: 'Facility', columnName: 'At Sell Out'}).has({value: '$27.50'});

    await Spreadsheet().has({cellValues: matchingArray([
      ['Name'    , 'Expense Type'    , 'Cost'  , 'Max Amount' , 'At Break Even' , 'At Sell Out' , 'Notes'    , 'Remove Row'] ,
      ['Facility', 'Per Ticket Cost' , '$0.10' , ''           , '$0.00'         , '$27.50'      , anything() , anything()]  ,
      ['PROs'    , 'Percentage Cost' , '1.00%' , ''           , '$0.00'         , '$4.65'       , anything() , anything()]  ,
      [''        , 'Select Type'     , ''      , ''           , '$0.00'         , '$0.00'       , ''         , anything()]  ,
    ])});
  });
});
