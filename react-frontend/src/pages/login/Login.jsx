import React from 'react';
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import { Action } from '~/components';

import styles from './Login.module.scss';

/**
 * `<Login>` page allowing the user to authenticate.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @return {ReactElement}
 */
export function Login({
  className,
  onLogin,
  ...rest
}) {
  return (
    <div data-testid="Login"
      className={combineClasses(styles.Login, className)}
      {...rest}
    >
      <Action onClick={onLogin}>Login</Action>
    </div>
  );
}

Login.propTypes = {
};

/**
 * `<LoginConnected>` connects the Login
 * component with the rest of the app (ie. routing, services, store, etc.).
 *
 * @param {object} props
 * @param {function} [props.onLogin] - A callback function to authenticate the user.
 * @param {function} [props.onForgotLogin] - A callback for when the user needs
 *   help signing in (ex. send a forgot password email or sms).
 * @return {ReactElement}
 */
// eslint-disable-next-line no-empty-pattern
export function LoginConnected({
  onLogin,
  // onForgotLogin,
}) {
  return (
    <Login onLogin={onLogin} />
  );
}
