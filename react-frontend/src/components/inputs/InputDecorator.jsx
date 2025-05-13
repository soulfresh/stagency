import React from 'react';
import PropTypes from 'prop-types';
import { combineClasses } from '@thesoulfresh/utils';
import { useId, mergeCallbacks } from '@thesoulfresh/react-tools';

import { useInput, NBSP } from '~/utils';
import { Loader } from '../loader';
import { CloseAction } from '../buttons';

import styles from './InputDecorator.module.scss';

/**
 * @typedef {object} InputDecoratorProps
 * @property {string} [className]
 * @property {boolean} [tight]
 * @property {boolean} [clearable]
 * @property {string|number} [value]
 * @property {string|number} [defaultValue]
 * @property {function} [onValueChange]
 * @property {function} [onFocus]
 * @property {function} [onBlur]
 * @property {function} [onChange]
 * @property {function} [onClear]
 * @property {string} [loadingStatusLabel]
 * @property {*} [value]
 * @property {*} [ref]
 */
/**
 * Use `InputDecorator` to decorate inputs with errors, icons and loaders.
 * To use it, simply wrap your input in
 * this component and apply your input props to `InputDecorator`
 * instead of your input component. The children of `InputDecorator`
 * must be a function that receives the props for your input
 * and returns your input.
 *
 * This component will also apply the default input functionality
 * from the `useInput` hook so you don't have to.
 *
 * ### Bottom Margin
 * Additionally, it will leave extra space under the input for the error message.
 * You can remove that margin by passing the `tight` parameter.
 * However, this will cause the elements under the input to shift
 * if you set an error message.
 *
 * ### Clear Button
 * You can also show a `CloseAction` button or the right of the input
 * by passing the `clearable` prop. You must pass the `onClear` callback
 * which should empty value prop.
 *
 * Example Usage:
 *
 * ```js
 * const TelephoneInput = (props) => (
 *   <InputDecorator {...props}>
 *     {(nextProps) => {
 *       <input type="tel" {...nextProps} />
 *     }
 *   </InputDecorator>
 * )
 * ```
 *
 * Any props you pass to `InputDecorator` (except for `className`) will be passed through
 * to your input if they are not used by `useInput`. In order to pass a custom
 * `className` to your input, you can destructure the props passed to the `children` function.
 * This is useful if you need to customize other props such as the
 * `onChange` handler.
 *
 * ```js
 * const TelephoneInput = ({className, ...props}) => (
 *   <InputDecorator {...props}>
 *     {(className: inputClasses, onChange, ...nextProps) => {
 *       <input
 *         type="tel"
 *         {...nextProps}
 *         onChange={() => console.log('onChange')}
 *         className={combineClasses(styles.TelephoneInput, inputClasses, className)}
 *       />
 *     }
 *   </InputDecorator>
 * )
 * ```
 *
 * @type React.FC<InputDecoratorProps>
 */
export const InputDecorator = React.forwardRef(({
  className,
  onFocus,
  onBlur,
  onClear,
  tight,
  clearable,
  loadingStatusLabel = "Loading...",
  style,
  'data-testid': testId = 'InputDecorator',
  ...props
}, ref) => {
  const id = useId('input-error')

  const [focused, setFocused] = React.useState(false);

  const localRef = React.useRef();

  const handleClear = e => {
    onClear(e);
    // @ts-ignore: will be defined after mount
    localRef.current?.focus();
  }

  let {
    error,
    children,
    icon,
    loading,
    hasValue,
    className: inputClassName,
    ...nextProps
  } = useInput({
    ...props,
    clearable,
    'aria-errormessage': id,
  });

  return (
    <span
      className={combineClasses(
        styles.InputDecorator,
        !!error ? styles.hasError : null,
        !!tight ? styles.tight : null,
        focused ? styles.focused : null,
        clearable ? styles.clearable : null,
        className,
      )}
      style={style}
      ref={ref}
      data-testid={testId}
      data-inputdecorator
    >
      <span className={styles.inputWrapper}>

        {/* CHILDREN */}
        <span data-testid="InputWrapper">
          {children && children({
            className: combineClasses(styles.Input, inputClassName),
            onFocus: mergeCallbacks(onFocus, () => setFocused(true)),
            onBlur: mergeCallbacks(onBlur, () => setFocused(false)),
            ...nextProps
          }, localRef)}
        </span>

        {/* LOADER */}
        {loading &&
          <Loader className={styles.loader} aria-label={loadingStatusLabel} />
        }

        {/* LEFT ICON */}
        {icon && !loading && React.cloneElement(icon, {
          className: combineClasses(styles.icon, icon.props.className),
          'aria-hidden': true,
        })}

        {/* CLEAR BUTTON */}
        {clearable &&
          <CloseAction
            aria-label="Clear Value"
            aria-hidden={!hasValue}
            tabIndex={hasValue ? 0 : -1}
            className={combineClasses(
              styles.clear,
              hasValue ? styles.hasValue : null,
            )}
            onClick={handleClear}
          />
        }
      </span>

      {/* ERROR MESSAGE */}
      <span className={styles.message} id={id} aria-hidden={!error}>
        {!!error ? error : !tight ? NBSP : null}
      </span>
    </span>
  );
});

InputDecorator.propTypes = {
  tight: PropTypes.bool,
  clearable: PropTypes.bool,
  loadingStatusLabel: PropTypes.string,
}
