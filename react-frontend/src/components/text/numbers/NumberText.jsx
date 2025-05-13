import React from 'react';
import PropTypes from 'prop-types';

import { NumberDisplay } from '@thesoulfresh/react-tools';

/**
 * Render a number using the user's desired locale.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {string|number} [props.children] - The number to display.
 * @param {string|number} [props.value] - The number to display in
 *   the user's locale.
 */
export function NumberText({
  className,
  value,
  // Allow the value to be passed as
  // either the children or the value prop.
  children = value,
  ...rest
}) {
  return (<NumberDisplay className={className} value={children} {...rest} />);
}

NumberText.propTypes = {
  /**
   * The number to display in the user's locale.
   */
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Any other props you pass will be passed along to
   * the underlying `NumberDisplay`.
   * See /docs/react-tools_components-numbers-number-display--number-display
   * for more details.
   */
  'other props...': PropTypes.any,
};
