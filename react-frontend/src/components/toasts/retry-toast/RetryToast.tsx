import React from 'react';

import { combineClasses } from '@thesoulfresh/utils';

import { TitleS } from '../../text';
import { Action } from '../../buttons';
import styles from './RetryToast.module.scss';

type RetryToastProps = React.HTMLProps<HTMLDivElement> & {
  dismiss: () => void
  title?: string
  message?: string
  onYes?: () => void
  onNo?: () => void
}
// interface RetryToastProps extends HTMLDivElement { }

/**
 * `<RetryToast>` can be used in conjuncture with `toast.error()` to provide a
 * toast message with Retry/Cancel buttons for retrying a failed
 * ReplayableAction.
 */
export function RetryToast({
  dismiss,
  title = 'Failed to save',
  message = 'Would you like to try again?',
  onYes,
  onNo,
  className,
  ...rest
}: RetryToastProps) {
  return (
    <div data-testid="RetryToast"
      className={combineClasses(styles.RetryToast, className)}
      {...rest}
    >
      <TitleS>{title}</TitleS>
      <div className={styles.message}>
        {message}
      </div>
      <div className={styles.actions}>
        <Action
          feel="error"
          solid
          onClick={() => {
            dismiss()
            onYes && onYes()
          }}
        >
          Retry
        </Action>
        <Action
          feel="secondary"
          solid
          onClick={() => {
            dismiss()
            onNo && onNo()
          }}
        >
          Cancel
        </Action>
      </div>
    </div>
  )
}
