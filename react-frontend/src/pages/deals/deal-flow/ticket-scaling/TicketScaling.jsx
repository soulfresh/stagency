import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import { TitleL } from '~/components';

import { TicketScalingSpreadsheet } from './ticket-scaling-spreadsheet';
import styles from './TicketScaling.module.scss';

// Memoize TicketScalingSpreadsheet because AgGrid will remove focus from any
// currently editing cells if it re-renders.
const TicketScalingSpreadsheetMemo = React.memo(TicketScalingSpreadsheet);

/**
 * The `<TicketScaling>` page shows how ticket prices are scaled
 * for a deal and the expected tax deductions.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {object} props.config
 * @param {function} [props.onReady]
 * @param {function} [props.onTicketUpdate]
 * @param {function} [props.onTicketRemove]
 * @param {function} [props.ResizeObserver]
 * @return {React.ReactElement}
 */
export function TicketScaling({
  className,
  deal,
  config,
  onTicketUpdate,
  onTicketRemove,
  onReady,
  ResizeObserver,
  ...rest
}) {
  // Ensure we don't break Memoization of TicketScalingSpreadsheet.
  const onContentReady = React.useCallback(() => onReady && onReady(), [onReady])
  return (
    <div data-testid="TicketScaling"
      className={combineClasses(styles.TicketScaling, className)}
      {...rest}
    >
      <TitleL>Ticket Scaling</TitleL>
      <TicketScalingSpreadsheetMemo
        data={deal?.tickets}
        types={config.TICKET_TYPES}
        onRowChange={onTicketUpdate}
        onRemoveRow={onTicketRemove}
        onContentReady={onContentReady}
        ResizeObserver={ResizeObserver}
      />
    </div>
  );
}

TicketScaling.propTypes = {
  deal: PropTypes.object,
  /**
   * Called each time a ticket scaling row is added
   * or updated.
   */
  onTicketUpdate: PropTypes.func,
  /**
   * Called when a ticket scaling row is removed.
   */
  onTicketRemove: PropTypes.func,
  onReady: PropTypes.func,
  ResizeObserver: PropTypes.func,
  /**
   * Any other props will be spread on the root element.
   */
  'other props...': PropTypes.any,
};

