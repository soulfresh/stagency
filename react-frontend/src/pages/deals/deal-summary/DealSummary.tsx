import React from 'react';

import { combineClasses } from '@thesoulfresh/utils';

import { Deal, Event } from '~/services';
import {
  Avatar,
  DateRange,
  NameList,
  TitleS,
  TitleL,
  CurrencyText,
  ResponsiveTable,
  TableCell,
} from '~/components';
import { dealSellableGrossPotential } from '~/model';

import styles from './DealSummary.module.scss';

function QuickSummary({
  eventType,
  events = [],
}: {
  eventType: string | undefined,
  events: Event[] | undefined
}) {
  const hasEventType = () => !!eventType
  const hasEvent = () => events && events.length && events[0].date
  const hasVenue = () => events && events.length && events[0].venue && events[0].venue.name

  if (hasEventType() || hasVenue() || hasEvent()) {
    return (
      <span className={styles.QuickSummary}>
        {hasEventType() &&
          <span className={styles.horizontalListItem}>{eventType}</span>
        }
        {hasVenue() &&
          <NameList
            className={styles.horizontalListItem}
            names={events.map(e => e.venue?.name)}
          />
        }
        {hasEvent() &&
          <DateRange
            className={styles.horizontalListItem}
            dates={events.map(e => e.date)}
          />
        }
      </span>
    )
  } else {
    return null
  }
}

export interface DealSummaryProps extends React.HTMLProps<HTMLDivElement> {
  deal: Partial<Deal>
}


/**
 * `<DealSummary>` shows a summary view of a Deal object. It is used during the
 * deal flow to help show the progress of deal completion.
 */
export function DealSummary({
  className,
  deal = {},
  ...rest
}: DealSummaryProps) {
  return (
    <div data-testid="DealSummary"
      className={combineClasses(styles.DealSummary, className)}
      {...rest}
    >
      <Avatar
        className={styles.Avatar}
        image={deal.artist?.image?.url}
        name={deal.artist?.name}
        size="l"
      />
      <ResponsiveTable
        columns={[
          {key: 'quickSummary', title: String(deal.artist?.name)},
          {key: 'shows', title: 'Shows'},
          // {key: 'dealStructure', title: 'Deal Structure'},
          // {key: 'splitPoint', title: 'Split Point'},
          {key: 'walkoutPotential', title: 'Walkout Potential'},
        ]}
        data={[{
          quickSummary: (
            <QuickSummary
              eventType={deal.eventType?.comment}
              events={deal.events}
            />
          ),
          shows: (
            <TitleS className={styles.title}>{deal.events?.length || 0}</TitleS>
          ),
          // dealStructure: deal.dealStructure?.type?.comment,
          // splitPoint: 700,
          walkoutPotential: (
            <TitleL className={combineClasses(styles.title, styles.gradientText)}>
              <CurrencyText>
                {
                  // TODO This should be the potential amount the artist will
                  // receive
                  dealSellableGrossPotential(deal.tickets)
                }
              </CurrencyText>
            </TitleL>
          )
        }]}
        renderCell={({column, row, ...props}) => (
          <TableCell
            {...props}
            column={column}
            row={row}
            children={row[column.key]}
          />
        )}
        renderHeader={({column}) => {
          switch(column.key) {
            case 'quickSummary':
              return (
                <TitleL className={styles.title}>
                  {column.title}
                </TitleL>
              )
            default:
              return (
                <TitleS className={styles.title}>
                  {column.title}
                </TitleS>
              )
          }
        }}
      />
    </div>
  );
}

