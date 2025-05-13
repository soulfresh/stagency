import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { combineClasses } from '@thesoulfresh/utils';
import { Currency, useMaybeControlled } from '@thesoulfresh/react-tools';

import { mergeRefs } from '~/utils';
import { InputDecorator } from '../InputDecorator.jsx';

import styles from './CurrencyInput.module.scss';

/**
 * @typedef {object} CurrencyInputProps
 * @property {string} [currency]
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
 * @property {string} [className]
 * @property {function} [onValueChange]
 * @property {boolean} [allowNegative]
 * @property {*} [ref]
 */
/**
 * `<CurrencyInput>` renders an input value that shows
 * numbers in the user's locale with a currency value.
 *
 * **Note** that the value is expected in pennies and you
 * should also use the `pennies` property from the `onValueChange`
 * callback to get the value out of the input in pennies.
 *
 * @type React.FC<CurrencyInputProps>
 */
export const CurrencyInput = React.forwardRef(({
  currency,
  className,
  onValueChange,
  value: valueProp,
  defaultValue,
  ...props
}, ref) => {
  const [value, setValue] = useMaybeControlled(valueProp, undefined, defaultValue);

  const handleValueChange = e => {
    setValue(e.pennies);
    onValueChange && onValueChange(e);
  }

  const onClear = () => {
    handleValueChange({
      value: null,
      formattedValue: null,
      floatValue: null,
      pennies: null,
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
      {({className: inputClasses, ...nextProps}, localRef) => (
        <Currency
          data-testid="CurrencyInput"
          // @ts-ignore
          input
          pennies
          currency={currency}
          decimalScale={2}
          fixedDecimalScale
          className={combineClasses(inputClasses, styles.CurrencyInput)}
          {...nextProps}
          ref={mergeRefs(ref, localRef)}
        />
      )
      }
    </InputDecorator>
  );
});

CurrencyInput.propTypes = {
  /**
   * The currency code for the currency value to display.
   * This should be a 3 digit currency code like 'USD' or 'EUR'
   */
  currency: PropTypes.string,
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
   * Whether or not to use the boxy (sharp corners) visual style.
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
   * This is similar to using `onChange` but emits the value of the
   * input in a more usable format. It is preferred over `onChange`
   * unless you have a need for the actual event object.
   *
   * @param {object} values
   * @param {string} values.value - The raw text value
   * @param {string} values.formattedValue - The value with number formatting as seen by the user.
   * @param {number} values.floatValue - The value in dollars
   * @param {number} values.pennies - The value in pennies
   * @param {object} values.info - Additional info about the event including the original event object
   *   if it's available. However, it is not guaranteed to contain an event object.
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
   * This will be applied to the root element wrapping the input
   * and other decorator elements.
   */
  className: PropTypes.string,
  /**
   * You can pass any props of `Currency`
   * or native `<input>` elements.
   * See [Currency](/?path=/docs/react-tools_components-numbers-currency--currency)
   * for more info.
   */
  'other props...': PropTypes.any,
};


/**
 * @typedef {object} CurrencyInputRHFProps
 * @property {string} name
 * @property {*} control
 * @property {*} [defaultValue]
 * @property {*} [value]
 * @property {*} [rules]
 * @property {string} [placeholder]
 * @property {boolean} [shouldUnregister]
 * @property {*} [ref]
 */
/**
 * `CurrencyInputRHF` is a wrapper around `CurrencyInput`
 * that allows you to use it with React Hook Form. The `name`
 * and `control` props are required for integration with RHF.
 * You can also pass any props of
 * [Controller](https://react-hook-form.com/api/usecontroller/controller)
 * from RHF and any props of CurrencyInput.
 *
 * > NOTE: You don't need to use the `register` function from `useForm()`
 * to register this component because it will be registered for you.
 *
 * Example usage:
 *
 * ```js
 * const { register, watch, control } = useForm();
 *
 * watch((...args) => console.log('watch', ...args))
 *
 * return (
 *   <form data-testid="PercentageOfNet"
 *     className={combineClasses(styles.PercentageOfNet, className)}
 *     {...rest}
 *   >
 *     <Label title="The artist will receive...">
 *       <CurrencyInputRHF
 *         name="amount"
 *         control={control}
 *         defaultValue={amount}
 *         placeholder="Artist Revenue"
 *       />
 *     </Label>
 *     <HR />
 *     <Label title="Notes">
 *       <Textarea
 *         {...register('notes', {
 *           defaultValue: notes,
 *         })}
 *       />
 *     </Label>
 *   </form>
 * );
 * ```
 *
 * @type React.FC<CurrencyInputRHFProps & CurrencyInputProps>
 */
export const CurrencyInputRHF = React.forwardRef(({
  name,
  control,
  defaultValue,
  value,
  rules,
  shouldUnregister,
  ...rest
}, ref) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || value}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field }) =>
        <CurrencyInput
          {...rest}
          {...field}
          // Pass the pennies representation of the percentage
          // as the output of the form field.
          onValueChange={e => field.onChange(e.pennies)}
        />
      }
    />
  );
});

CurrencyInputRHF.propTypes = {
  /**
   * The name of the field in the form.
   * See [Controller](https://react-hook-form.com/api/usecontroller/controller)
   */
  name: PropTypes.string.isRequired,
  /**
   * The `control` object returned from `useForm()`.
   * See [Controller](https://react-hook-form.com/api/usecontroller/controller)
   */
  control: PropTypes.object.isRequired,
  /**
   * The initial value of the input.
   * See [Controller](https://react-hook-form.com/api/usecontroller/controller)
   */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * See [Controller](https://react-hook-form.com/api/usecontroller/controller)
   */
  rules: PropTypes.object,
  /**
   * See [Controller](https://react-hook-form.com/api/usecontroller/controller)
   */
  shouldUnregister: PropTypes.bool,
  /**
   * Any other props will be passed to `PercentInput`
   */
  '...other props': PropTypes.any,
};
