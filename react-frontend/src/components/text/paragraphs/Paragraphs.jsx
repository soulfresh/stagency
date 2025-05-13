import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import styles from './Paragraphs.module.scss';

/**
 * `<Paragraph>` should be used for normal paragraph text.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {*} [props.children]
 */
export function Paragraph({
  className,
  ...rest
}) {
  return (
    <p data-testid="Paragraph"
      className={combineClasses(styles.Paragraph, className)}
      {...rest}
    />
  );
}

Paragraph.propTypes = {
  /**
   * Childen will be renders as the title text.
   */
  children: PropTypes.node.isRequired,
  /**
   * Any other props you pass will be applied to the
   * underlying element.
   */
  'other props...': PropTypes.any,
};

/**
 * `<BoldParagraph>` should be used for paragraphs of small bold text.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {*} [props.children]
 */
export function BoldParagraph({
  className,
  ...rest
}) {
  return (
    <p data-testid="BoldParagraph"
      className={combineClasses(styles.BoldParagraph, className)}
      {...rest}
    />
  );
}
