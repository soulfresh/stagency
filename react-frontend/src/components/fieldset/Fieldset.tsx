import React from 'react';

import { combineClasses } from '@thesoulfresh/utils';

import { Action } from '../buttons';
import styles from './Fieldset.module.scss';

export interface FieldsetProps extends React.HTMLProps<HTMLFieldSetElement> {
  /**
   * The content to render inside the HTML <legend>
   */
  legend?: React.ReactNode
  /**
   * Whether to use tighter padding around the children content.
   */
  tight?: boolean
  /**
   * Adds a delete button to the Fieldset for cases where the Fieldset is in
   * a list. This prop should be a callback function that will be called
   * when the user asks to delete this Fieldset.
   */
  onDelete?: () => void
  /**
   * The text to use for the delete button.
   */
  deleteText?: React.ReactNode
}

/**
 * `<Fieldset>` will render a Fieldset HTML element. You can specify the legend
 * for the Fieldset via the `legend` prop. The Fieldset content can be passed as
 * `children`.
 */
export function Fieldset({
  legend,
  tight,
  onDelete,
  deleteText = 'Delete',
  children,
  className,
  ...rest
}: FieldsetProps) {
  return (
    <div
      className={combineClasses(
        styles.wrapper,
        tight ? styles.tight : null,
        className,
      )}
    >
      {onDelete &&
      <Action
        className={styles.delete}
        display="link"
        feel="error"
        onClick={onDelete}
      >
        {deleteText}
      </Action>
      }
      <fieldset
        data-testid="Fieldset"
        className={styles.fieldset}
        {...rest}
      >
        <legend className={styles.legend}>{legend}</legend>
        <div className={styles.content}>
          {children}
        </div>
      </fieldset>
    </div>
  );
}

