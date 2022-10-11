import React from 'react';

import { combineClasses } from '@thesoulfresh/utils';

import styles from './Finished.module.scss';
import {DealSummary} from '../../deal-summary';
import {Deal} from '~/services';
import {Action} from '~/components';

export interface FinishedProps extends React.HTMLProps<HTMLDivElement> {
  deal: Partial<Deal>
  onShare: () => void
  onSave: () => void
  createDealURL: string
}

/**
 * `<Finished>` shows the summary of a deal with the ability to share it
 * and is the last page in the deal creation process.
 */
export function Finished({
  className,
  deal,
  onShare,
  onSave,
  createDealURL,
  ...rest
}: FinishedProps) {
  return (
    <div data-testid="Finished"
      className={combineClasses(styles.Finished, className)}
      {...rest}
    >
      <DealSummary className={styles.DealSummary} deal={deal} />
      <Action
        className={styles.Action}
        solid
        feel="primary"
        onClick={onShare}
      >
        Share
      </Action>
      <Action
        className={styles.Action}
        feel="primary"
        onClick={onSave}
      >
        Save Deal & Exit
      </Action>
      <Action
        className={styles.Action}
        feel="primary"
        display="button"
        href={createDealURL}
      >
        Create Another Deal
      </Action>
    </div>
  );
}

