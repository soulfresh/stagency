import React from 'react';
import PropTypes from 'prop-types';
import TextareaAutosize from 'react-autosize-textarea';

import { combineClasses } from '@thesoulfresh/utils';

import { InputDecorator } from '../InputDecorator.jsx';

import styles from './Textarea.module.scss';

/**
 * @typedef {object} TextareaProps
 * @property {boolean} [narrow]
 * @property {boolean} [boxy]
 * @property {boolean} [transparent]
 * @property {string|number} [value]
 * @property {string|number} [defaultValue]
 * @property {string} [feel]
 * @property {string|boolean} [error]
 * @property {function} [onValueChange]
 * @property {*} [ref]
 */
/**
 * `<Textarea>` is an auto-sizing text area input.
 * You can use this anywhere you need an `<input type="textarea" />`
 * and it takes the same props. This component is a simple warpper around
 * [react-autosize-textarea](https://www.npmjs.com/package/react-autosize-textarea)
 * so it is used in exactly the same way.
 *
 * This component inherits the functionality of `Input` and `InputDecorator`
 * so you can also use the `boxy`, `error` and `feel` props.
 *
 * @type React.FC<TextareaProps>
 */
export const Textarea = React.forwardRef(({className, ...props}, ref) => {
  return (
    <InputDecorator className={styles.InputDecorator} {...props}>
      {({className: inputClasses, ...nextProps}) =>
        <TextareaAutosize
          data-testid="Textarea"
          className={combineClasses(className, inputClasses, styles.Textarea)}
          {...nextProps}
          ref={ref}
        />
      }
    </InputDecorator>
  );
});

Textarea.propTypes = {
  /**
   * The text value of the textarea.
   */
  value: PropTypes.string,
  /**
   * Whether or not to allow rounded corners.
   */
  boxy: PropTypes.bool,
  /**
   * Remove the bottom padding that provides space for the
   * error messages.
   */
  tight: PropTypes.bool,
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
   * All other props will be applied to the
   * `react-autosize-textarea` component which
   * itself is just an HTML `textarea`.
   */
  '...other props': PropTypes.any,
};

