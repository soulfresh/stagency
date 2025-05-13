import React from 'react';
import PropTypes from 'prop-types';

import { Currency } from '@thesoulfresh/react-tools';

/**
 * Render a currency value using the user's desired locale
 * and the currency specified. If the currency code is
 * not specified, then 'USD' is assumed.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} [props.currency] - The currency code to use as
 *   listed here: https://www.currency-iso.org/en/home/tables/table-a1.html
 * @param {string|number} [props.children] - The number to display.
 * @param {string|number} [props.value] - The number to display in
 *   the user's locale.
 */
export function CurrencyText({
  className,
  value,
  // Allow the value to be passed as
  // either the children or the value prop.
  children = value,
  ...rest
}) {
  return (<Currency className={className} value={children} {...rest} />);
}

CurrencyText.propTypes = {
  /**
   * The number to display in the user's locale.
   */
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * The currency code for the currency value being used
   * as listed here: https://www.currency-iso.org/en/home/tables/table-a1.html
   */
  currency: PropTypes.string,
  /**
   * Any other props you pass will be passed along to
   * the underlying `Currency`.
   * See /docs/react-tools_components-numbers-number-display--number-display
   * for more details.
   */
  'other props...': PropTypes.any,
};
