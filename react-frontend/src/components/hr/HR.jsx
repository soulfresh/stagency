import React from 'react';

import { combineClasses } from '@thesoulfresh/utils';

import styles from './HR.module.scss';

/**
 * `<HR>` is a horizontal rule component. Generally it's preferred
 * that you use a bottom border but some times `<hr>` elements are
 * a convenient alternative.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @return {React.ReactElement}
 */
export function HR({
  className,
  ...rest
}) {
  return (
    <hr className={combineClasses(styles.HR, className)} aria-hidden="true" {...rest} />
  );
}

