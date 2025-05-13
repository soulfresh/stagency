import React from 'react';
import ReactDOM from 'react-dom';
import { mergeRefs } from 'react-laag';

import { combineClasses } from '@thesoulfresh/utils';

import { isFocusedCell, getCellProps, getAriaLabel } from '../utils';
import { Select, SelectTrigger } from '../../inputs/select';

import styles from './SelectableCell.module.scss';

/**
 * @typedef {object} SelectableCellProps
 * @property {*} [ref]
 * @property {*} [value]
 * @property {function} [optionToString]
 * @property {[]} [options]
 * @property {string} [tableName]
 * @property {string} [className]
 * @property {string} [placeholder]
 * @property {function} [setValue]
 * @property {object} [api]
 * @property {object} [columnApi]
 * @property {object} [column]
 * @property {number} [rowIndex]
 * @property {object} [layerOptions]
 * @property {boolean} [compact]
 * @property {boolean} [disableAnimations]
 * @property {function|React.ReactNode} [children]
 * @property {function} [ResizeObserver] - A ResizeObserver polyfill
 *   (useful for testing)
 */
/**
 * @type React.FC<SelectableCellProps>
 */
export const SelectableCell = React.forwardRef(({
  value = '',
  optionToString,
  options,
  className,
  placeholder = '',
  tableName,
  setValue,
  api,
  columnApi,
  column,
  rowIndex,
  layerOptions,
  compact,
  disableAnimations,
  ResizeObserver,
  children,
  ...rest
}, ref) => {
  const {colId} = column;
  const isFocused = isFocusedCell(api, rowIndex, colId);

  const inputProps = getCellProps(rest);

  const triggerRef = React.useRef();
  const [isOpen, setIsOpen] = React.useState(false);

  // Make the isOpen value available to the cellKeyDown handler
  // so we don't have to add/remove the listener on each render.
  const isOpenRef = React.useRef(false);
  isOpenRef.current = isOpen;

  React.useEffect(() => {
    const handleKeyDown = ({event}) => {
      // Check the focused cell again because this closure will
      // not be up to date.
      if (isFocusedCell(api, rowIndex, colId)) {
        switch(event.code) {
          case 'Space':
          case 'Enter':
            // Focus the trigger when we're in the closed state.
            if (!isOpenRef.current) {
              triggerRef.current?.focus();
              setIsOpen(true);
            }
            break;
        }
      }
    };

    api.addEventListener('cellKeyDown', handleKeyDown);

    return () => {
      api.removeEventListener('cellKeyDown', handleKeyDown);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onOpen = ({type}) => {
    if (!isOpen && type === '__togglebutton_keydown_arrow_down__') {
      ReactDOM.unstable_batchedUpdates(() => {
        api.setFocusedCell(rowIndex + 1, colId);
      });
    } else if (!isOpen && type === '__togglebutton_keydown_arrow_up__') {
      ReactDOM.unstable_batchedUpdates(() => {
        api.setFocusedCell(rowIndex - 1, colId);
      });
    } else {
      setIsOpen(true);
    }
  }
  const onClose = () => setIsOpen(false);
  const onChange = v => setValue(v);

  const selectProps = {
    value,
    options,
    optionToString,
    isOpen,
    onOpen,
    onClose,
    onChange,
    compact,
    className: combineClasses(
      styles.SelectableCell,
      className,
      isFocused ? styles.focused : null,
    ),
    disableTransitions: disableAnimations,
    layerOptions: {
      ResizeObserver,
      ...layerOptions,
    },
    ...inputProps,
  }

  const triggerProps = {
    'aria-label': getAriaLabel(rowIndex, column, columnApi, tableName),
    'data-rendered': true,
    boxy: true,
    transparent: true,
  }

  if (children && typeof(children) === 'function') {
    return children(
      selectProps,
      {
        ...triggerProps,
        className: styles.SelectTrigger,
        placeholder,
        optionToString,
      },
      ref, // Needs to be applied to the trigger element
      {value, rowIndex, column, api, columnApi, ...rest}
    );
  } else {
    return (
      <Select
        data-testid="SelectMenu"
        {...selectProps}
      >
        {({className: triggerClassName, ...tProps}, item) => {
          return (
            <SelectTrigger
              data-testid="SelectableCell"
              {...triggerProps}
              className={combineClasses(styles.SelectTrigger, triggerClassName)}
              {...tProps}
              // onKeyDown={e => {
              //   tProps.onKeyDown(e);
              // }}
              ref={mergeRefs(triggerRef, ref)}
            >
              <span className={styles.triggerText}>
                { !item
                    ? placeholder
                    : optionToString
                    ? optionToString(item)
                    : item
                }
              </span>
            </SelectTrigger>
          )
        }}
      </Select>
    );
  }
});
