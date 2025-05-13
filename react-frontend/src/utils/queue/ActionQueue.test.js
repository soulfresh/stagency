import { waitFor } from '@testing-library/react';

import { ActionQueue } from './ActionQueue';
import { ReplayableAction } from './ReplayableAction';
import { mostRecentCall } from '~/test';

describe('utils/queue', () => {
  describe('ActionQueue', () => {
    let queue, onSave, onError, onDone, action, action2, action2Value, error, response, response2;
    let type = 'property';
    let property = 'dogCount';
    let property2 = 'catCount';

    beforeEach(() => {
      onSave = jest.fn();
      onError = jest.fn();
      onDone = jest.fn();

      const debug = false;
      queue = new ActionQueue(onSave, onError, 0, debug);
      action = new ReplayableAction(type, property, {}, false);
      action2Value = new ReplayableAction(type, property2, {}, false)
      action2 = jest.fn((...args) => {
        return action2Value
      });
      error = {};
      response = {};
      response2 = {};
    });

    describe('initially', () => {
      it('should not be saving.', () => {
        expect(queue.saving).toBe(false);
      });

      it('should not be queued.', () => {
        expect(queue.queued).toBe(false);
      });
    });

    describe('after a successful request', () => {
      beforeEach(() => {
        onSave.mockImplementation(() => Promise.resolve({}));
        queue.add(property, action);
      });

      it('should not be saving.', () => {
        expect(queue.saving).toBe(false);
      });

      it('should not be queued.', () => {
        expect(queue.queued).toBe(false);
      });

      describe('and then adding a new item and flushing/locking the queue', () => {
        beforeEach(() => {
          onSave.mockClear();
          onSave.mockReturnValue(new Promise(() => {}));

          queue.add(property2, action2);
          queue.flush(true).then(onDone);
        });

        it('should prevent new items from being added to the queue.', () => {
          expect(queue.locked).toBe(true);
          expect(queue.saving).toBe(true);

          jest.spyOn(queue, 'warn').mockImplementation(() => {/* swallow logs */});
          queue.add(property, action);
          expect(queue.queued).toBe(false);
          expect(queue.warn).toHaveBeenCalledTimes(1);
        });

        it('should be able to remove the lock.', () => {
          queue.unlock();
          queue.add(property2, action2);

          expect(queue.queued).toBe(true);
          // The existing save should still be running.
          expect(queue.saving).toBe(true);
        });
      });

      describe('and then flushing and locking the empty queue', () => {
        beforeEach(() => {
          onSave.mockClear();
          onSave.mockReturnValue(new Promise(() => {}));

          queue.flush(true).then(onDone);
        });

        it('should return immediately.', () => {
          expect(onSave).not.toHaveBeenCalled();
          expect(onDone).toHaveBeenCalledTimes(1);
        });
      });

      describe('and then flushing the queue unlocked', () => {
        beforeEach(() => {
          onSave.mockClear();
          onSave.mockReturnValue(new Promise(() => {}));

          queue.flush().then(onDone);
        });

        it('should be able to add new items to the queue while flushing.', () => {
          queue.add(property2, action2);
          expect(queue.saving).toBe(true);
        });
      });

      describe('and then flushing the queue unlocked and adding additional items', () => {
        beforeEach(() => {
          onSave.mockClear();

          queue.add(property, action);
          queue.flush().then(onDone);
          queue.add(property2, action2);
        });

        it('should be able to add new items to the queue while flushing.', async () => {
          await waitFor(() => expect(onDone).toHaveBeenCalledTimes(1));

          expect(queue.queued).toBe(false);
          expect(queue.saving).toBe(false);
          expect(onSave).toHaveBeenCalledTimes(2);
        });
      });
    });

    describe('after a failed request', () => {
      beforeEach(() => {
        onSave
          .mockImplementationOnce(() => Promise.reject(error))
          .mockImplementation(() => new Promise(() => {}));

        // This will save immediately
        queue.add(property, action);
      });

      it('should call the onError callback with the failed actions.', () => {
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(expect.any(Array), expect.anything());

        const params = mostRecentCall(onError);
        const requestList = params[0];
        expect(requestList.length).toEqual(1);
        expect(requestList).toEqual([action])
      });

      it('should not be saving.', () => {
        expect(queue.saving).toBe(false);
      });

      it('should not be queued.', () => {
        expect(queue.queued).toBe(false);
      });
    });

    describe('after adding an item', () => {
      let timeout;

      beforeEach(() => {
        onSave
          .mockImplementationOnce(() => new Promise((resolve, reject) => {
            timeout = setTimeout(() => resolve(response));
          }))
          .mockImplementation(() => new Promise(() => response2));

        // This will save immediately
        queue.add(property, action);
      });

      afterEach(() => {
        clearTimeout(timeout);
      })

      it('should be saving.', () => {
        expect(queue.saving).toBe(true);
      });

      it('should not be queued.', () => {
        expect(queue.queued).toBe(false);
      });

      it('should call the onSave callback.', () => {
        expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith(expect.any(Array));

        const params = mostRecentCall(onSave);
        const requestList = params[0];
        expect(requestList.length).toEqual(1);
        expect(requestList).toEqual([action]);
      });

      describe('and then adding a second item', () => {
        beforeEach(() => {
          // This will be queued
          queue.add(property2, action2);
        });

        it('should be saving.', () => {
          expect(queue.saving).toBe(true);
        });

        it('should be queued.', () => {
          expect(queue.queued).toBe(true);
        });

        it('should not call the onSave callback again.', () => {
          expect(onSave).toHaveBeenCalledTimes(1);

          const params = mostRecentCall(onSave);
          const requestList = params[0];
          expect(requestList.length).toEqual(1);
          expect(requestList).toEqual([action]);
        });

        describe('and then flushing and locking the queue', () => {
          xit('should wait for the current and next batches to complete', () => {});
          xit('should be able to lock the queue.', () => {});
        });
        describe('and then flushing the queue unlocked', () => {
          xit('should wait for all batches to save.', () => {});
        });

        describe('once the first request completes', () => {
          beforeEach(() => {
            return waitFor(() => {
              expect(onSave).toHaveBeenCalledTimes(2);
            });
          });

          it('should call the onSave callback with the queued actions.', () => {
            const params = mostRecentCall(onSave);
            const requestList = params[0];
            expect(requestList.length).toEqual(1);
            expect(requestList).toEqual([action2Value]);
          });

          it('should call any functions in the queue with the recently saved batch.', () => {
            expect(action2).toHaveBeenCalledTimes(1);
            expect(action2).toHaveBeenCalledWith(response, [action]);
          });

          it('should be saving.', () => {
            expect(queue.saving).toBe(true);
          });

          it('should not be queued.', () => {
            expect(queue.queued).toBe(false);
          });

          describe('and then flushing and locking the queue', () => {
            xit('should wait for the current request to complete.', () => {});
            xit('should be able to lock the queue.', () => {});
          });
          describe('and then flushing the queue unlocked', () => {
            xit('should be able to handle additional items added to the queue.', () => {});
          });
        });
      });
    });

    describe('after the first request fails', () => {
      let timeout;

      beforeEach(() => {
        onSave
          .mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
              timeout = setTimeout(() => reject(error));
            });
          })
          .mockImplementation(() => new Promise(() => {}));

        // This will save immediately
        queue.add(property, action);
        // This will be queued
        queue.add(property2, action2);
      });

      afterEach(() => {
        clearTimeout(timeout);
      })

      it('should only have called onSave once', () => {
        expect(onSave).toHaveBeenCalledTimes(1);
      });
    });
  });
});

