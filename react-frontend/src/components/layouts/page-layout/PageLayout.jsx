import React from 'react';

import {
  combineClasses,
} from '@thesoulfresh/utils';

import styles from './PageLayout.module.scss';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {*} [props.children]
*/
export function PageLayout({
  className,
  children,
  ...rest
}) {
  return (
    <div data-testid="PageLayout"
      className={combineClasses(styles.PageLayout, className)}
      {...rest}
    >
      { children }
    </div>
  );
}

