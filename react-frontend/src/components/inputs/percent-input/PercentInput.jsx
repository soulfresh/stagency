import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

import { combineClasses} from '@thesoulfresh/utils';
import { Percent, useMaybeControlled } from '@thesoulfresh/react-tools';

import { mergeRefs } from '~/utils';
import { InputDecorator } from '../InputDecorator.jsx';

import styles from './PercentInput.module.scss';


/**
 * @typedef {object} PercentInputProps
 * @property {boolean} [narrow]
 * @property {boolean} [boxy]
 * @property {boolean} [transparent]
 * @property {string} [placeholder]
 * @property {string|number} [value]
 * @property {string|number} [defaultValue]
 * @property {string} [feel]
 * @property {boolean} [tight]
 * @property {*} [icon]
 * @property {boolean} [loading]
 * @property {string|boolean} [error]
 * @property {number} [decimalScale]
 * @property {boolean} [fixedDecimalScale]
 * @property {function} [onValueChange]
 * @property {boolean} [allowNegative]
 * @property {string} [className]
 * @property {*} [ref]
 */
/**
 * `<PercentInput>` displays an input value that takes numbers
 * and formats them in the user's locale.
 *
 * **Note** that the value expected to be represented as an
 * integer with 4 significant digits. For example, 90% is stored
 * as 9000. This helps to avoid [floating point errors](https://floating-point-gui.de/).
 *
 * @type React.FC<PercentInputProps>
 */
export const PercentInput = React.forwardRef(({
  className,
  onValueChange,
  value: valueProp,
  defaultValue,
  ...props
}, ref) => {
  const [value, setValue] = useMaybeControlled(valueProp, undefined, defaultValue);

  const handleValueChange = e => {
    setValue(e.integer);
    onValueChange && onValueChange(e);
  }

  const onClear = () => {
    handleValueChange({
      value: null,
      formattedValue: null,
      floatValue: null,
      integer: null,
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
      {({onChange, className: inputClasses, ...nextProps}, localRef) => (
        <Percent
          data-testid="PercentInput"
          precision={4}
          fixedDecimalScale
          // @ts-ignore: invalid typings
          decimalScale={2}
          input
          className={combineClasses(inputClasses, styles.PercentInput)}
          {...nextProps}
          ref={mergeRefs(ref, localRef)}
        />
      )
      }
    </InputDecorator>
  );
});

PercentInput.propTypes = {
  /**
   * The value must be represented as an
   * integer with 4 significant digits. For example, 90% is stored
   * as 9000. This helps to avoid [floating point errors](https://floating-point-gui.de/).
   */
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
   * @param {number} values.integer - The value represented as an integer with 4 significant digits (ie. 9000 = 90%).
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

/**
 * @typedef {object} PercentInputRHFProps
 * @property {string} name
 * @property {*} control
 * @property {*} [defaultValue]
 * @property {*} [value]
 * @property {*} [rules]
 * @property {boolean} [shouldUnregister]
 * @property {*} [ref]
 */
/**
 * `PercentInputRHF` is a wrapper around `PercentInput`
 * that allows you to use it with React Hook Form. The `name`
 * and `control` props are required for integration with RHF.
 * You can also pass any props of
 * [Controller](https://react-hook-form.com/api/usecontroller/controller)
 * from RHF and any props of PercentInput.
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
 *       <PercentInputRHF
 *         name="percent"
 *         control={control}
 *         defaultValue={percent}
 *         placeholder="% of the Net Box Office Receipts"
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
 * @type React.FC<PercentInputRHFProps & PercentInputProps>
 */
export const PercentInputRHF = React.forwardRef(({
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
        <PercentInput
          {...rest}
          {...field}
          // Pass the integer representation of the percentage
          // as the output of the form field.
          onValueChange={e => field.onChange(e.integer)}
        />
      }
    />
  );
});

PercentInputRHF.propTypes = {
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
