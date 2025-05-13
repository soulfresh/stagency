import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';
import { NumberDisplay, Currency } from '@thesoulfresh/react-tools';

import {
  sellableTickets,
  sellableGrossPotential,
} from '~/model';
import {
  Spreadsheet,
  SpreadsheetColumn,
  SelectableSpreadsheetColumn,
  EditableSpreadsheetColumn,
  NumberInput,
  CurrencyInput,
  getStandardColumnWidths,
} from '~/components';

import styles from './TicketScalingSpreadsheet.module.scss';

/**
 * @param {number} total
 * @param {number} cellValue
 */
function sum(total, cellValue) {
  return total + cellValue;
}

/**
 * The `<TicketScalingSpreadsheet>` contains the business logic around
 * how ticket prices are scaled.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {object} [props.data]
 * @param {string[]} [props.types]
 * @param {string} [props.currency]
 * @param {function} [props.onTicketUpdate]
 * @param {function} [props.onTicketRemove]
 * @param {function} [props.onRowChange]
 * @param {function} [props.onRemoveRow]
 * @param {function} [props.onContentReady]
 * @param {function} [props.ResizeObserver] - ResizeObserver polyfil
 *   (useful during testing).
 */
export function TicketScalingSpreadsheet({
  data,
  types,
  currency = 'USD',
  className,
  ...rest
}) {
  const numberInput = ({className, onChange, ...props}, ref, {value, ...rest}) => (
    <NumberInput
      className={combineClasses(className, styles.numberCell)}
      transparent
      {...props}
      ref={ref}
      value={value}
      onValueChange={e => onChange(e.floatValue)}
    />
  );

  const numberDisplay = ({className, ...props}, ref, {value}) => (
    <NumberDisplay
      className={combineClasses(className, styles.numberCell)}
      {...props}
      ref={ref}
      value={value}
    />
  );

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

  const {s, m, l, xl} = getStandardColumnWidths();

  return (
    <Spreadsheet
      data-testid="TicketScalingSpreadsheet"
      domLayout='autoHeight'
      rowData={data}
      totals
      userControlledRows
      {...rest}
    >
      <SelectableSpreadsheetColumn
        headerName="Type"
        headerTooltip="Ticket Type"
        field="type"
        placeholder="Select Ticket Type"
        options={types}
        optionToString={t => t.comment}
        width={l}
        footer="Total"
        compact
      />

      {/* The total number of seats available at the venue. */}
      <EditableSpreadsheetColumn
        field="capacity"
        headerName="Cap."
        headerTooltip="Available Capacity Per Ticket Type"
        children={numberInput}
        width={m}
        reduce={sum}
        footer={numberDisplay}
      />

      {/* The number of tickets that can be given away. */}
      <EditableSpreadsheetColumn
        field="complimentary"
        headerName="Comps"
        headerTooltip="Complimentary Tickets Per Ticket Type"
        children={numberInput}
        width={s}
        reduce={sum}
        footer={numberDisplay}
      />

      {/* The number of seats at the venue that cannot be sold (ex. construction, virus restrictions, etc) */}
      <EditableSpreadsheetColumn
        field="kills"
        headerTooltip="Number of seats (per Type) that are unavailable to be sold"
        children={numberInput}
        width={s}
        reduce={sum}
        footer={numberDisplay}
      />

      {/* The total number of tickets to sell. */}
      <SpreadsheetColumn
        field="sellable"
        headerTooltip="Number of tickets (per Type) available after Comps and Kills."
        derived
        valueGetter={({data}) => sellableTickets(data.capacity, data.complimentary, data.kills)}
        children={numberDisplay}
        width={m}
        reduce={sum}
        footer={numberDisplay}
      />

      <EditableSpreadsheetColumn
        field="price"
        headerTooltip="Ticket Price"
        children={currencyInput}
        width={m}
      />

      {/* The amount of money that could be made if there were no comps or kills. */}
      <SpreadsheetColumn
        field="grossPotential"
        headerTooltip="Total gross (per Type) before Comps and Kills"
        derived
        valueGetter={({data: {price = 0, capacity = 0}}) => price * capacity}
        children={currencyDisplay}
        width={l}
        reduce={sum}
        footer={currencyDisplay}
      />

      {/* The amount of money to be made if all tickets are sold. */}
      <SpreadsheetColumn
        field="sellableGrossPotential"
        headerTooltip="Total gross (per Type) after subtracting Comps and Kills"
        derived
        valueGetter={({data}) => sellableGrossPotential(data.capacity, data.complimentary, data.kills, data.price)}
        children={currencyDisplay}
        width={l}
        reduce={sum}
        footer={currencyDisplay}
      />

      {/* This is a facility fee on a per ticket basis. For example $1.50/ticket fee. */}
      <EditableSpreadsheetColumn
        field="facility"
        headerTooltip="Facility charge per ticket"
        children={currencyInput}
        width={s}
      />

      <EditableSpreadsheetColumn
        field="charity"
        headerTooltip="Charity donation per ticket"
        children={currencyInput}
        width={s}
      />

      <EditableSpreadsheetColumn
        field="secondary"
        headerTooltip="Secondary charge per ticket"
        children={currencyInput}
        width={s}
      />

      <EditableSpreadsheetColumn
        field="other"
        headerTooltip="Additional charges per ticket"
        children={currencyInput}
        width={s}
      />

      {/* The net price per ticket after subtracting out all the deductions. */}
      <SpreadsheetColumn
        field="netPrice"
        headerTooltip="Net Price per ticket after all deductions"
        derived
        valueGetter={({data: {price = 0, facility = 0, charity = 0, secondary = 0, other = 0}}) =>
          price - facility - charity - secondary - other
        }
        children={currencyDisplay}
        width={s}
      />

      <EditableSpreadsheetColumn
        field="notes"
        minWidth={xl}
      />

    </Spreadsheet>
  );
}

TicketScalingSpreadsheet.propTypes = {
  /**
   * The table data.
   */
  data: PropTypes.array,
  /**
   * Whether the table grows to fit the data or
   * scrolls to view the data. Using the autoHeight
   * or print layouts is important for testing.
   */
  domLayout: PropTypes.oneOf(['autoHeight', 'print', 'normal']),
  /**
   * Will be called on first render. This is useful
   * for testing to ensuer the data is rendered before
   * validating it's content.
   */
  onContentReady: PropTypes.func,
  /**
   * Turn of animations within the table.
   */
  disableAnimations: PropTypes.bool,
  /**
   * Allows you to provide a ResizeObserver polyfil.
   * This is necessary during testing.
   */
  ResizeObserver: PropTypes.func,
  /**
   * You can also pass any other props of the `Spreadsheet` component.
   */
  'Spreadsheet props...': PropTypes.any,
};

