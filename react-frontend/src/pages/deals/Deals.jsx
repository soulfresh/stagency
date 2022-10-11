import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';
import { useProcessEvent } from '@thesoulfresh/react-tools';

import { DealPropType } from '~/model';
import { getRoute } from '~/routes';
import { formatDate, NBSP } from '~/utils';
import {
  Table,
  Avatar,
  MoreAction,
  Dropdown,
  Action,
  Input,
  NameList,
  DateRange,
} from '~/components';
import { useGraphQLService } from '~/services';
import styles from './Deals.module.scss';

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export function Empty({children = 'N/A'}) {
  return (
    <span className={styles.NA}>{children}</span>
  );
}

/**
 * @param {object} props
 * @param {object[]} [props.deals]
 * @param {(deal: object) => string} [props.getDealURL]
 * @param {(deal: object) => void} [props.onDeleteDeal]
 * @param {function} [props.ResizeObserver]
 */
export function DealsList({
  deals,
  getDealURL,
  onDeleteDeal,
  ResizeObserver,
}) {
  // TODO Transition to using `ResponsiveTable`. See below for a good starting
  // point.
  return (
    <Table aria-label="Deals List" className={styles.dealsList}>
      <thead>
        <tr>
          <th>Artist</th>
          <th>Venues</th>
          <th>Event Dates</th>
          <th>Last Modified</th>
          <th>Status</th>
          <th aria-label="Actions"></th>
        </tr>
      </thead>
      <tbody>
        {deals.map((deal, i) =>
        <tr key={deal.id}>
          <td>
            {deal.artist
              ? (
                <Avatar
                  className={styles.avatar}
                  labelled
                  name={deal.artist.name}
                  image={deal.artist.image?.url}
                  size="s"
                />
              )
              : <Empty />
            }
          </td>
          <td className={styles.important}>
            {deal.events.length > 0
              ? (
                <NameList
                  names={deal.events.map(e => e.venue.name)}
                  renderTooltipItem={(item, i) =>
                    <>
                      <span className={styles.tooltipItemName}>{item}:</span>
                      {NBSP}
                      {formatDate(deal.events[i].date)}
                    </>
                  }
                  layerOptions={{ResizeObserver}}
                />
              )
              : <Empty />
            }
          </td>
          <td className={styles.important}>
            {deal.events.length > 0
              ? <DateRange dates={deal.events.map(e => e.date)} />
              : <Empty />
            }
          </td>
          <td>
            {formatDate(deal.lastUpdated)}
          </td>
          <td className={styles.important}>
            {deal.status
              ? deal.status?.comment
              : <Empty>Pending</Empty>
            }
          </td>
          <td>
            <Dropdown
              layerOptions={{ResizeObserver}}
              content={(first, last) =>
                <div className={styles.actionMenu}>
                  <Action transparent display="button" ref={first} href={getDealURL(deal)}>
                    Edit
                  </Action>
                  <Action
                    transparent
                    display="button"
                    ref={last}
                    onClick={() => onDeleteDeal(deal)}
                  >
                    Delete
                  </Action>
                </div>
              }
            >
              <MoreAction
                aria-label="Deal Actions"
              />
            </Dropdown>
          </td>
        </tr>
        )}
      </tbody>
    </Table>
  );
  //   TODO Replace this with ResponsiveTable. However,
  //   we'll want to give the respobnsive table a nicer
  //   layout than simply a vertical list.
  //   Here is a starting point for the transition:
  // <ResponsiveTable aria-label="Deals List"
  //   data={deals}
  //   columns={[
  //     {title: 'Artist',        key: 'artist'},
  //     {title: 'Venues',        key: 'venues' },
  //     {title: 'Event Dates',   key: 'dates'},
  //     {title: 'Last Modified', key: 'modified'},
  //     {title: 'Status',        key: 'status'},
  //     {title: '',              key: 'actions'},
  //   ]}
  //   renderCell={({column, row: deal, ...cellProps}) => {
  //     const wrap = (props) => (
  //       <TableCell
  //         column={column}
  //         row={deal}
  //         {...props}
  //         {...cellProps}
  //       />
  //     );
  //
  //     switch (column.key) {
  //       case 'artist':
  //         return wrap({
  //           children: deal.artist
  //             ? (
  //               <Avatar
  //                 className={styles.avatar}
  //                 labelled
  //                 name={deal.artist.name}
  //                 image={deal.artist.image?.url}
  //                 size="s"
  //               />
  //             )
  //             : <Empty />
  //         });
  //       case 'venues':
  //         return wrap({
  //           children: (
  //             <span className={styles.important}>
  //               {deal.events.length > 0
  //                 ? (
  //                   <NameList
  //                     names={deal.events.map(e => e.venue.name)}
  //                     renderTooltipItem={(item, i) =>
  //                       <>
  //                         <span className={styles.tooltipItemName}>{item}:</span>
  //                         {NBSP}
  //                         {formatDate(deal.events[i].date)}
  //                       </>
  //                     }
  //                     layerOptions={{ResizeObserver}}
  //                   />
  //                 )
  //                 : <Empty />
  //               }
  //             </span>
  //           )
  //         })
  //       case 'dates':
  //         return wrap({
  //           children: (
  //             <span className={styles.important}>
  //               {deal.events.length > 0
  //                 ? <DateRange dates={deal.events.map(e => e.date)} />
  //                 : <Empty />
  //               }
  //             </span>
  //           )
  //         })
  //       case 'modified':
  //         return wrap({
  //           children: formatDate(deal.lastUpdated)
  //         });
  //       case 'status':
  //         return wrap({
  //           className: styles.important,
  //           children: (
  //             <span className={styles.important}>
  //               {deal.status
  //                 ? deal.status?.comment
  //                 : <Empty>Pending</Empty>
  //               }
  //             </span>
  //           )
  //         });
  //       case 'actions':
  //         return wrap({
  //           children: (
  //             <Dropdown
  //               layerOptions={{ResizeObserver}}
  //               content={(first, last) =>
  //                 <div className={styles.actionMenu}>
  //                   <Action transparent display="button" ref={first} href={getDealURL(deal)}>
  //                     Edit
  //                   </Action>
  //                   <Action
  //                     transparent
  //                     display="button"
  //                     ref={last}
  //                     onClick={() => onDeleteDeal(deal)}
  //                   >
  //                     Delete
  //                   </Action>
  //                 </div>
  //               }
  //             >
  //               <MoreAction
  //                 aria-label="Deal Actions"
  //               />
  //             </Dropdown>
  //           )
  //         })
  //     }
  //   }}
  // />
}


/**
 * `<Deals>`
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {object[]} [props.deals]
 * @param {(deal: object) => string} [props.getDealURL]
 * @param {string} [props.newDealURL]
 * @param {(deal: object) => void} [props.onDeleteDeal]
 * @param {function} [props.ResizeObserver]
 * @return {React.ReactElement}
 */
export function Deals({
  className,
  deals = [],
  getDealURL,
  newDealURL,
  onDeleteDeal,
  ResizeObserver,
  ...rest
}) {
  const handleEvent = useProcessEvent();
  const [searchFilter, setSearchFilter] = React.useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearch = React.useCallback(
    handleEvent(
      // @ts-ignore
      e => setSearchFilter(() => new RegExp(e.target.value, 'i'))
    ),
    [setSearchFilter, handleEvent]
  )

  // TODO Better wrapping of the cells on mobile.
  // https://css-tricks.com/responsive-data-tables/

  const filteredDeals = !searchFilter
    ? deals
    : deals.filter(deal =>
        // Artist Name
        // @ts-ignore: not true
        searchFilter.test(deal.artist?.name) ||
        // Venue Name
        // @ts-ignore: not true
        deal.events?.findIndex(e => searchFilter.test(e.venue.name)) > -1 ||
        // Deal Status
        // @ts-ignore: not true
        searchFilter.test(deal.status?.comment) ||
        // Event Dates
        // @ts-ignore: not true
        searchFilter.test(
          deal.events?.map(d => formatDate(d.date, {dateStyle: 'full'})).join(' ')
        )
      );

  return (
    <div data-testid="Deals"
      className={combineClasses(styles.Deals, className)}
      {...rest}
    >
      <div className={styles.searchLine}>
        <Input
          className={styles.searchInput}
          placeholder="Search Deals"
          onChange={onSearch}
          narrow
          tight
          clearable
        />
        <Action
          href={newDealURL}
          feel="primary"
          display="button"
          solid
          narrow
        >
          Create Deal
        </Action>
      </div>
      <div className={styles.dealList}>
        <DealsList
          deals={filteredDeals}
          getDealURL={getDealURL}
          onDeleteDeal={onDeleteDeal}
          ResizeObserver={ResizeObserver}
        />
      </div>
    </div>
  );
}

Deals.propTypes = {
  deals: PropTypes.arrayOf(DealPropType),
}

/**
 * `<DealsConnected>` connects the Deals
 * component with the rest of the app (ie. routing, services, store, etc.).
 *
 * @param {object} props
 * @return {React.ReactElement}
 */
// eslint-disable-next-line no-empty-pattern
export function DealsConnected({
  // history,
  // location,
  // match,
  ResizeObserver
}) {
  const api = useGraphQLService()
  const [deals, setDeals] = React.useState([])

  const onDeleteDeal = async (deal) => {
    try {
      // TODO Use a subscription to the deal list so it automatically refreshes
      // after deleting a deal.
      await api.deleteDeal(deal.id);
    } catch(e) {
      // TODO Show a toast
    }
  }

  React.useEffect(() => {
    // Watch the deals query so the table will refresh when we delete a deal.
    const o = api.watchDeals().subscribe({
      next: deals => {
        setDeals(deals);
      },
      error: err => {
        // TODO Show a toast
        console.error(err)
      }
    })

    return () => o.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Deals
      deals={deals}
      getDealURL={({id}) => getRoute('DEAL', {id})}
      newDealURL={getRoute('CREATE_DEAL')}
      onDeleteDeal={onDeleteDeal}
      ResizeObserver={ResizeObserver}
    />
  );
}

