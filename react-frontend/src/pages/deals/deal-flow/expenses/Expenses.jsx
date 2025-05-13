import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import { dealSellableTickets, dealSellableGrossPotential } from '~/model';
import { TitleL } from '~/components';
import { ExpensesSpreadsheet } from './expenses-spreadsheet';

import styles from './Expenses.module.scss';

const ExpensesSpreadsheetMemo = React.memo(ExpensesSpreadsheet);

/**
 * `<Expenses>`
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {object} props.config
 * @param {object} [props.deal]
 * @param {function} [props.onExpenseUpdate]
 * @param {function} [props.onExpenseRemove]
 * @param {function} [props.ResizeObserver]
 * @param {function} [props.onContentReady]
 * @param {string} [props.domLayout]
 * @return {React.ReactElement}
 */
export function Expenses({
  className,
  deal = {},
  config,
  onExpenseUpdate,
  onExpenseRemove,
  ResizeObserver,
  onContentReady,
  domLayout,
  ...rest
}) {
  // TODO Need to find out the math around the break even costs from Nic.
  // TODO Delay rendering of the grid so we're not painting as much data.
  return (
    <div data-testid="Expenses"
      className={combineClasses(styles.Expenses, className)}
      {...rest}
    >
      <TitleL>Expenses</TitleL>
      <ExpensesSpreadsheetMemo
        className={styles.ExpensesSpreadsheet}
        data={deal?.expenses}
        types={config?.EXPENSE_TYPES}
        sellableTickets={dealSellableTickets(deal.tickets)}
        sellableGrossPotential={dealSellableGrossPotential(deal.tickets)}
        breakEvenTickets={0}
        breakEvenGrossPotential={0}
        onRowChange={onExpenseUpdate}
        onRemoveRow={onExpenseRemove}
        ResizeObserver={ResizeObserver}
        onContentReady={onContentReady}
        domLayout={domLayout}
      />
    </div>
  );
}

Expenses.propTypes = {
  /**
   * The currencly used for dollar values.
   */
  currency: PropTypes.string,
  /**
   * The current deal being edited.
   */
  deal: PropTypes.object.isRequired,
  onExpenseUpdate: PropTypes.func,
  onExpenseRemove: PropTypes.func,
  ResizeObserver: PropTypes.func,
  onContentReady: PropTypes.func,
  domLayout: PropTypes.string,
};

