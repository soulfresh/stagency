import React from 'react';
// import PropTypes from 'prop-types';
import toaster, { Toaster } from 'react-hot-toast';

import { combineClasses } from '@thesoulfresh/utils';

import { Warning as WarningIcon } from '~/assets'
import { CloseAction } from '../buttons';
import styles from './Toasts.module.scss';

export const ToastProvider = Toaster;

export interface ToastProps {
  className?: string
  message: React.ReactNode | ((dismiss: () => void) => React.ReactNode)
  toast: any
}

export function Toast({
  className,
  message,
  toast: toastProp,
  ...rest
}: ToastProps) {
  return (
    <div data-testid="Toast"
      {...rest}
    >
      <>
        <CloseAction
          className={styles.close}
          onClick={() => toaster.dismiss(toastProp.id)}
          aria-label="Hide Message"
        />
        {typeof message === 'function' ? message(() => toaster.dismiss(toastProp.id)) : message}
      </>
    </div>
  );
}

/**
 * `<Success>`
 */
export function Success(props: ToastProps) {
  return (
    <Toast data-testid="SuccessToast"
      {...props}
    />
  );
}

/**
 * `<Warn>`
 */
export function Warn(props: ToastProps) {
  return (
    <Toast data-testid="WarnToast"
      {...props}
    />
  );
}

/**
 * `<Error>`
 */
export function Error(props: ToastProps) {
  return (
    <Toast data-testid="ErrorToast"
      {...props}
    />
  );
}

type Duration = 's' | 'm' | 'l' | typeof Infinity | number
type ToastRender = (c: React.ReactNode) => React.ReactNode

export interface ToastOptions {
  showIcon?: boolean
  duration?: Duration
  className?: string
}

interface PrivateToastOptions extends ToastOptions {
  icon?: React.ReactNode
}

const TOAST_DURATIONS = {s: 2000, m: 4000, l: 10000, keep: -1}
function getDuration(duration: Duration = 'm') {
  return typeof duration === 'number' ? duration : (TOAST_DURATIONS[duration] || TOAST_DURATIONS.m)
}

function runToast(
  t: any,
  c: ToastRender,
  {duration, showIcon = true, ...options}: PrivateToastOptions = {} as PrivateToastOptions
) {
  const o = {
    duration: getDuration(duration),
    ...options
  } as any

  if (!showIcon) o.icon = null

  t(c, o)
}

export const toast = {
  success: (message: React.ReactNode, options?: ToastOptions) =>
    runToast(
      toaster.success,
      t => <Success data-testid="SuccessToast" message={message} toast={t} />,
      {
        ...options,
        className: combineClasses(styles.Toast, styles.Success),
      }
    ),

  warn: (message: React.ReactNode, options?: ToastOptions) =>
    runToast(
      toaster,
      t => <Warn data-testid="WarnToast" message={message} toast={t} />,
      {
        ...options,
        className: combineClasses(styles.Toast, styles.Warn),
        icon: <WarningIcon className={styles.warnIcon} />,
      }
    ),

  error: (message: React.ReactNode, options?: ToastOptions) =>
    runToast(
      toaster.error,
      t => <Error data-testid="ErrorToast" message={message} toast={t} />,
      {
        ...options,
        className: combineClasses(styles.Toast, styles.Error),
        duration: Infinity,
      }
    ),
}

