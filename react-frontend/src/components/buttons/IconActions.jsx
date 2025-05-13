import React from 'react';
import { combineClasses } from '@thesoulfresh/utils';

import { Action } from './Action.jsx';

import styles from './IconActions.module.scss';

import { Close as CloseIcon, Chevron as DownIcon, More as MoreIcon, Add as AddIcon } from '~/assets';

const RightIcon = props =>
  <DownIcon style={{transform: 'rotate(-90deg)'}} {...props} />

const LeftIcon = props =>
  <DownIcon style={{transform: 'rotate(90deg)'}} {...props} />

const withChildren = (icon, children, direction = 'right') =>
  <span className={styles.children}>
    {direction === 'right' &&
      <span className={combineClasses(styles.iconWrapper, !!children && styles.right)}>{icon}</span>
    }
    {children}
    {direction !== 'right' &&
      <span className={combineClasses(styles.iconWrapper, !!children && styles.left)}>{icon}</span>
    }
  </span>

/**
 * @typedef {import('./Action.jsx').ActionProps} ActionProps
 */
/**
 * @typedef {ActionProps} IconActionProps
 * @property {*} [ref]
 * @property {string} [className]
 * @property {boolean} [icon]
 * @property {string} [direction]
 * @property {string} [display]
 * @property {string} [feel]
 */

/**
 * @type React.FC<IconActionProps>
 */
export const CloseAction = React.forwardRef(({
  className,
  children,
  direction,
  ...rest
}, ref) => {
  return (
    <Action
      ref={ref}
      className={combineClasses(styles.CloseAction, className)}
      aria-label={!children ? "Close" : undefined}
      {...rest}
      children={withChildren(<CloseIcon />, children, direction)}
      icon
    />
  );
});


/**
 * @type React.FC<IconActionProps>
 */
export const NextAction = React.forwardRef(({
  className,
  children,
  direction,
  ...rest
}, ref) => {
  return (
    <Action
      ref={ref}
      className={combineClasses(styles.NextAction, className)}
      aria-label={!children ? "Next" : undefined}
      {...rest}
      children={withChildren(<RightIcon />, children, direction)}
      icon
    />
  );
});

/**
 * @type React.FC<IconActionProps>
 */
export const PreviousAction = React.forwardRef(({
  className,
  children,
  direction,
  ...rest
}, ref) => {
  return (
    <Action
      ref={ref}
      className={combineClasses(styles.PreviousAction, className)}
      aria-label={!children ? "Previous" : undefined}
      {...rest}
      children={withChildren(<LeftIcon />, children, direction)}
      icon
    />
  );
});

/**
 * @type React.FC<IconActionProps>
 */
export const MoreAction = React.forwardRef(({
  className,
  children,
  direction,
  ...rest
}, ref) => {
  return (
    <Action
      ref={ref}
      className={combineClasses(styles.MoreAction, className)}
      aria-label={!children ? "More" : undefined}
      {...rest}
      children={withChildren(<MoreIcon />, children, direction)}
      icon
    />
  );
});

/**
 * @type React.FC<IconActionProps>
 */
export const AddAction = React.forwardRef(({
  className,
  children,
  direction,
  ...rest
}, ref) => {
  return (
    <Action
      ref={ref}
      className={combineClasses(styles.AddAction, className)}
      aria-label={!children ? "Add" : undefined}
      {...rest}
      children={withChildren(<AddIcon />, children, direction)}
      icon
    />
  );
});
