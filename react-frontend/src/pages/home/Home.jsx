import React from 'react';
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
import { combineClasses } from '@thesoulfresh/utils';

import {
  TitleXL,
} from '~/components';

import styles from './Home.module.scss';

/**
 * This is the home page of the app.
 *
 * @param {object} props
 * @param {string} [props.className]
 */
export function Home({
  className,
  ...rest
}) {
  return (
    <div data-testid="Home"
      className={combineClasses(styles.Home, className)}
      {...rest}
    >
      <TitleXL>Welcome Home!</TitleXL>
    </div>
  );
}

Home.propTypes = {
};

/**
 * @param {object} props
 */
// eslint-disable-next-line no-empty-pattern
export function HomeConnected({
  // history,
  // location,
  // match,
}) {
  return (
    <Home />
  );
}

