import React from 'react';
import { combineClasses } from '@thesoulfresh/utils';
import { useForm } from 'react-hook-form';
import isEqual from 'lodash.isequal';

/**
 * The `useAutoSaveForm` hook is a wrapper around `react-hook-form useForm()` hook.
 * It will emit change events whenever the form values are changed and are valid.
 *
 * @param {function} onChange - The change handler to call whenever the form is
 *   modified and is in a valid state.
 * @param {object} [options] - Any options you want to pass to the `react-hook-form useForm()` hook.
 */
export function useAutoSaveForm(onChange, ...options) {
  const { watch, formState, ...rest} = useForm({mode: 'onChange', ...options});
  const {isValid, isDirty, isValidating} = formState;
  const data = watch();
  const lastValidData = React.useRef();

  React.useEffect(() => {
    if (
      onChange &&
      isValid &&
      !isValidating &&
      isDirty &&
      !isEqual(lastValidData.current, data)
    ) {
      // @ts-ignore: This is valid
      lastValidData.current = data;
      onChange(data);
    }
  }, [data, onChange, isValid, isValidating, isDirty]);

  return {
    watch,
    formState,
    ...rest
  }
}

/**
 * Use this in input components that need to determine
 * whether they currently have a value set or not.
 * @param {*} [defaultValue] - The `defaultValue` prop passed to the component.
 * @param {*} [value] - The `value` prop passed to the component.
 * @param {function} [onChange] - The `onChange` prop passed to the component.
 * @return {[boolean, function]} Whether a value is currently set and a
 *   change handler to attach to the input onChange event.
 */
export function useInputHasValue(defaultValue, value, onChange) {
  const isControlled = value !== undefined;
  const [hasValue, setHasValue] = React.useState(!!defaultValue || !!value);

  // If the value is changed externally, rerender.
  React.useEffect(() => {
    const hv = !!value || !!defaultValue;
    setHasValue(hv);
  }, [defaultValue, value, setHasValue]);

  const handleChange = e => {
    // This should only rerender in non-controlled situations, otherwise
    // it risks rendering the component with the stale value before
    // the parent component has time to set the new value. When this happens,
    // the input will emit another event change with the stale value,
    // effectively nullifying the original change event.
    if (!isControlled) {
      const value = (e != null && typeof(e) === 'object' && e.target)
        ? e.target.value
        : e;
      setHasValue(!!value);
    }
    if (onChange) onChange(e);
  };

  return [hasValue, handleChange];
}


/**
 * Use this hook to apply the generic input functionality
 * to any input type element.
 * @param {object} [props] - The native input props passed to the compoennt.
 * @param {string} [additionalClassName] - The custom className for your component.
 * @return {object} This returns modified props to apply to the element
 * to be rendered.
 */
export function useInput(
  {
    boxy,
    narrow,
    transparent,
    error,
    feel,
    className,
    defaultValue,
    value,
    icon,
    clearable,
    loading,
    onChange,
    ...rest
  } = {},
  additionalClassName,
) {
  const [hasValue, handleChange] = useInputHasValue(defaultValue, value, onChange);

  const classes = combineClasses(
    className,
    additionalClassName,
    hasValue ? 'hasValue' : null,
    narrow ? 'narrow' : null,
    boxy ? 'boxy' : null,
    transparent ? 'transparent': null,
    !!error ? 'error' : null,
    feel && !error ? feel : null,
    (!!icon || !!loading) ? 'hasIcon' : null,
    clearable ? 'clearable' : null,
  );

  return {
    value,
    defaultValue,
    'aria-invalid': !!error,
    className: classes,
    onChange: handleChange,
    error,
    icon,
    loading,
    hasValue,
    ...rest
  };
}

