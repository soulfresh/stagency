import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import styles from './Label.module.scss';

/**
 * A standard `<label>` element. There are several ways
 * you can use this component.
 *
 * The recommended approach is to wrap your input inside
 * of the label:
 *
 * ```xml
 * <Label title="First Name">
 *   <Input />
 * </Label>
 * ```
 *
 * You can also use an id to associate the label and input:
 *
 * ```xml
 * const inputId = useId('input');
 * <Label for={inputId}>
 *   First Name
 * </Label>
 * <Input id={inputId} />
 * ```
 *
 * @param {object} props
 * @param {string} [props.title] - The text to render as the
 * label text if you are also wrapping an input element.
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 */
export function Label({
  className,
  title,
  children,
  ...rest
}) {
  return (
    <label data-testid="Label"
      className={combineClasses(styles.Label, className)}
      {...rest}
    >
      { title &&
        <span className={styles.title}>{ title }</span>
      }
      { children }
    </label>
  );
}

Label.propTypes = {
  /**
   * The title text to display if you are also wrapping
   * your input element inside the label. This can be
   * any JSX content that is HTML phrasing content
   * (your title prop will be wrapped in a `<span>`).
   */
  title: PropTypes.node,
  /**
   * Any other props you pass will be applied to the
   * label element.
   */
  '...other props': PropTypes.any,
};

