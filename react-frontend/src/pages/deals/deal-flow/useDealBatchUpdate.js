import React from 'react';

import { ActionQueue, ReplayableAction, merge, saveEntityBatch } from '~/utils';

/**
 * @typedef BatchUpdateHookResponse
 * @property {(propertyType: string, propertyName: string, remove?: boolean, findPredicate?: (a: any, b: any) => any) => (identifier:any, newData:any) => void} createAction - A
 *   function that will create a callback that will add new ReplayableAction
 *   objects to the queue.
 * @property {Deal} deal - The current state of the deal object.
 * @property {ActionQueue} queue - The ActionQueue object.
 */
/**
 * `useDealBatchUpdate` creates an ActionQueue that can be used to batch save
 * edits to a deal object. It also provides a simplified `createAction` factory
 * for creating callback that add actions to the ActionQueue.
 *
 * In order to share the generated queue between multiple pages, make sure that
 * `onSave` and `onError` definitions are wrapped in `React.useCallback` to
 * avoid re-generating the queue.
 *
 * @param {object} [initialDeal] - The initial state of the deal object.
 * @param {(request:ReplayableAction[]) => Promise<object>} [onSave] - A function that can
 *   batch save an array of ReplayableAction objects.
 * @param {(request:ReplayableAction[]) => void} [onError] - A function that
 *   will be called with any actions that fail to save.
 *
 * @return {BatchUpdateHookResponse}
 */
export const useDealBatchUpdate = ({
  initialDeal,
  onSave,
  onError,
  timeout = 3000,
  debug = false,
}) => {
  let queueCount = React.useRef()
  let [deal, _setDeal] = React.useState(() => merge(
    {
      tickets: [],
      showSchedule: [],
      performanceSchedule: [],
      expenses: [],
    },
    initialDeal
  ));
  // Use a ref to store the deal so changes to the deal object won't cause the
  // queue to be recreated.
  const dealRef = React.useRef(deal);

  // Keep the dealRef up to date with the actual deal.
  const setDeal = (deal) => {
    dealRef.current = deal;
    _setDeal(deal);
  }

  const queue = React.useMemo(
    () => {
      // Track the number of times the queue is created so we can log warnings.
      queueCount.current++;
      if (queueCount.current > 1) {
        console.warn(
          `[useDealBatchUpdate] creating a new queue object. \
          This will invalidate the previous queue. \
          Queue was created ${queueCount.current} times.`
        );
      }

      const onComplete = (updatedDeal) => {
        setDeal({...updatedDeal});
      }

      const handleSave = (batch) => saveEntityBatch(
        dealRef.current,
        batch,
        onSave,
        onComplete,
        debug
      )

      return new ActionQueue(handleSave, onError, timeout, debug)
    },
    [onSave, onError, debug, timeout]
  );

  const createAction = (type, property, remove = false, findPredicate) => {
    return (identifier, newData) => {
      queue.add(
        `${property}:${identifier}`,
        new ReplayableAction(
          // The type of property being modified (array, object, other).
          type,
          // The name of the property being modified.
          property,
          // Add the row id to the data so we can look up this item again if any
          // updates occure before the data is saved to the DB.
          newData,
          // Whether the property should be removed/nullified.
          remove,
          // A compare function used to find the item in a list (for arrays only).
          findPredicate
        )
      );

      // Optimistically re-render with the updated Deal object.
      // We don't do this with array updates because the tables
      // currently treat the data a mutable and re-rendering would
      // cause rendering issues with AgGrid.
      if (type !== 'array') {
        setDeal({
          ...deal,
          [property]: newData,
        })
      }
    }
  }

  return {
    createAction,
    deal,
    // TODO We're exporting this because we need to ensure that wrapping
    // `createAction` in a `useCallback` will re-generate the action function if
    // the queue is changed. Is there a better/easier way to do that?
    // Could I bind or curry useCallback somehow? Like:
    // useUpdateCallback: cb => React.useCallback(cb, [queue])
    queue,
  }
}
// This implementation only allows queuing saves to a single entity (ie. a
// deal). If we ever need the ability to save to multiple entities (ex. batching
// edits to both a deal and an artist at the same time), we will need to change
// this implementation. Here's how I think we could do it:
//
// `ReplayableAction` API would change to:
//
//     new ReplayableAction(
//       // The type of object being edited. This should be a type from the
//       // schema so we can decide how to save it.
//       'deal',
//       // The id of the object being edited.
//       dealRef.id,
//       // The type of the property being edited on that object. Need this so
//       // we know how to merge the existing and new data together. Must be one
//       // of object, array, property.
//       'object',
//       // The name of the property being edited.
//       'artist',
//       // The data to set
//       newData,
//       // true if we are deleting/clearing that property
//       false,
//       // A function to get the current state of that property. This allows us
//       // to merge the existing known data with the new data so we don't lose
//       // any data from the server. In most cases a ref should be used to avoid re-renders.
//       () => dealRef.current,
//       // A function to find the item being edited if the property is an array.
//       // Can be null for 'object' or 'property' property types.
//       (a,b) => boolean,
//     )
//
// If we assume that batch saving is taken care of for us by the Apollo Client
// batch request plugin, then we could simplify this further by:
//
// - Move the `onSave` handler from an ActionQueue parameter into a
//   ReplayableAction parameter. This way we don't need a giant switch case in
//   the GraphQL service that handles every type of object that can be saved.
//   Instead, the save logic is moved to the point where the actions are
//   configured. It would also mean we don't have to worry about changes to
//   `onSave` causing the ActionQueue to be recreated.
//
// - We could wrap the `useDealBatchUpdate.creatAction` function into a closure or hook that
//   provides the ref used to get the most recent state of an object. That way
//   we won't forget to implement that. We could also wrap `createAction` to use
//   React.useCallback so the implementers don't need to remember that step
//   either.

