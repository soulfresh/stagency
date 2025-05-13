import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import styles from './Titles.module.scss';

/**
 * `<TitleXL>` represents the title for a page section
 * and will render as an `<h1>` element.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {*} [props.children]
 * @return {React.ReactElement}
 */
export function TitleXL({
  className,
  children,
  ...rest
}) {
  return (
    <h1 data-testid="TitleXL"
      className={combineClasses(styles.TitleXL, className)}
      {...rest}
    >
      { children }
    </h1>
  );
}

TitleXL.propTypes = {
  /**
   * Childen will be renders as the title text.
   */
  children: PropTypes.node.isRequired,
  /**
   * Any other props you pass will be applied to the
   * underlying element.
   */
  'other props...': PropTypes.any,
}

/**
 * `<TitleL>` represents the title for a page section
 * and will render as an `<h1>` element.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {*} [props.children]
 * @return {React.ReactElement}
 */
export function TitleL({
  className,
  children,
  ...rest
}) {
  return (
    <h2 data-testid="TitleL"
      className={combineClasses(styles.TitleL, className)}
      {...rest}
    >
      { children }
    </h2>
  );
}

/**
 * `<Title>` represents the title for a page section
 * and will render as an `<h2>` element.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {*} [props.children]
 * @return {React.ReactElement}
 */
export function Title({
  className,
  children,
  ...rest
}) {
  return (
    <h3 data-testid="Title"
      className={combineClasses(styles.Title, className)}
      {...rest}
    >
      { children }
    </h3>
  );
}

/**
 * `<TitleS>` represents the title for a page section
 * and will render as an `<h1>` element.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {*} [props.children]
 * @return {React.ReactElement}
 */
export function TitleS({
  className,
  children,
  ...rest
}) {
  return (
    <h4 data-testid="TitleS"
      className={combineClasses(styles.TitleS, className)}
      {...rest}
    >
      { children }
    </h4>
  );
}

/**
 * `<TitleTiny>` represents the title for a page section
 * and will render as an `<h1>` element.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {*} [props.children]
 * @return {React.ReactElement}
 */
export function TitleTiny({
  className,
  children,
  ...rest
}) {
  return (
    <h5 data-testid="TitleTiny"
      className={combineClasses(styles.TitleTiny, className)}
      {...rest}
    >
      { children }
    </h5>
  );
}

/**
 * `<CapsLabel>`
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {*} [props.children]
 * @return {React.ReactElement}
 */
export function CapsLabel({
  className,
  children,
  ...rest
}) {
  return (
    <h6 data-testid="Label"
      className={combineClasses(styles.CapsLabel, className)}
      {...rest}
    >
      { children }
    </h6>
  );
}

