import React from 'react';
import PropTypes from 'prop-types';
import { Select as SelectBase } from '@thesoulfresh/react-tools';
import { combineClasses } from '@thesoulfresh/utils';

import { Action } from '../../buttons';

import styles from './Select.module.scss';
import sharedStyles from '../../shared.module.scss';

/*** `<Select>` is a select component that allows you
 * to render a select input with custom options, as opposed
 * to the `<Select>` component which can only render strings.
 * It takes a function as its children and content props.
 *
 * The `children` function will receive a props object which
 * you must apply to your trigger element and the selected item
 * in case you want to use that to customize the trigger.
 *
 * The `content` function will be called for each option to
 * be rendered and will pass a props object which you must
 * apply to each option element. Additionally, you will
 * recieve the item being rendered, whether it is currently
 * selected and its index.
 *
 * @typedef {object} SelectProps
 * @property {*} [ref]
 * @property {string} [className]
 * @property {*[]} [items]
 * @property {function} [optionToString]
 * @property {function} [onChange]
 * @property {function} [content]
 * @property {*} [children]
 * @property {function} [onOpen]
 * @property {function} [onClose]
 * @property {boolean} [isOpen]
 * @property {object} [layerOptions]
 * @property {string} [placement]
 * @property {object} [selectOptions]
 * @property {boolean} [compact]
 * @property {*} [value]
 * @property {*[]} [options]
 * @property {boolean} [disableTransitions]
 * @property {function} [ResizeObserver] - A ResizeObserver polyfill
 *   (useful for testing)
 */
/**
 * @type React.FC<SelectProps>
 */
export const Select = React.forwardRef(({
  className,
  layerOptions,
  compact = false,
  optionToString,
  content = (item) => (
    <SelectOption data-testid="SelectOption">
      { optionToString ? optionToString(item) : item }
    </SelectOption>
  ),
  ResizeObserver,
  ...rest
}, ref) => {
  return (
    <SelectBase
      disableArrow
      data-testid="Select"
      className={combineClasses(
        styles.Select,
        sharedStyles.Popover,
        className,
        compact ? styles.compact : null,
      )}
      content={content}
      optionToString={optionToString}
      layerOptions={{
        triggerOffset: sharedStyles.arrowSize,
        placement: 'bottom-start',
        ResizeObserver,
        ...layerOptions,
      }}
      {...rest}
      ref={ref}
    />
  );
});

Select.propTypes = {
  /**
   * The list of items to render as select options.
   * These can be of any type and will be pass back to
   * your content render function when rendering the select options.
   */
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  /**
   * This is a callback that will be used to convert
   * each item into a string for user in ARIA properties.
   * This function is only required if the items you
   * pass are not strings. It recieves the item and
   * should return the string representation of that item.
   *
   * @param {*} item
   */
  optionToString: PropTypes.func,
  /**
   * Passing a value prop allows you to control the component's
   * selected item state. If you pass a value, you should also
   * pass the `onChange` prop which should update the `value`
   * as needed. If you don't pass a `value`, the the component
   * will maintain its own state.
   */
  value: PropTypes.any,
  /**
   * This callback will be called whenever the selected
   * item changes.
   *
   * It is called with the following parameters:
   *
   * @param {*} item - The newly selected item.
   * @param {object} updateData - The full Downshift update.
   */
  onChange: PropTypes.func,
  /**
   * A function that is used to render each of the items
   * in your select. You can return any JSX from this function
   * and it will be rendered. If not provided, then a
   * default item render will be used.
   *
   * The callback recieves the following parameters:
   *
   * @param {*} item - An item from the `items` prop which is the
   *   item being rendered.
   * @param {boolean} selected - Whether the current item is the
   *   selected item.
   * @param {number} index - The index of this item in the `items`
   *   prop array.
   */
  content: PropTypes.func,
  /**
   * The element to render as the select trigger. This can be
   * either a JSX node or a function. The function variant is useful
   * because it will receive the currently selected item which you
   * can use to set the text of your trigger element.
   * Your trigger can be any valid JSX but it is recommended that you return a button
   * or link for accessiblility purposes.
   *
   * The function variant will be called with the following parameters:
   *
   * @param {object} props - Props to apply to the trigger element.
   * @param {*} item - The currently selected item.
   */
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  /**
   * A callback that will be called whenever the menu is opened.
   * This is required if you use this component in a controlled fashion.
   */
  onOpen: PropTypes.func,
  /**
   * A callback that will be called whenever the menu is closed.
   * This is required if you use this component in a controlled fashion.
   */
  onClose: PropTypes.func,
  /**
   * The current open state of the menu. You only need to use this
   * if you want to control the open state of the menu yourself.
   * If you do pass this prop, then you will also need to pass the
   * `onOpen` and `onClose` props which will be called whenever
   * Downshift determines that the menu should be opened or closed.
   */
  isOpen: PropTypes.bool,
  /**
   * Any additional properties that you'd like to pass to the
   * `useSelect` hook from `Downshift`.
   *
   * See https://github.com/downshift-js/downshift/tree/master/src/hooks/useSelect#basic-props
   */
  selectOptions: PropTypes.object,
  /**
   * Use a multi-column layout (instead of the default single column)
   * in order to show more items on the screen at once.
   */
  compact: PropTypes.bool,
  /**
   * Configure options for the tooltip layer.
   * Since this component uses `react-laag` under the
   * hood, these options are pass directly to the
   * `useLayer` hook.
   * See https://github.com/everweij/react-laag#uselayeroptions
   */
  layerOptions: PropTypes.object,
  /**
   * Turn off popover animations. Useful during testing.
   */
  disableTransitions: PropTypes.bool,
  /**
   * The className will be applied to the outer div
   * that wraps both the `content` and `arrow` divs.
   * This allows you to scope the `content` and `arrow`
   * selectors to your specific tooltip component.
   */
  className: PropTypes.string,
  /**
   * Pass the ResizeObserver implementation used by the Popover layer.
   * Useful during testing.
   */
  ResizeObserver: PropTypes.func,
  /**
   * Any other props you pass will be applied to the
   * popover `content` div.
   */
  // @ts-ignore
  'other props...': PropTypes.any,
};

/**
 * @typedef {object} SelectOptionProps
 */
/**
 * The `<SelectOption>` can be used to achieve consistent
 * styling across menus. It gives you consistent padding
 * and sizes itself to the width of the menu. You can pass
 * any content you need as its children so you are not limited
 * to rendering just text.
 *
 * However, you are not required to use `<SelectOption>` as the
 * option conents of a `<Select>`.
 *
 * ### Styling
 *
 * The `SelectOption` uses the `@active` SCSS mixing which means you can use the
 * `.active` class to target any CSS styles for the selected state.
 *
 * @type React.FC<SelectOptionProps>
 */
export const SelectOption = React.forwardRef(({
  className,
  ...rest
}, ref) => {
  return (
    <button
      className={combineClasses(styles.SelectOption, className)}
      {...rest}
      ref={ref}
    />
  );
});

SelectOption.propTypes = {
  /**
   * You can pass anything as the content of a trigger.
   */
  children: PropTypes.node.isRequired,
  /**
   * Any other props you pass will be passed along to the
   * underlying span element.
   */
  'other props...': PropTypes.any,
};


/**
 * @typedef {object} SelectTriggerProps
 */
/**
 * `<SelectTrigger>` gives you consistent styling for
 * menu triggers across the app. It extends `<Action>`
 * so you can use all of those props with this component.
 * It can also take any content you need as it's children
 * including icon elements.
 *
 * However, you are not required to use `<SelectTrigger>` as the
 * trigger element of a `<Select>`.
 *
 * @type React.FC<SelectTriggerProps>
 */
export const SelectTrigger = React.forwardRef(({
  className,
  solid = false,
  ...rest
}, ref) => {
  return (
    <Action
      className={combineClasses(
        styles.SelectTrigger,
        className,
        solid ? styles.solid : null,
      )}
      solid={solid}
      {...rest}
      ref={ref}
    />
  );
});

SelectTrigger.propTypes = {
  /**
   * You can pass anything as the content of a trigger.
   */
  children: PropTypes.node.isRequired,
  /**
   * You can also pass any other props that the Action
   * component can take such as feel, solid, narrow and other
   * variations.
   */
  'Action props...': PropTypes.any,
  /**
   * Any other props you pass will be passed along to the
   * underlying button element.
   */
  'other props...': PropTypes.any,
};

