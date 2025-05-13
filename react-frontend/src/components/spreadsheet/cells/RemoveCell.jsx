import React from 'react';

import { CloseAction } from '../../buttons';

import styles from './RemoveCell.module.scss';

/**
 * `<RemoveCell>`
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {function} [props.onRemove]
 * @param {number} [props.rowIndex]
 * @param {object} [props.api] - The AgGrid API object.
 * @param {object} [props.node]
 * @param {object} [props.column]
 */
export function RemoveCell({
  className,
  onRemove,
  rowIndex,
  api,
  node,
  column
}) {
  return (
    <CloseAction
      data-testid="RemoveCell"
      data-rendered={true}
      className={styles.RemoveCell}
      feel="error"
      aria-label={`Remove Row ${rowIndex + 1}`}
      onClick={() => onRemove(node, {api, column, node, rowIndex})}
    />
  );
}

