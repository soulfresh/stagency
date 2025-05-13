import React from 'react';

import {
  RoutedMultistepFlow,
  PreviousAction,
  Action,
  PageBlocker,
  AreYouSure,
  toast,
} from '~/components';
import { TicketScaling } from './ticket-scaling';
import { Schedule } from './schedule';
import { Expenses } from './expenses';
import { Basics } from './basics';
import { useDealBatchUpdate } from './useDealBatchUpdate';

import type { Deal, Artist, Venue, Person, Event, EventType, EventBillingType } from '~/services/types';
import type { ReplayableActionType } from '~/utils/types';

import styles from './DealFlow.module.scss';

interface ContentProps {
  children: React.ReactNode
  onNext: () => void
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {*} [props.children]
 * @param {function} [props.onNext]
 */
export function Content({
  children,
  onNext,
}: ContentProps) {
  return (
    <div className={styles.Content}>
      <div className={styles.pageContainer}>{children}</div>
      <Action
        className={styles.nextButton}
        onClick={onNext}
        solid
        feel="primary"
      >
        Next
      </Action>
    </div>
  );
}

interface DealFlowProps extends React.HTMLProps<HTMLDivElement> {
  deal: Deal
  onExit: () => void
  onCancel: () => void
  onSave: (deal: Deal, batch: any) => any
  onArtistSearch: (term: string) => Artist[]
  onVenueSearch: (term: string) => Venue[]
  onBuyerSearch: (term: string) => Person[]
  onCopromoterSearch: (term: string) => Person[]
  config: any
  ResizeObserver: () => void
}

/**
 * `<DealFlow>` is used to move between steps in the create/edit deal process.
 * Each page in the flow is associated with a URL using `RoutedMultistepFlow`.
 * Changes to the deal on each page are batch saved to the graph via the
 * ActionQueue which saves the changes in the background without having to block
 * the UI.
 *
 * IMPORTANT: Because the ActionQueue is shared between multiple pages and
 * AgGrid doesn't handle re-renders gracefully, it's important that callbacks
 * are wrapped in `React.useCallback` to avoid re-generating the ActionQueue or
 * re-rendering any of the AgGrid spreadsheets.
 */
export function DealFlow({
  className,
  deal: data = {} as Deal,
  onExit,
  onCancel,
  onSave,
  onArtistSearch,
  onVenueSearch,
  onBuyerSearch,
  onCopromoterSearch,
  config,
  ResizeObserver,
}: DealFlowProps) {
  const [loading, setLoading] = React.useState(false);

  const onError = React.useCallback((failedActions: ReplayableActionType[], e: Error) => {
    console.log('Network Error: Could not save these actions', failedActions, e);
    toast.error('There was an error saving your most recent edits. Please check your Internet connection. You may need to refresh the page and recreate your edits.');
    // TODO Setup failed request retrys
  //   toast.error(
  //     dismiss => (
  //       <RetryToast
  //         title="Failed to Save"
  //         message="We were unable to save your most recent edits. \
  //           Please check your Internet connection and then press the Retry button below."
  //         dismiss={dismiss}
  //         onYes={() => {
  //           console.log('What now?')
  //           // TODO Re-run action
  //         }}
  //       />
  //     ),
  //     {showIcon: false, duration: Infinity}
  //   )
  }, []);

  const {createAction, deal, queue} = useDealBatchUpdate({
    timeout: 3000,
    initialDeal: data,
    onSave,
    onError,
  });

  const onSaveAndExit = React.useCallback(() => {
    // show loader
    setLoading(true);

    // Flush the queue and wait for the data to save.
    queue.flush()
      .then(() => {
        onExit()
      })
      .catch(() => {
        // hide loader
        setLoading(false);

        // TODO Show Toast error and stay put (or leave or let the user decide)?
      })
  }, [onExit, queue]);


  // Used to find items inside the deal array properties (ex. find a ticket
  // scaling or a show schedule row).
  const findPredicate = (a: any, b: any) => a.__rowId === b.__rowId || a.id === b.id

  /* eslint-disable react-hooks/exhaustive-deps */
  const artistRemoveAction = createAction('object', 'artist', true)
  const onArtistRemove = React.useCallback(() => {
    artistRemoveAction('artist', null);
  }, [queue, deal]);

  const artistUpdateAction = createAction('object', 'artist', false)
  const onArtistUpdate = React.useCallback((artist: Artist) => {
    artistUpdateAction('artist', artist);
  }, [queue, deal])

  const eventTypeRemoveAction = createAction('object', 'eventType', true)
  const onEventTypeRemove = React.useCallback(() => {
    eventTypeRemoveAction('eventType', null);
  }, [queue, deal]);

  const eventTypeUpdateAction = createAction('object', 'eventType', false)
  const onEventTypeUpdate = React.useCallback((eventType: EventType) => {
    eventTypeUpdateAction('eventType', eventType);
  }, [queue, deal])

  const billingTypeRemoveAction = createAction('object', 'eventBillingType', true)
  const onBillingTypeRemove = React.useCallback(() => {
    billingTypeRemoveAction('eventBillingType', null);
  }, [queue, deal]);

  const billingTypeUpdateAction = createAction('object', 'eventBillingType', false)
  const onBillingTypeUpdate = React.useCallback((billingType: EventBillingType) => {
    billingTypeUpdateAction('eventBillingType', billingType);
  }, [queue, deal])

  const ticketUpdateAction = createAction('array', 'tickets', false, findPredicate)
  const onTicketUpdate = React.useCallback((_: any, tableData: any, __rowId: any) => {
    // __rowId is a unique identifier that can be used to find rows in our
    // Spreadsheets. We use the __rowId because that's the only way to find
    // Spreadsheet rows that haven't been saved to the database yet.
    ticketUpdateAction(__rowId, {...tableData, __rowId});
    // Only re-render if the queue changed (not the deal)
  }, [queue]);

  const ticketRemoveAction = createAction('array', 'tickets', true, findPredicate)
  const onTicketRemove = React.useCallback((_: any, tableData: any, __rowId: any) => {
    ticketRemoveAction(__rowId, {...tableData, __rowId});
    // Only re-render if the queue changed (not the deal)
  }, [queue]);

  const showScheduleUpdateAction = createAction('array', 'showSchedule', false, findPredicate)
  const onShowScheduleUpdate = React.useCallback((_: any, tableData: any, __rowId: any) => {
    showScheduleUpdateAction(__rowId, {...tableData, __rowId});
    // Only re-render if the queue changed (not the deal)
  }, [queue]);

  const showScheduleRemoveAction = createAction('array', 'showSchedule', true, findPredicate)
  const onShowScheduleRemove = React.useCallback((_: any, tableData: any, __rowId: any) => {
    showScheduleRemoveAction(__rowId, {...tableData, __rowId});
    // Only re-render if the queue changed (not the deal)
  }, [queue]);

  const performanceScheduleUpdateAction = createAction('array', 'performanceSchedule', false, findPredicate)
  const onPerformanceScheduleUpdate = React.useCallback((_: any, tableData: any, __rowId: any) => {
    performanceScheduleUpdateAction(__rowId, {...tableData, __rowId});
    // Only re-render if the queue changed (not the deal)
  }, [queue]);

  const performanceScheduleRemoveAction = createAction('array', 'performanceSchedule', true, findPredicate)
  const onPerformanceScheduleRemove = React.useCallback((_: any, tableData: any, __rowId: any) => {
    performanceScheduleRemoveAction(__rowId, {...tableData, __rowId});
    // Only re-render if the queue changed (not the deal)
  }, [queue]);

  const expenseUpdateAction = createAction('array', 'expenses', false, findPredicate)
  const onExpenseUpdate = React.useCallback((_: any, tableData: any, __rowId: any) => {
    expenseUpdateAction(__rowId, {...tableData, __rowId});
    // Only re-render if the queue changed (not the deal)
  }, [queue]);

  const expenseRemoveAction = createAction('array', 'expenses', true, findPredicate)
  const onExpenseRemove = React.useCallback((_: any, tableData: any, __rowId: any) => {
    expenseRemoveAction(__rowId, {...tableData, __rowId});
    // Only re-render if the queue changed (not the deal)
  }, [queue]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const steps = [
    {
      title: 'Basics',
      path: 'basics',
      render: (props: any) => (
        <Content {...props}>
          <Basics
            artist={deal.artist}
            onArtistChange={(e: Artist) => {
              if (!e) onArtistRemove()
              else onArtistUpdate(e)
            }}
            onArtistSearch={onArtistSearch}
            eventTypes={config.EVENT_TYPES}
            eventType={deal.eventType}
            onEventTypeChange={(e: EventType) => {
              if (!e) onEventTypeRemove()
              else onEventTypeUpdate(e)
            }}
            billingTypes={config.EVENT_BILLING_TYPES}
            billingType={deal.eventBillingType}
            onBillingTypeChange={(e: EventBillingType) => {
              if (!e) onBillingTypeRemove()
              else onBillingTypeUpdate(e)
            }}
            events={deal.events}
            onEventsChange={(e: Event[]) => console.log('onEventsChange', e)}
            onVenueSearch={onVenueSearch}
            onBuyerSearch={onBuyerSearch}
            onCopromoterSearch={onCopromoterSearch}
            ResizeObserver={ResizeObserver}
          />
        </Content>
      )
    },
    {
      title: 'Ticket Scaling & Deductions',
      path: 'ticket-scaling',
      render: (props: any) => (
        <Content {...props}>
          <TicketScaling
            deal={deal}
            config={config}
            onTicketUpdate={onTicketUpdate}
            onTicketRemove={onTicketRemove}
          />
        </Content>
      )
    },
    {
      title: 'Expenses',
      path: 'expenses',
      render: (props: any) => (
        <Content {...props}>
          <Expenses
            deal={deal}
            config={config}
            onExpenseUpdate={onExpenseUpdate}
            onExpenseRemove={onExpenseRemove}
          />
        </Content>
      )
    },
    {
      title: 'Schedule',
      path: 'schedule',
      render: (props: any) => (
        <Content {...props}>
          <Schedule
            deal={deal}
            config={config}
            onShowScheduleUpdate={onShowScheduleUpdate}
            onShowScheduleRemove={onShowScheduleRemove}
            onPerformanceScheduleUpdate={onPerformanceScheduleUpdate}
            onPerformanceScheduleRemove={onPerformanceScheduleRemove}
          />
        </Content>
      )
    },
  ];

  return (
    <div className={className}>
      {loading &&
        <PageBlocker message="Saving..." />
      }
      <RoutedMultistepFlow
        className={styles.DealFlow}
        steps={steps}
        renderPrevious={({index, previousURL}) => {
          // Back
          if (index > 0) {
            return (
              <PreviousAction
                href={previousURL}
                display="link"
                feel="primary"
              >
                Back
              </PreviousAction>
            )
          }
          // Cancel
          else if (onCancel) {
            return (
              <AreYouSure
                onVerify={onCancel}
                message="This will delete the Deal you are working on."
                confirmText="Delete Deal"
              >
                <PreviousAction
                  display="link"
                  feel="primary"
                >
                  Cancel
                </PreviousAction>
              </AreYouSure>
            )
          }
          else {
            // Ensure that this space is reserved so the title will be centered.
            return <div></div>;
          }
        }}
        renderNext={() =>
          <Action
            display="link"
            feel="primary"
            onClick={onSaveAndExit}
          >
            Save and Exit
          </Action>
        }
      >
      </RoutedMultistepFlow>
    </div>
  );
}

