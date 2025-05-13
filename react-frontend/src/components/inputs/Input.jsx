import React from 'react';
import PropTypes from 'prop-types';
import { combineClasses } from '@thesoulfresh/utils';
import { useMaybeControlled } from '@thesoulfresh/react-tools';

import { mergeRefs } from '~/utils';
import { InputDecorator } from './InputDecorator.jsx';

import styles from './Input.module.scss';

/**
 * @typedef {object} InputProps
 * @property {boolean} [narrow]
 * @property {boolean} [boxy]
 * @property {boolean} [transparent]
 * @property {string|number} [value]
 * @property {string|number} [defaultValue]
 * @property {string} [feel]
 * @property {string|boolean} [error]
 * @property {string} [placeholder]
 * @property {boolean} [tight]
 * @property {*} [icon]
 * @property {boolean} [loading]
 * @property {string} [loadingStatusLabel]
 * @property {string} [className]
 * @property {function} [onChange]
 * @property {function} [onValueChange]
 * @property {boolean} [autoFocus]
 * @property {*} [ref]
 */
/**
 * `<Input>` displays a standard input element
 * with our project specific styles. You can
 * pass all of the standard `<input>` props
 * through this component.
 *
 * ### Value Changes
 * It is preferred to use the `onValueChange` prop
 * in place of the `onChange` prop. This gives you
 * direct access to updated values as the user types
 * without having to traverse the event object. It
 * also provides consistency with the other input
 * components. However, `onChange` is still available
 * if you need it.
 *
 * ### Margin
 * The `Input` component includes bottom margin
 * in order to account for error messages that can
 * be displayed under the input. If you need to remove
 * that spacing, pass the `tight` parameter. However,
 * if you also use the `error` prop, the page layout
 * will shift as the error message is shown/removed.
 *
 * @type React.FC<InputProps>
 */
export const Input = React.forwardRef(({
  className,
  onChange,
  onValueChange,
  value: valueProp,
  defaultValue,
  ...props
}, outerRef) => {
  const localRef = React.useRef();

  const [value, setValue] = useMaybeControlled(
    valueProp,
    v => { onValueChange && onValueChange(v); },
    defaultValue
  );

  const handleValueChange = e => {
    const v = e.target.value;
    setValue(v);
    onChange && onChange(e);
  }

  const onClear = (e) => {
    handleValueChange({
      // Make our best attempt at faking the event object
      // with an empty input value.
      ...e,
      target: {value: ''},
      nativeEvent: {
        target: {value: ''}
      }
    })
  }
  return (
    <InputDecorator
      className={combineClasses(className, styles.InputDecorator)}
      value={value || ''}
      onChange={handleValueChange}
      onClear={onClear}
      {...props}
    >
      {({className: inputClasses, ...nextProps}, decoratorRef) =>
        <input
          data-testid="Input"
          className={combineClasses(inputClasses, styles.Input)}
          {...nextProps}
          ref={mergeRefs(outerRef, localRef, decoratorRef)}
        />
      }
    </InputDecorator>
  );
});

Input.propTypes = {
  /**
   * Whether or not to use the more condensed visual style.
   */
  narrow: PropTypes.bool,
  /**
   * Remove the bottom padding that provides space for the
   * error messages.
   */
  tight: PropTypes.bool,
  /**
   * Whether or not to allow rounded corners.
   */
  boxy: PropTypes.bool,
  /**
   * Whether the input should remove it's background and border
   * coloring.
   */
  transparent: PropTypes.bool,
  /**
   * The stylistic feel of the input.
   */
  feel: PropTypes.oneOf(['primary', 'secondary', 'success', 'warn', 'error']),
  /**
   * Whether or not the input is in an error state.
   * This is generally preferred over the "error" feel.
   * If you pass a boolean, the field will be colored as an
   * error. If you pass a string or component, it will be used
   * as the error message below the input.
   */
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  /**
   * This emits the current text of the input without having to
   * traverse the event object for the data. This is preferred
   * to `onChange` in order to maintain consistency with our other
   * customized input components.
   *
   * @param {string} value - The input text
   */
  onValueChange: PropTypes.func,
  /**
   * An icon to show to the left of the input.
   */
  icon: PropTypes.node,
  /**
   * Show a loader on the left of the input. This takes precendence
   * over the icon prop.
   */
  loading: PropTypes.bool,
  /**
   * An aria-label used to describe the loading indicator if your
   * input need to show the loader. For example, in a search component
   * you would set this to something like "Searching for artists...".
   */
  loadingStatusLabel: PropTypes.string,
  /**
   * This will be applied to the root element wrapping the input
   * and other decorator elements.
   */
  className: PropTypes.string,
  /**
   * You can pass any props from `<input>` elements.
   */
  'other props...': PropTypes.any,
};

