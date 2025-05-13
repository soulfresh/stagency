import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import styles from './ProgressBar.module.scss';

/**
 * `<ProgressBar>` displays a progress bar element
 * as a percentage width of it's parent element.
 * Pass a `progress` prop between 0 - 1. The
 * bar element will set its `style.width` property
 * to a string value between 0% - 100%.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {number} [props.progress]
 * @param {object} [props.style]
 * @param {string} [props.aria-label]
 */
export function ProgressBar({
  className,
  progress = 0,
  style,
  // @ts-ignore
  'aria-label': ariaLabel = 'Progress',
  ...rest
}) {
  const percent = Math.max(0, Math.min(progress * 100, 100));
  return (
    <div
      className={combineClasses(styles.ProgressBar, className)}
      {...rest}
    >
      <div data-testid="ProgressBar"
        className={styles.bar}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={`${ariaLabel}: ${percent}%`}
        style={{
          ...style,
          width: `${percent}%`,
        }}
      />
    </div>
  );
}

ProgressBar.propTypes = {
  /**
   * A value between 0 - 1 describing the current progress percentage.
   */
  progress: PropTypes.number.isRequired,
  /**
   * The text describing what this progress bar is tracking.
   * The label will have the current progress appended to it.
   *
   * Example output '${aria-label text}: 10%'
   */
  'aria-label': PropTypes.string,
  /**
   * Any other props will be applied to the root element.
   */
  '...other props': PropTypes.any,
};

