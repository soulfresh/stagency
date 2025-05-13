import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';
import { Currency } from '@thesoulfresh/react-tools';

import {
  Spreadsheet,
  SpreadsheetColumn,
  EditableSpreadsheetColumn,
  SelectableSpreadsheetColumn,
  getStandardColumnWidths,
  PercentInput,
  CurrencyInput,
} from '~/components';

import styles from './ExpensesSpreadsheet.module.scss';
import {ExpenseTypePropType} from '~/model';

function min(...values) {
  return Math.min(...values.filter(v => v != null));
}

/**
 * `<ExpensesSpreadsheet>` is used to track all expenses related to a deal.
 *
 * ### Spreadsheet Height
 *
 * Due to the way `ag-grid` scrolling tables work, you will need to specify
 * a height on the parent container of this table in order to see the data.
 * Otherwise, it receives a height of 0px.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {*[]} [props.data]
 * @param {object[]} props.types
 * @param {string} [props.currency]
 * @param {number} [props.sellableTickets]
 * @param {number} [props.sellableGrossPotential]
 * @param {number} [props.breakEvenTickets]
 * @param {number} [props.breakEvenGrossPotential]
 * @param {string} [props.domLayout]
 * @param {function} [props.onRowChange]
 * @param {function} [props.onRemoveRow]
 * @param {function} [props.onContentReady]
 * @param {function} [props.ResizeObserver]
 */
export function ExpensesSpreadsheet({
  data,
  currency,
  sellableTickets = 0,
  sellableGrossPotential = 0,
  breakEvenTickets = 0,
  breakEvenGrossPotential = 0,
  types,
  className,
  domLayout = "autoHeight",
  ...rest
}) {
  const currencyInput = ({className, onChange, ...props}, ref, {value}) => (
    <CurrencyInput
      className={combineClasses(className, styles.numberCell)}
      transparent
      {...props}
      ref={ref}
      value={value}
      onValueChange={({pennies}) => onChange(pennies)}
      currency={currency}
      decimalScale={2}
      fixedDecimalScale
    />
  );

  const currencyDisplay = ({className, ...props}, ref, {value}) => (
    <Currency
      className={combineClasses(className, styles.numberCell)}
      {...props}
      ref={ref}
      value={value}
      currency={currency}
      pennies
      decimalScale={2}
      fixedDecimalScale
    />
  );

  const {m, l, xl} = getStandardColumnWidths();

  return (
    <Spreadsheet
      data-testid="ExpensesSpreadsheet"
      aria-label="Expenses"
      className={combineClasses(styles.ExpensesSpreadsheet, className)}
      rowData={data}
      userControlledRows
      domLayout={domLayout}
      {...rest}
    >
      <EditableSpreadsheetColumn
        field="name"
        headerName="Name"
        placeholder="Expense Name"
        headerTooltip="The category or type of expense (ex. ASCAP, Advertising, Catering, etc.)"
        width={m}
      />

      <SelectableSpreadsheetColumn
        headerName="Expense Type"
        headerTooltip="Determines how the expense is calculated (ex. per-ticket, flat cost, etc.)"
        field="type"
        placeholder="Select Type"
        options={types}
        optionToString={t => t.comment}
        width={l}
      />

      <EditableSpreadsheetColumn
        field="cost"
        headerTooltip="The value of your cost as it relates to the Expense Type."
        width={m}
        valueGetter={({data}) => {
          return {
            value: data.cost,
            type: data.type,
          }
        }}
        children={({className, onChange, ...props}, ref, {value, data, ...rest}) => {
          switch (value.type?.value) {
            case 'PERCENTAGE_COST':
              return (
                <PercentInput
                  className={combineClasses(className, styles.numberCell)}
                  transparent
                  {...props}
                  ref={ref}
                  value={value.value}
                  fixedDecimalScale
                  decimalScale={2}
                  onValueChange={e => onChange(e.integer)}
                />
              )
            default:
              return (
                <CurrencyInput
                  className={combineClasses(className, styles.numberCell)}
                  transparent
                  {...props}
                  ref={ref}
                  value={value.value}
                  onValueChange={({pennies}) => onChange(pennies)}
                  currency={currency}
                  decimalScale={2}
                  fixedDecimalScale
                />
              )
          }
        }}
      />

      {/* Allow users to enter the maximum even if the Event Type is "Flat Cost"
          so that switching expense type doesn't clear the maximum field if the
          user accidentally selected "Flat Cost". */}
      <EditableSpreadsheetColumn
        field="maximum"
        headerName="Max Amount"
        headerTooltip="The maximum limit of the expense (optional)"
        width={m}
        children={currencyInput}
      />

      <SpreadsheetColumn
        field="breakEven"
        headerName="At Break Even"
        headerTooltip="The cost of the expense after ticket sales reach break-even"
        width={m}
        derived
        valueGetter={({data: {flatCost = 0, perTicketCost = 0, percentageCost = 0, type, maximum, cost}}) => {
          if (type && cost) {
            switch(type?.value) {
              case 'FLAT_COST':
                return min(cost, maximum);
              case 'PER_TICKET_COST':
                return min(cost * breakEvenTickets, maximum);
              case 'PERCENTAGE_COST':
                return min((cost / 100) * breakEvenGrossPotential, maximum);
              default: return 0;
            }
          } else {
            return 0;
          }
        }}
        children={currencyDisplay}
      />

      <SpreadsheetColumn
        field="sellout"
        headerName="At Sell Out"
        headerTooltip="The cost of the expense after all tickets are sold"
        width={m}
        derived
        valueGetter={({data: {flatCost = 0, perTicketCost = 0, percentageCost = 0, cost, type, maximum}}) => {
          if (type && cost) {
            switch(type?.value) {
              case 'FLAT_COST': return min(cost, maximum);
              case 'PER_TICKET_COST': return min(cost * sellableTickets, maximum);
              case 'PERCENTAGE_COST': return min((cost / 100) * sellableGrossPotential, maximum);
              default: return 0;
            }
          } else {
            return 0;
          }
        }}
        children={currencyDisplay}
      />

      <EditableSpreadsheetColumn
        field="notes"
        minWidth={xl}
      />
    </Spreadsheet>
  );
}

ExpensesSpreadsheet.propTypes = {
  /**
   * The table data.
   */
  data: PropTypes.arrayOf(PropTypes.object),
  /**
   * The list of expense types that the user can select from.
   */
  types: PropTypes.arrayOf(ExpenseTypePropType).isRequired,
  /**
   * The currencly used for dollar values.
   */
  currency: PropTypes.string,
  /**
   * The total number of sellable tickets from the TicketScalingSpreadsheet
   */
  sellableTickets: PropTypes.number.isRequired,
  /**
   * The total gross potential dollar value from the TicketScalingSpreadsheet
   */
  sellableGrossPotential: PropTypes.number.isRequired,
  /**
   * The minimum number tickets to sell in order to break even on the event.
   */
  breakEvenTickets: PropTypes.number.isRequired,
  /**
   * The nimimum dollar value the event must make in order to break even.
   */
  breakEvenGrossPotential: PropTypes.number.isRequired,
  ResizeObserver: PropTypes.func,
  onContentReady: PropTypes.func,
};

