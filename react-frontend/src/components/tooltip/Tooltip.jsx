import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import { Tooltip as TooltipBase } from '@thesoulfresh/react-tools';

import styles from './Tooltip.module.scss';
import sharedStyles from '../shared.module.scss';


/**
 * A standard tooltip component that will add a
 * tooltip to whatever content you wrap it around
 * and can display any JSX content.
 *
 * See [react-tools/Tooltip](https://soulfresh.github.io/react-tools/?path=/docs/components-tooltip--toottip)
 * for more details.
 *
 * @param {object} props
 * @param {*} [props.content]
 * @param {*} [props.children]
 * @param {string} [props.feel]
 * @param {object} [props.hoverOptions]
 * @param {object} [props.layerOptions]
 * @param {string} [props.className]
 * @param {boolean} [props.isOpen]
 * @param {function} [props.onOpen]
 * @param {function} [props.onClose]
 * @param {function} [props.ResizeObserver]
 */
export function Tooltip({
  className,
  feel,
  layerOptions,
  ...rest
}) {
  return (
    <TooltipBase
      className={combineClasses(
        styles.Tooltip,
        sharedStyles.Popover,
        className,
        styles[feel],
      )}
      layerOptions={{
        auto: true,
        placement: 'top-center',
        possiblePlacements: ['top-center', 'bottom-center', 'left-center', 'right-center'],
        snap: true,
        triggerOffset: sharedStyles.arrowSize,
        ...layerOptions,
      }}
      {...rest}
    />
  );
}

Tooltip.propTypes = {
  /**
   * This is the content inside the tooltip.
   * This can be any renderable JSX content.
   */
  content: PropTypes.node.isRequired,
  /**
   * The content that will trigger the tooltip.
   * This can be any renderable JSX content.
   */
  children: PropTypes.node.isRequired,
  /**
   * The feel variant.
   */
  feel: PropTypes.oneOf(['primary', 'secondary', 'success', 'warn', 'error']),
  /**
   * Configure the delay when showing/hiding
   * the tooltip on hover. These options are
   * passed directly to the `useHover` hook
   * from `react-laag`.
   * See https://github.com/everweij/react-laag#usehover
   */
  hoverOptions: PropTypes.object,
  /**
   * Configure options for the tooltip layer.
   * Since this component uses `react-laag` under the
   * hood, these options are pass directly to the
   * `useLayer` hook.
   * See https://github.com/everweij/react-laag#uselayeroptions
   */
  layerOptions: PropTypes.object,
  /**
   * The className will be applied to the outer div
   * that wraps both the `content` and `arrow` divs.
   * This allows you to scope the `content` and `arrow`
   * selectors to your specific tooltip component.
   */
  className: PropTypes.string,
  /**
   * Whether the tooltip is open. You only need to pass
   * this if you wish to use this as a controlled component.
   */
  isOpen: PropTypes.bool,
  /**
   * A function that will be called when the tooltip opens.
   */
  onOpen: PropTypes.func,
  /**
   * A callback that will be called when the tooltip closes.
   */
  onClose: PropTypes.func,
  /**
   * Any other props you pass will be applied to the
   * tooltip `content` div.
   */
  'other props...': PropTypes.any,
};

