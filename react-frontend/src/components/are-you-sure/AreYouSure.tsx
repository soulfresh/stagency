import React from 'react';
import PropTypes from 'prop-types';

import { Dropdown } from '../dropdown'
import { TitleS } from '../text'
import { Action, CloseAction } from '../buttons'
import styles from './AreYouSure.module.scss';

export interface AreYouSureProps {
  className?: string
  title?: string
  message?: string
  confirmText?: string
  children: any // React.ReactNode
  onVerify: () => void
  onCancel?: () => void
}

/**
 * `<AreYouSure>` will present a confirmation dialog before a user action is
 * taken. It wraps it's children in a Dropdown which will open when the children
 * are pressed. The Dropdown contains a button that will call the `onVerify`
 * callback when pressed or the `onCancel` callback when the Dropdown is closed.
 */
export function AreYouSure({
  className,
  title = 'Are you sure?',
  message,
  confirmText = 'Yes',
  children,
  onVerify,
  onCancel,
  ...rest
}: AreYouSureProps) {
  const [open, setOpen] = React.useState(false)

  const onYes = () => {
    onVerify && onVerify()
    setOpen(false)
  }

  const onNo = () => {
    onCancel && onCancel()
    setOpen(false)
  }

  return (
    <Dropdown
      isOpen={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      content={(first, last) => {
        return (
          <div className={styles.AreYouSure}>
            {title &&
              <TitleS>{title}</TitleS>
            }
            {message &&
              <div className={styles.warningText}>
                {message}
              </div>
            }
            <Action
              solid
              feel="error"
              className={styles.deleteAction}
              onClick={onYes}
              ref={first}
              {...rest}
            >
              {confirmText}
            </Action>
            <CloseAction
              className={styles.close}
              onClick={onNo}
              ref={last}
            />
          </div>
        )
      }}
      children={children}
    />
  );
}

AreYouSure.propTypes = {
  className: PropTypes.string,
  /**
   * Any other props you pass will be forwarded to the root
   * element.
   */
  'other props...': PropTypes.any,
};

