import { ReplayableAction } from './ReplayableAction';

function createLogger(debug) {
  return (...args) => {
    if (debug) {
      console.log(...args)
    }
  }
}

/**
 * @typedef {object} BatchActionResult
 * @property {object} result - The result from the DB
 * @property {ReplayableAction} action - The originating action.
 */
/**
 * Save a batch update to a target object.  This function ensures that any data
 * from the DB state gets persisted between batch requests (as long as you
 * provide the same target object with each call).
 *
 * @param {object} target - The current DB state being modified.
 * @param {ReplayableAction[]} batch - The list of updates to perform on the target.
 * @param {(dealId: number, actions: ReplayableAction[]) => Promise<BatchActionResult[]>} onSave - A function
 *   that will handle saving the provided actions to the DB and will return the
 *   saved results
 * @param {(value: object) => void} onComplete - A callback that will be called
 *   with the final state of the target object.
 * @param {boolean} debug - Enable verbose logging.
 */
export async function saveEntityBatch(target, batch, onSave, onComplete, debug = false) {
  const log = createLogger(debug);

  log('[utils/batch] saveEntityBatch()', batch)

  // Find the item modified by the action in a list.
  const findItem = (v, action) => (
    (action.compare && action.compare(v, action.data))
  );

  const findPrevious = (action) => {
    switch(action.type) {
      case 'array':
        return target[action.property].find(v => findItem(v, action));
      default:
        return target[action.property];
    }
  }

  // Merge in the previous known DB state so we don't lose the DB ids.
  const actionsToSave = batch.map(action => {
    const prev = findPrevious(action);

    // If the item wasn't cached previously, that means it hasn't been saved to
    // the DB. If we're deleting that item, then there's no need to send the
    // delete request.
    // TODO Turns out this is not the place to do this. This needs to happen
    // somewhere that has access to the previously saved batch IF this batch was
    // queued while the last batch was processing. The current solution makes it
    // difficult to handle optimistic updates of immutable data in the UI.
    if (
      !prev &&
      action.remove &&
      // TODO This is a bit of a hack and assumes all array properties are
      // displayed in AgGrid tables and thus treated as mutable data structures.
      // This will no longer work once we treat the table data as immutable at
      // which point we should find a different way to prevent deleting of table
      // rows that haven't been inserted in the DB yet.
      action.type === 'array'
    ) {
      log('[utils/batch] removing non-existant item.');
      return null;
    } else {
      let data = action.data;
      if (action.type === 'object' || action.type === 'array') {
        // Merge our updates on top of the DB state so we don't lose the
        // database id.  This is important in the situation that an insert is
        // ongoing while an update to the same item is added to the queue. Since
        // the insert hasn't completed, the item doesn't have a DB id at the
        // time that the update is queued. Since we know the DB id gets saved to
        // the local DB state as soon as the insert completes (and before the
        // current batch was executed), we can get the DB id from our local DB
        // state before performing the update to the DB (this code).
        data = {...prev, ...action.data};
        log('[utils/batch] merging previous:', prev, action.data, data);
      }
      // Create a new action with the updated data.
      return new ReplayableAction(action.type, action.property, data, action.remove, action.compare);
    }
  }).filter(v => !!v);

  log('[utils/batch] make request?', !!actionsToSave.length)
  if (actionsToSave.length) {
    log('[utils/batch] make request ->', actionsToSave);

    const results = await onSave(target, actionsToSave);

    if (results && results.length) {
      log('[utils/batch] Save completed, updating state:', results)

      // Update the local copy of the target object to reflect the latest know state
      // from the DB.
      results.forEach(({result, action}) => {
        const property = action.property;

        if (action.type === 'array') {
          const relationship = target[property];
          const prevIndex = relationship.findIndex(v => findItem(v, action));
          const prev = prevIndex > -1 ? relationship[prevIndex] : null;

          log('[utils/batch] updating the target with:', result)
          log('[utils/batch] target is currently:', target)
          if (!action.remove) {
            // Merge the new data from the DB on top of the previous DB data.
            const fullData = {
              // Ensure we get the id and anything else returned in the previous request.
              ...prev,
              // Ensure we get the __rowId so we can match up elements later if
              // they don't have the DB id.
              ...action.data,
              // Ensure we get the most recent data from the request.
              ...result
            };

            if (prevIndex > -1) {
              log('[utils/batch] update array item', property, fullData)
              // We mutate the data so we can maintain the data between
              // requests.
              // TODO Converting this to a hook or closure would allow us to
              // treat the target object as immutable.
              relationship[prevIndex] = fullData;
            } else {
              log('[utils/batch] add array item', property, fullData)
              relationship.push(fullData);
            }
          } else {
            log('[utils/batch] remove array item', property, prevIndex)
            relationship.splice(prevIndex, 1);
          }
        } else {
          if (action.remove) {
            log('[utils/batch] remove property', property)
            target[property] = null;
          } else {
            log('[utils/batch] update property', property, result);
            target[property] = result;
          }
        }
      });

      onComplete && onComplete(target);
    } else {
      log('[utils/batch] Batch save returned no results:', results);
    }
  }
}

