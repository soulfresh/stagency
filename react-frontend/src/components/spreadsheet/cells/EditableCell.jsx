import React from 'react';
import { mergeRefs } from 'react-laag';

import { combineClasses } from '@thesoulfresh/utils';
import { useTimeout, useProcessEvent } from '@thesoulfresh/react-tools';

import { isFocusedCell, getCellProps, getAriaLabel } from '../utils';
import { Input } from '~/components/inputs';
import { Tooltip } from '~/components/tooltip';

import styles from './EditableCell.module.scss';

/**
 * @typedef {object} EditableCellProps
 * @property {string} [value]
 * @property {function} [setValue]
 * @property {*} [children]
 * @property {string} [tableName]
 * @property {number} rowIndex
 * @property {object} [column]
 * @property {object} [api]
 * @property {object} [columnApi]
 * @property {string} [className]
 * @property {function} [validate]
 * @property {function} [onChange]
 * @property {function} [onClick]
 * @property {function} [ResizeObserver]
 * @property {*} [ref]
 */
/**
 * @type React.FC<EditableCellProps>
 */
export const EditableCell = React.forwardRef(({
  value,
  setValue,
  children,
  rowIndex,
  column,
  api,
  columnApi,
  className,
  tableName,
  validate,
  onChange,
  onClick,
  ResizeObserver,
  ...rest
}, ref) => {
  const colId = column.colId;
  const inputRef = React.useRef(null);
  const [focused, setFocused] = React.useState( isFocusedCell(api, rowIndex, colId) );
  const [tooltipOpen, setTooltipOpen] = React.useState(true);
  const wait = useTimeout();
  const eventHandler = useProcessEvent();

  const [error, _setError] = React.useState();
  const errorMessageRef = React.useRef('');
  const setError = e => {
    // Make sure the error message text is always set
    // or the tooltip text gets removed while it is
    // still visible.
    if (!!e) errorMessageRef.current = e;
    _setError(!!e);
  }

  const inputProps = getCellProps(rest);

  // TODO Open the tooltip on cell focus

  // TODO I'm not going to fix the following issues until we
  // remove AgGrid:
  // - When an error occurs (or is resolved), validators should be re-run for the
  //   row (or table)
  const doValidate = newValue => {
    const doSetValue = eventHandler((v, clearErrors = true) => {
      if (clearErrors) setError(undefined);
      if (v !== value) {
        setValue(v);
      }
    });

    const doSetError = eventHandler(e => {
      // Set the user's desired text even though it is not valid.
      doSetValue(newValue, false);
      setError(e.message
        ? e.message
        : typeof(e) === 'string'
          ? e
          : 'Please correct the value for this field.'
      );
    });

    try {
      // TODO validate promises needs to be cancelled/ignored if the async changes occur
      // faster than the validation (ie. ensure on the most recent validation call can
      // update the value).
      const p = validate(newValue, {rowIndex, column, api, columnApi, ...rest});
      // If we got back a promise, wait for it to resolve.
      if (p instanceof Promise) {
        p.then(result => doSetValue(result))
          .catch(e => doSetError(e));
      }
      // Otherwise, set the new value immediately.
      else {
        doSetValue(p);
      }
    } catch(e) {
      doSetError(e)
    }
  };

  //// AgGrid CELL KEY PRESS
  // Instead of using AgGrid's edit functionality we're implementing
  // editing directly in the cell render by using the keyboard events.
  // This ensures that the Input elements are never removed from the DOM
  // which provides better transitions between the editing and non-editing
  // states.
  React.useEffect(() => {
    // Listen to AgGrid's cell keypress event so we know
    // when the input should recieve focus.
    const handleKeyDown = eventHandler((...args) => {
      // Check the focused cell again because this closure will
      // not be up to date.
      if (isFocusedCell(api, rowIndex, colId)) {
        // Move focus to the trigger element if it's not already there.
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
          setFocused(true);
        }
      }
    });

    api.addEventListener('cellKeyPress', handleKeyDown);

    return () => {
      api.removeEventListener('cellKeyPress', handleKeyDown);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //// DOM KEY DOWN
  React.useEffect(() => {
    const el = inputRef.current;

    // Handle key down events directly on the Input element
    // so we can prevent some of them from bubbling up to AgGrid.
    const handleKeyDown = eventHandler(event => {
      switch(event.code) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          if (focused) {
            // Prevent agGrid from handling the arrow keys while
            // we're focused.
            event.stopPropagation();
            event.stopImmediatePropagation();
          }
        break;
        case 'Escape':
        case 'Enter':
          // Prevent AgGrid from handling these keys.
          event.stopPropagation();
          event.stopImmediatePropagation();

          // Exit editing by moving focus back to the parent cell
          // so the user can use the arrow keys to navigate the grid.
          // The wait it necessary so that AgGrid doesn't move focus
          // immediately back to the input element.
          wait(() => {
            setFocused(false);
            api.setFocusedCell(rowIndex, colId);
          }, 60);
        break;
      }
    });

    el.addEventListener('keydown', handleKeyDown);

    return () => {
      el.removeEventListener('keydown', handleKeyDown);
    };
  });

  //// VALIDATE
  React.useEffect(() => {
    if (validate) {
      doValidate(value)
    }
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const nextProps = {
    // Add a data-rendered attribute to the cell content
    // so we can determine when it has rendered.
    'data-rendered': true,
    'aria-label': getAriaLabel(rowIndex, column, columnApi, tableName),
    className: combineClasses(
      styles.EditableCell,
      className,
      focused ? styles.focused : null,
      error ? 'error' : null,
    ),
    error,
    onChange: eventHandler(event => {
      if (onChange) onChange(event);

      // Allow receiving either the value to set or an event object pointing
      // at an input element.
      const newValue = (event != null && typeof(event) === 'object' && event.target)
        ? event.target.value
        : event;

      setValue(newValue);
    }),
    onClick: eventHandler(event => {
      setFocused(true);
      if (onClick) onClick(event);
    }),
    ...inputProps,
  };

  const onTooltipOpen = eventHandler(() => {
    if (error) setTooltipOpen(true);
  });

  const onTooltipClose = eventHandler(() => {
    if (error) setTooltipOpen(false);
  });

  const wrap = c => !validate
    ? c
    : (
      <Tooltip
        isOpen={!!error && tooltipOpen}
        onOpen={onTooltipOpen}
        onClose={onTooltipClose}
        feel="error"
        content={errorMessageRef.current}
        children={c}
        layerOptions={{ResizeObserver}}
      />
    );

  if (children && typeof(children) === 'function') {
    return wrap(
      children(
        nextProps,
        mergeRefs(ref, inputRef),
        {value, rowIndex, column, api, columnApi, ...rest}
      )
    );
  } else {
    return wrap(
      <Input
        data-testid="EditableCell"
        transparent
        {...nextProps}
        value={value == null ? '' : value}
        ref={mergeRefs(ref, inputRef)}
      />
    );
  }
});

