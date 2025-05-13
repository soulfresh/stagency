import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import { TitleXL } from '../../text';

import styles from './ErrorView.module.scss';

/**
 * The error view provides a consistent way to display
 * unresolvable errors to the users. Use this view to
 * display 404 message or Exception messages that break
 * the application.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} [props.title]
 * @param {*} [props.children]
 * @return {*}
 */
export function ErrorView({
  className,
  title = 'Uh Oh!',
  children,
  ...rest
}) {
  return (
    <div data-testid="NotFound"
      className={combineClasses(styles.NotFound, className)}
      {...rest}
    >
      <TitleXL data-testid="title">{ title }</TitleXL>
      { children &&
        <p data-testid="message">{ children }</p>
      }
    </div>
  );
}

ErrorView.propTypes = {
  /**
   * The main title describing the error.
   */
  title: PropTypes.string,
  /**
   * A more detailed description for the error.
   * This can be any type of content.
   */
  children: PropTypes.string,
  /**
   * Any other props you pass will be applied to
   * the root HTMLElement.
   */
  'other props...': PropTypes.any,
};
