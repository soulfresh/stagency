import React from 'react';
import PropTypes from 'prop-types';
import { combineClasses } from '@thesoulfresh/utils';
import { NumberDisplay, useMaybeControlled } from '@thesoulfresh/react-tools';

import { mergeRefs } from '~/utils';
import { InputDecorator } from '../InputDecorator.jsx';

import styles from './NumberInput.module.scss';

/**
 * @typedef {object} NumberInputProps
 * @property {boolean} [narrow]
 * @property {boolean} [boxy]
 * @property {boolean} [transparent]
 * @property {string|number} [value]
 * @property {string|number} [defaultValue]
 * @property {string} [feel]
 * @property {string|boolean} [error]
 * @property {boolean} [tight]
 * @property {*} [icon]
 * @property {boolean} [loading]
 * @property {function} [onValueChange]
 * @property {string} [className]
 * @property {*} [ref]
 */
/**
 * `<NumberInput>` displays an input value that takes numbers
 * and formats them in the user's locale.
 *
 * @type React.FC<NumberInputProps>
 */
export const NumberInput = React.forwardRef(({
  className,
  onValueChange,
  value: valueProp,
  defaultValue,
  ...props
}, ref) => {
  const [value, setValue] = useMaybeControlled(valueProp, undefined, defaultValue);

  const handleValueChange = e => {
    setValue(e.floatValue);
    onValueChange && onValueChange(e);
  }

  const onClear = () => {
    handleValueChange({
      value: null,
      formattedValue: null,
      floatValue: null,
      info: {
        // TODO Figure out what to do here.
      }
    })
  }

  return (
    <InputDecorator
      className={combineClasses(className, styles.InputDecorator)}
      value={value}
      onValueChange={handleValueChange}
      onClear={onClear}
      {...props}
    >
      {({className: inputClasses, onChange, ...nextProps}, localRef) => (
        <NumberDisplay
          data-testid="NumberInput"
          input
          className={combineClasses(inputClasses, styles.NumberInput)}
          {...nextProps}
          ref={mergeRefs(ref, localRef)}
        />
      )
      }
    </InputDecorator>
  );
});

NumberInput.propTypes = {
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
   */
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
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
   * This is similar to using `onChange` but emits the value of the
   * input in a more usable format. It is preferred over `onChange`
   * unless you have a need for the actual event object.
   *
   * @param {object} values
   * @param {string} values.value - The raw text value
   * @param {string} values.formattedValue - The value with number formatting as seen by the user.
   * @param {number} values.floatValue - The value as a number
   * @param {object} values.info - Additional info about the event including the original event object
   *   if it's available. However, it is not guaranteed to contain an event object.
   */
  onValueChange: PropTypes.func,
  /**
   * This will be applied to the root element wrapping the input
   * and other decorator elements.
   */
  className: PropTypes.string,
  /**
   * You can pass any props of `NumberDisplay`
   * or native `<input>` elements.
   * See [NumberDisplay](/?path=/docs/react-tools_components-numbers-number-display--number-display)
   * for more info.
   */
  'other props...': PropTypes.any,
};

