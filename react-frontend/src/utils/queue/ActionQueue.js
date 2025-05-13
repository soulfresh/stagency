import debounce from 'lodash.debounce';
import { ServiceBase } from '@thesoulfresh/utils';

/**
 * `ActionQueue` allows you to save `ReplayableAction`
 * objects to an API. The queue will immediately save the
 * first action it receives and will queue any subsequent
 * actions that occur while the current save is running.
 * As soon as an existing save completes it will run any
 * new queued actions until there are none left.
 */
export class ActionQueue extends ServiceBase {
  /**
   * @param {(request: Map) => Promise<object>} onSave - A callback to receive
   *   `ReplayableAction` objects when it is time to
   *   save them.
   * @param {(request: Map, error: Error) => void} onError - A callback to receive
   *   all `ReplayableAction` objects that fail to save
   *   should an error occur during the save process.
   *   You can re-queue these same action later if needed.
   * @param {number} delay - Debounce saving in order to give users time to
   *   finish typing before trying to save data.
   * @param {boolean} debug - Allows debug output to help diagnose queue
   *   actions.
   */
  constructor(onSave, onError, delay=1000, debug = false) {
    super(null, debug);

    this.onSave = onSave;
    this.onError = onError;
    this.queue = new Map();
    this.request = null;
    this.locked = false;

    // Debounce the save method
    this.save = delay > 0
      ? debounce(this.saveImmediately.bind(this), delay)
      : this.saveImmediately.bind(this);
  }

  /**
   * Whether or not there are currently items
   * queued to be saved.
   */
  get queued() {
    // queue is a Map
    return !!this.queue?.size;
  }

  /**
   * Whether or not there is currently a save
   * in progress.
   */
  get saving() {
    // request is an array
    return !!(this.request && this.request.length > 0);
  }

  /**
   * Add an item to the action queue. If no request
   * is pending, then the action will be run immediately.
   * Otherwise, it will be run once the current request completes.
   * @param {*} id - A unique identifier for this action.
   *   Use this to update items that may already be in the
   *   queue.
   * @param {ReplayableAction | (b: any) => ReplayableAction} action - The action to peform
   *   or a function that returns the action to perform. The function will be
   *   called with the results of the previous batch. This can be useful in
   *   cases where the previous batch inserted a record in a data store and the
   *   record's id is needed for susequent updates to the record.
   */
  add(id, action) {
    if (!this.locked) {
      this.log('adding to queue', id, action)

      this.queue.set(id, action);

      // Check to see if there is a pending request. If no
      // request is pending, save the actions to the API. If
      // a request is currently happening, just keep the new
      // action in the queue and it will be saved once the current
      // request completes.
      if (!this.saving) {
        this.save();
      }
    } else {
      this.warn('tried to add items to the queue but it is locked.', action)
    }
  }

  /**
   * Unlock a queue that was previously locked by a `flush()` command.
   */
  unlock() {
    this.locked = false;
  }

  /**
   * Force the queue to save all pending actions immediately.
   *
   * @param {boolean} [lock] - Pass true to prevent any further actions from
   *   being added to the queue. If you need to unlock the queue again at a
   *   later time, you can use the `unlock()` method.
   *
   * @return {Promise<void>} Resolves once the queue is fully cleared. Rejects
   *   if there were any errors trying to save whatever was left in the queue.
   */
  flush(lock = false) {
    return new Promise((resolve, reject) => {
      this.locked = lock

      if (this.saving) {
        const onSuccess = () => {
          if (!this.queued) {
            this.removeEventListener('success', onSuccess)
            this.removeEventListener('error', onError)
            resolve()
          }
        }

        const onError = () => {
          if (!this.queued) {
            this.removeEventListener('success', onSuccess)
            this.removeEventListener('error', onError)
            reject()
          }
        }

        // Wait until the current and next actions are complete
        this.addEventListener('success', onSuccess)
        this.addEventListener('error', onError)
      }
      else if (this.queued) {
        // Cancel the current debounce
        this.save.cancel()

        // Flush the queue
        this.saveImmediately()
          .then(() => resolve())
          .catch(() => reject())
      }
      else {
        resolve()
      }
    })
  }

  /**
   * @private
   * This is called automatically as items are added or save
   * requests complete.
   * @param {any[]} previousResults - The results of the previous batch if
   *   the current save occurs immediately after a batch success.
   * @param {ReplayableAction[]} previousActions - The actions that were
   *   included in the previous batch.
   */
  async saveImmediately(previousResults = [], previousActions = []) {
    this.log('saveImmediately()', this.queue);

    // Convert any functions in the queue into ReplayableActions by calling them
    // with the previous batch.
    this.request = Array.from(this.queue, ([key, action]) => {
      if (typeof(action) === 'function') {
        try {
          return [key, action(previousResults, previousActions)];
        } catch(e) {
          this.error('Failed to convert action function to ReplayableAction:', e);
          return undefined;
        }
      } else {
        return [key, action];
      }
    }).filter(
      // Remove any items that failed to convert from functions to ReplayableActions.
      v => !!v
    ).map(([id, action]) => action);

    this.log('request to make ->', this.request);

    // Clear the queue
    this.queue.clear();

    if (this.request && this.request.length > 0) {
      try {
        this.log('saving...');
        const result = await this.onSave(this.request);
        this.log('save complete');

        const request = this.request;

        // Clear the request property to indicate there are
        // no active requests.
        this.request = null;

        this.emit('success', result);

        // If there are new items in the queue, kick off another save.
        if (this.queued) {
          this.log('start next batch', result, request)
          return this.saveImmediately(result, request);
        }
        else return result;
      } catch (e) {
        this.log('FAILURE', e);

        // Notify the UI of the request failure.
        if (this.onError) this.onError(this.request, e);

        // Clear the request property so we can try again later.
        this.request = null;

        this.emit('error', e);

        // NOTE I decided it would be better to force the outer code to add new
        // items or flush the queue when ready. Keeping this commented out in
        // case we decide to change that.
        // if (this.queued) return this.saveImmediately();
      }
    } else {
      // Resolve that there was nothing in the queue to act on.
      return undefined
    }
  }
}
