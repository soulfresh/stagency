import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';
import { Dropdown as DropdownBase } from '@thesoulfresh/react-tools';

import styles from './Dropdown.module.scss';
import sharedStyles from '../shared.module.scss';

/**
 * `<Dropdown>` provides a dropdown/popover component
 * that can take arbitrary content. You can used this
 * component as either a contolled or uncontrolled component.
 * It is ARIA dialog complient.
 *
 * This component is NOT intended
 * for navigation/context menus, select boxes or autocompletes
 * which all have more specific ARIA requirements.
 *
 * For more details, see https://soulfresh.github.io/react-tools/?path=/docs/components-dropdown--dropdown
 *
 * ### Styling
 *
 * To style the floating content, you can use the `.content` style. That style
 * is not scoped to the floating div but you can achieve that scoping with the
 * following strategy:
 *
 * ```jsx
 * .MyTimeInput {
 *   > :global(.content) {
 *     // Styles are scoped to the content wrapper only
 *   }
 * }
 *
 * // You can then pass that style directly to the Dropdown component:
 * <Dropdown className={styles.MyTimeInput} ...
 * ```
 *
 * @param {object} props
 * @param {*} [props.content]
 * @param {*} [props.children]
 * @param {function} [props.onClose]
 * @param {function} [props.onOpen]
 * @param {boolean} [props.isOpen]
 */
export function Dropdown({
  className,
  layerOptions = {},
  ...rest
}) {
  return (
    <DropdownBase
      disableArrow
      className={combineClasses(styles.Dropdown, sharedStyles.Popover, className)}
      layerOptions={{
        triggerOffset: sharedStyles.arrowSize,
        ...layerOptions,
      }}
      {...rest}
    />
  );
}

Dropdown.propTypes = {
  /**
   * A callback function that should return the
   * content to render.
   * @param {object} firstTabTarget - The first element
   *   in the content that will recieve tab focus.
   * @param {object} lastTabTarget - The last element
   *   in the content that will receive tab focus.
   */
  content: PropTypes.func.isRequired,
  /**
   * The trigger that should open the dropdown. This
   * can be any JSX content. If the trigger is text or
   * a number, then it will be wrapped in a `<span>`
   * in order to provide click handlers.
   */
  children: PropTypes.node.isRequired,
  /**
   * A callback that will be called when the dropdown
   * menu is closed.
   */
  onClose: PropTypes.func,
  /**
   * A callback that will be called when the dropdown
   * menu is opened.
   */
  onOpen: PropTypes.func,
  /**
   * If you want to controll the open/closed state yourself,
   * use this to pass the current open state. You'll also
   * need to provide the `onOpen` and `onClose` callbacks.
   */
  isOpen: PropTypes.bool,
  /**
   * Configure options for the tooltip layer.
   * Since this component uses `react-laag` under the
   * hood, these options are pass directly to the
   * `useLayer` hook.
   * See https://github.com/everweij/react-laag#uselayeroptions
   */
  layerOptions: PropTypes.object,
  /**
   * The property that the `useEnterExit()` hook should
   * listen to for `transitionend` events which signify
   * the popover content can be removed. See the
   * [useEnterExit](/?path=/docs/hooks-useenterexit--page)
   * for more information.
   */
  transitionProperty: PropTypes.string,
  /**
   * Disable the `useEnterExit()` hook from listening
   * to `transitionend` events before removing the popover content.
   */
  disableTransitions: PropTypes.bool,
  /**
   * Allows you to remove the arrow element from the popover content.
   */
  disableArrow: PropTypes.bool,
  /**
   * If you pass a `ref`, it will be attached to the
   * popover wrapping element. However, you shouldn't
   * need this as you can pass a ref to your `content`
   * or `children` outside of this component.
   */
  ref: PropTypes.node,
  /**
   * Any other props you pass will be applied to the
   * popover `content` div.
   */
  // @ts-ignore
  'other props...': PropTypes.any,
};

