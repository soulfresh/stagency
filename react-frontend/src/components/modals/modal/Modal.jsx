import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import { combineClasses } from '@thesoulfresh/utils';

import { cssTimeToMS } from '~/utils';
import { CloseAction } from '../../buttons';
import styles from './Modal.module.scss';

import { env } from '~/env';

if (!env.test) {
  ReactModal.setAppElement('#root');
}

/**
 * Use the `<Modal>` to show an overlay modal. Whatever content
 * you place in the modal will be rendered after the close button.
 * This is a controlled component so you will be required to pass
 * the `isOpen` and `setIsOpen` props in order to toggle the modal
 * state. You should also specify an `aria-label` to describe the
 * modal to screen reader users.
 *
 * The modal content area has no padding so you have full control
 * over that area.
 *
 * This component uses [react-modal](https://reactcommunity.org/react-modal/#general-usage)
 * under the hood so you can pass any props of that component.
 *
 * @param {object} props
 * @param {string} [props.aria-label]
 * @param {boolean} [props.isOpen]
 * @param {function} [props.setIsOpen]
 * @param {string} [props.className]
 * @param {function} [props.onOpen]
 * @param {function} [props.onClose]
 * @param {*} [props.children]
 * @param {boolean} [props.disableAnimations]
 * @param {function} [props.onRequestClose] - Alias for onClose
 * @return {React.ReactElement}
 */
export function Modal({
  className,
  // @ts-ignore
  'aria-label': ariaLabel,
  isOpen,
  setIsOpen,
  children,
  disableAnimations,
  ...rest
}) {
  let speed = 0;
  if (!disableAnimations) {
    const overlaySpeed = cssTimeToMS(styles.overlaySpeed);
    const contentSpeed = cssTimeToMS(styles.contentSpeed);
    speed = Math.max(overlaySpeed, contentSpeed);
  }

  return (
    // @ts-ignore: hyphen in aria-label is breaking this
    <ReactModal
      className={{
        base: combineClasses(styles.Modal, className),
        afterOpen: styles.ModalOpen,
        beforeClose: styles.ModalClosing,
      }}
      overlayClassName={{
        base: styles.overlay,
        afterOpen: styles.overlayOpen,
        beforeClose: styles.overlayClosing,
      }}
      closeTimeoutMS={speed}
      isOpen={isOpen}
      contentLabel={ariaLabel}
      {...rest}
      onRequestClose={() => setIsOpen(false)}
    >
      <CloseAction
        className={styles.close}
        onClick={() => setIsOpen(false)}
        aria-label="Close Modal"
      />
      {children}
    </ReactModal>
  );
}

Modal.setAppElement = ReactModal.setAppElement;

Modal.propTypes = {
  /**
   * You should give the modal a label that describes its content.
   */
  'aria-label': PropTypes.string,
  /**
   * Whether the modal is currently open.
   */
  isOpen: PropTypes.bool,
  /**
   * A function for setting the open state.
   */
  setIsOpen: PropTypes.func,
  /**
   * You can pass any props of
   * [`react-modal`](https://reactcommunity.org/react-modal/#general-usage)
   */
  'other props...': PropTypes.any,
};

