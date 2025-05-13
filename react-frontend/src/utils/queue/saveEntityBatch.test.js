import { waitFor, resolveLater, rejectLater } from '~/test';

import { ActionQueue } from './ActionQueue';
import { ReplayableAction } from './ReplayableAction';
import { saveEntityBatch } from './saveEntityBatch';

describe('utils/queue', () => {
  describe('saveEntityBatch', () => {
    let deal, queue, handleSave, onError, saveToDB, onComplete;
    let a1, a2, r1, r2, rowId1, rowId2, dbId1, dbId2;
    let findItem;

    const error = 'no darn good';

    const TIMEOUT = 20;

    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    beforeEach(() => {
      deal = {
        id: 'deal-id-202831',
        tickets: [],
      };

      saveToDB = jest.fn();
      onError = jest.fn();
      onComplete = jest.fn();
      findItem = jest.fn((a, b) => a.__rowId === b.__rowId || a.id === b.id);

      rowId1 = 'row-1'
      dbId1 = 'db-item-1';
      rowId2 = 'row-2';
      dbId2 = 'db-item-2';

      handleSave = jest.fn((batch) => {
        return saveEntityBatch(deal, batch, saveToDB, onComplete)
      });

      queue = new ActionQueue(handleSave, onError, TIMEOUT);
    });

    describe('non-object property', () => {
      describe('setting a new property', () => {
        beforeEach(() => {
          const data = '2022-01-01';

          a1 = new ReplayableAction('property', 'date', data, false);
          r1 = data;

          queue.add('date', a1);
        });

        it('should set the property locally if the request succeeds.', async () => {
          saveToDB.mockImplementationOnce(
            () => resolveLater([{result: r1, action: a1}], TIMEOUT)
          );

          jest.runAllTimers();

          await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

          expect(deal.date).toEqual(r1);

          expect(onComplete).toHaveBeenCalledWith(deal);

          expect(onError).not.toHaveBeenCalled();
        });

        it('should not set the property locally if the request fails.', async () => {
          saveToDB.mockImplementationOnce(() => rejectLater(error, TIMEOUT));

          jest.runAllTimers();

          await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

          expect(onError).toHaveBeenCalledTimes(1);
          expect(onError).toHaveBeenCalledWith([a1], error);

          expect(deal.date).toBeFalsy();

          expect(onComplete).not.toHaveBeenCalled();
        });

        describe('before the request completes successfully', () => {
          beforeEach(() => {
            saveToDB.mockImplementationOnce(
              () => resolveLater([{result: r1, action: a1}], TIMEOUT)
            );

            jest.runAllTimers();
          });

          describe('a second edit is made', () => {
            beforeEach(() => {
              const data = '1979-08-01';

              a2 = new ReplayableAction('property', 'date', data, false);
              r2 = data;

              queue.add('date', a2);
            });

            it('should set the final state if all requests succeed.', async () => {
              saveToDB.mockImplementationOnce(
                () => resolveLater([{result: r2, action: a2}], TIMEOUT)
              );

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a2]);

              expect(deal.date).toEqual('1979-08-01');
              expect(onComplete).toHaveBeenCalledWith(deal);

              expect(onError).not.toHaveBeenCalled();
            });

            it('should keep the first state if the second request fails.', async () => {
              onComplete.mockClear();
              saveToDB.mockImplementationOnce(() => rejectLater(error, TIMEOUT));

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a2]);

              expect(onError).toHaveBeenCalledTimes(1);
              expect(onError).toHaveBeenCalledWith([a2], error);

              expect(deal.date).toEqual('2022-01-01');
              expect(onComplete).not.toHaveBeenCalled();
            });
          });

          describe('and the property is deleted', () => {
            beforeEach(() => {
              const data = '2022-01-01';

              a2 = new ReplayableAction('property', 'date', data, true);
              r2 = data;

              queue.add('date', a2);
            });

            it('should set the final state if all requests succeed.', async () => {
              saveToDB.mockImplementationOnce(
                () => resolveLater([{result: r2, action: a2}], TIMEOUT)
              );

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a2]);

              expect(deal.date).toBeNull();
              expect(onComplete).toHaveBeenCalledWith(deal);

              expect(onError).not.toHaveBeenCalled();
            });

            it('should keep the first state if the second request fails.', async () => {
              onComplete.mockClear();
              saveToDB.mockImplementationOnce(() => rejectLater(error, TIMEOUT));

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a2]);

              expect(onError).toHaveBeenCalledTimes(1);
              expect(onError).toHaveBeenCalledWith([a2], error);

              expect(deal.date).toEqual('2022-01-01');
              expect(onComplete).not.toHaveBeenCalled();
            });
          });
        });

        describe('before the request fails', () => {
          beforeEach(() => {
            saveToDB.mockImplementationOnce(() => rejectLater(error, TIMEOUT));

            jest.advanceTimersByTime(TIMEOUT);
          });

          describe('and a second edit is made', () => {
            beforeEach(() => {
              const data = '1979-08-01';

              a2 = new ReplayableAction('property', 'date', data, false);
              r2 = data;

              queue.add('date', a2);
            });

            it('should set the second edit state if the second request succeeds.', async () => {
              saveToDB.mockImplementationOnce(
                () => resolveLater([{result: r2, action: a2}], TIMEOUT)
              );

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

              queue.flush();
              jest.runAllTimers();
              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a2]);

              expect(deal.date).toEqual('1979-08-01');
              expect(onComplete).toHaveBeenCalledWith(deal);

              expect(onError).toHaveBeenCalledTimes(1);
              expect(onError).toHaveBeenCalledWith([a1], error);
            });

            it('should leave the property empty if the second request fails.', async () => {
              saveToDB.mockImplementationOnce(() => rejectLater(error, TIMEOUT));

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

              queue.flush();
              jest.runAllTimers();
              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a2]);

              expect(onError).toHaveBeenCalledTimes(2);
              expect(onError).toHaveBeenCalledWith([a1], error);
              expect(onError).toHaveBeenCalledWith([a2], error);

              expect(deal.date).toBeFalsy();
              expect(onComplete).not.toHaveBeenCalled();
            });
          });

          describe('and the property is deleted', () => {
            beforeEach(() => {
              const data = '2022-01-01';

              a2 = new ReplayableAction('property', 'date', data, true);
              r2 = data;

              queue.add('date', a2);
            });

            it('should make a second request to delete the property.', async () => {
              saveToDB.mockImplementationOnce(
                () => resolveLater([{result: r2, action: a2}], TIMEOUT)
              );

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

              queue.flush();
              jest.runAllTimers();
              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a2]);

              expect(deal.date).toBeFalsy();
              expect(onComplete).toHaveBeenCalledTimes(1);

              expect(onError).toHaveBeenCalledTimes(1);
              expect(onError).toHaveBeenCalledWith([a1], error);
            });
          });
        });
      });

      describe('updating an existing property', () => {
        beforeEach(() => {
          deal.date = '2019-08-01';
          const data = '2022-01-01';

          a1 = new ReplayableAction('property', 'date', data, false);
          r1 = data;

          queue.add('date', a1);
        });

        it('should set the property locally if the request succeeds.', async () => {
          saveToDB.mockImplementationOnce(
            () => resolveLater([{result: r1, action: a1}], TIMEOUT)
          );

          jest.runAllTimers();

          await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

          expect(deal.date).toEqual('2022-01-01');
          expect(onComplete).toHaveBeenCalledWith(deal);

          expect(onError).not.toHaveBeenCalled();
        });

        it('should not set the property locally if the request fails.', async () => {
          saveToDB.mockImplementationOnce(() => rejectLater(error, TIMEOUT));

          jest.runAllTimers();

          await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

          expect(onError).toHaveBeenCalledTimes(1);
          expect(onError).toHaveBeenCalledWith([a1], error);

          expect(deal.date).toEqual('2019-08-01');
          expect(onComplete).not.toHaveBeenCalled();
        });
      });

      describe('deleting an existing property', () => {
        beforeEach(() => {
          deal.date = '2019-08-01';
          const data = deal.date;

          a1 = new ReplayableAction('property', 'date', data, true);
          r1 = data;

          queue.add('date', a1);
        });

        it('should set the property locally if the request succeeds.', async () => {
          saveToDB.mockImplementationOnce(
            () => resolveLater([{result: r1, action: a1}], TIMEOUT)
          );

          jest.runAllTimers();

          await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

          expect(deal.date).toBeNull();
          expect(onComplete).toHaveBeenCalledWith(deal);

          expect(onError).not.toHaveBeenCalled();
        });

        it('should not set the property locally if the request fails.', async () => {
          saveToDB.mockImplementationOnce(() => rejectLater(error, TIMEOUT));

          jest.runAllTimers();

          await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

          expect(onError).toHaveBeenCalledTimes(1);
          expect(onError).toHaveBeenCalledWith([a1], error);

          expect(deal.date).toEqual('2019-08-01');
          expect(onComplete).not.toHaveBeenCalled();
        });
      });
    });

    describe('object relationship', () => {
      describe('inserting a new item', () => {
        beforeEach(() => {
          const data = {name: 'Foo Fighters'};

          a1 = new ReplayableAction('object', 'artist', data, false);
          r1 = {...data, id: dbId1};

          queue.add('artist', a1);
        });

        it('sets the data on success.', async () => {
          saveToDB.mockImplementationOnce(
            () => resolveLater([{result: r1, action: a1}], TIMEOUT)
          );

          jest.runAllTimers();

          await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

          expect(deal.artist).toEqual(r1);
          expect(onComplete).toHaveBeenCalledWith(deal);

          expect(onError).not.toHaveBeenCalled();
        });

        it('does not set the item on failure.', async () => {
          saveToDB.mockImplementationOnce(() => rejectLater(error, TIMEOUT));

          jest.runAllTimers();

          await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

          expect(onError).toHaveBeenCalledTimes(1);
          expect(onError).toHaveBeenCalledWith([a1], error);

          expect(deal.artist).toBeFalsy();
          expect(onComplete).not.toHaveBeenCalled();
        });

        describe('before the insert fails', () => {
          beforeEach(() => {
            saveToDB.mockImplementationOnce(() => rejectLater(error, TIMEOUT));

            // Advance to the point that the queue makes the first request.
            jest.advanceTimersByTime(TIMEOUT);
          });

          describe('and an edit is queued', () => {
            beforeEach(() => {
              const data = {name: 'Foo Fighters', hits: 30};

              a2 = new ReplayableAction('object', 'artist', data, false);
              r2 = {...data, id: dbId1};

              queue.add('artist', a2);
            });

            it('should insert the edit on success.', async () => {
              saveToDB.mockReturnValueOnce(resolveLater([{result: r2, action: a2}], TIMEOUT));

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

              queue.flush();
              jest.runAllTimers();
              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

              expect(onError).toHaveBeenCalledTimes(1);
              expect(onError).toHaveBeenCalledWith([a1], error);

              // This should not include the hits that we tried to save.
              expect(deal.artist).toEqual({
                id: dbId1,
                name: 'Foo Fighters',
                hits: 30,
              });
              expect(onComplete).toHaveBeenCalledWith(deal);
            });

            it('should leave the property unset if both fail.', async () => {
              saveToDB.mockImplementationOnce(() => rejectLater(error, TIMEOUT));

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

              queue.flush();
              jest.runAllTimers();
              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

              expect(onError).toHaveBeenCalledTimes(2);
              expect(onError).toHaveBeenCalledWith([a1], error);
              expect(onError).toHaveBeenCalledWith([a2], error);

              expect(deal.artist).toBeFalsy();
              expect(onComplete).not.toHaveBeenCalled();
            });
          });
        });

        describe('before the insert completes successfully', () => {
          beforeEach(() => {
            saveToDB.mockImplementationOnce(
              () => resolveLater([{result: r1, action: a1}], TIMEOUT)
            );

            // Advance to the point that the queue makes the first request.
            jest.advanceTimersByTime(TIMEOUT);
          });

          describe('and an update is queued', () => {
            beforeEach(() => {
              // This will not include the DB id.
              const data2 = {name: 'Foo Fighters', hits: 30};

              a2 = new ReplayableAction('object', 'artist', data2, false);
              r2 = {...data2, id: dbId1};

              queue.add('artist', a2);
            });

            it('should update the item locally if the udpate succeeds.', async () => {
              saveToDB.mockImplementationOnce(
                () => resolveLater([{result: r2, action: a2}], TIMEOUT)
              );

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(
                deal,
                // Result 1 id gets merged in
                [new ReplayableAction(a2.type, a2.property, r2, a2.remove, a2.compare)]
              );

              expect(deal.artist).toEqual(r2);
              expect(onComplete).toHaveBeenCalledWith(deal);

              expect(onError).not.toHaveBeenCalled();
            });

            it('should not update the item locally if the update fails.', async () => {
              saveToDB.mockImplementationOnce(() => rejectLater(error, TIMEOUT));

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(
                deal,
                // Result 1 id gets merged in
                [new ReplayableAction(a2.type, a2.property, r2, a2.remove, a2.compare)]
              );

              expect(onError).toHaveBeenCalledTimes(1);
              expect(onError).toHaveBeenCalledWith([a2], error);

              expect(deal.artist).toEqual(r1);
              // Should only execute the onComplete callback for the first
              // successful request.
              expect(onComplete).toHaveBeenCalledTimes(1);
              expect(onComplete).toHaveBeenCalledWith(deal);
            });
          });

          describe('and a delete is queued', () => {
            beforeEach(() => {
              // This will not include the DB id.
              const data2 = {name: 'Foo Fighters'};

              a2 = new ReplayableAction('object', 'artist', data2, true);
              r2 = {...data2, id: dbId1};

              queue.add('artist', a2);
            });

            it('should delete the item locally if the delete succeeds.', async () => {
              saveToDB.mockImplementationOnce(
                () => resolveLater([{result: r2, action: a2}], TIMEOUT)
              );

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(
                deal,
                // Result 1 id gets merged in
                [new ReplayableAction(a2.type, a2.property, r2, a2.remove, a2.compare)]
              );

              expect(deal.artist).toBeFalsy();
              expect(onComplete).toHaveBeenCalledWith(deal);

              expect(onError).not.toHaveBeenCalled();
            });

            it('should not delete the item locally if the delete fails.', async () => {
              saveToDB.mockImplementationOnce(() => rejectLater(error, TIMEOUT));

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(
                deal,
                // Result 1 id gets merged in
                [new ReplayableAction(a2.type, a2.property, r2, a2.remove, a2.compare)]
              );

              expect(onError).toHaveBeenCalledTimes(1);
              expect(onError).toHaveBeenCalledWith([a2], error);

              expect(deal.artist).toEqual(r1);
              // Should only call onComplete for the first successful request
              expect(onComplete).toHaveBeenCalledTimes(1);
              expect(onComplete).toHaveBeenCalledWith(deal);
            });
          });
        });
      });

      describe('editing an existing item', () => {
        beforeEach(() => {
          deal.artist = {id: dbId1, name: 'Foo Fighters'};
          const data = {...deal.artist, hits: 30};

          a1 = new ReplayableAction('object', 'artist', data, false);
          r1 = {...data, id: dbId1};

          queue.add('artist', a1);
        });

        it('updates the item on success.', async () => {
          saveToDB.mockImplementationOnce(
            () => resolveLater([{result: r1, action: a1}], TIMEOUT)
          );

          jest.runAllTimers();

          await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

          expect(deal.artist).toEqual(r1);
          expect(onComplete).toHaveBeenCalledWith(deal);

          expect(onError).not.toHaveBeenCalled();
        });

        it('does not update the item on failure.', async () => {
          saveToDB.mockImplementationOnce(
            () => rejectLater(error, TIMEOUT)
          );

          jest.runAllTimers();

          await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

          expect(onError).toHaveBeenCalledTimes(1);
          expect(onError).toHaveBeenCalledWith([a1], error);

          // This should not include the hits that we tried to save.
          expect(deal.artist).toEqual({
            id: dbId1,
            name: 'Foo Fighters',
          });
          expect(onComplete).not.toHaveBeenCalled();
        });
      });

      describe('deleting an existing item', () => {
        beforeEach(() => {
          deal.artist = {id: dbId1, name: 'Foo Fighters'};
          const data = {...deal.artist, hits: 30};

          a1 = new ReplayableAction('object', 'artist', data, true);
          r1 = {...data, id: dbId1};

          queue.add('artist', a1);
        });

        it('removes the item on success.', async () => {
          saveToDB.mockImplementationOnce(
            () => resolveLater([{result: r1, action: a1}], TIMEOUT)
          );

          jest.runAllTimers();

          await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

          expect(deal.artist).toBeFalsy();
          expect(onComplete).toHaveBeenCalledWith(deal);

          expect(onError).not.toHaveBeenCalled();
        });

        xit('does not remove the item on failure.', () => {});
      });
    });

    describe('array relationships', () => {
      describe('inserting multiple items', () => {
        beforeEach(() => {
          const data1 = {type: 'GA', __rowId: rowId1};

          a1 = new ReplayableAction('array', 'tickets', data1, false, findItem);
          r1 = {...data1, id: dbId1};

          // This will not include the DB id.
          const data2 = {type: 'VIP', capacity: 10, __rowId: rowId2};

          // The update is still associated for the first row.
          a2 = new ReplayableAction('array', 'tickets', data2, false, findItem);
          r2 = {...data2, id: dbId2};

          queue.add(`tickets:${rowId1}`, a1);
          queue.add(`tickets:${rowId2}`, a2);
        });

        it('should insert both items if the request succeeds.', async () => {
          saveToDB.mockReturnValue(Promise.resolve([
            {result: r1, action: a1},
            {result: r2, action: a2}
          ]));

          expect(handleSave).not.toHaveBeenCalled();

          jest.runAllTimers();

          await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1, a2]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1, a2]);

          expect(deal.tickets.length).toEqual(2);
          // The row id will be merged in so we can find this row again even if
          // the DB request hasn't completed yet.
          expect(deal.tickets).toEqual([
            {...r1, __rowId: rowId1},
            {...r2, __rowId: rowId2}
          ]);
          expect(onComplete).toHaveBeenCalledTimes(1);
          expect(onComplete).toHaveBeenCalledWith(deal);
        });

        xit('should not insert either item if the request fails.', () => {});
      });

      describe('inserting a new item', () => {
        beforeEach(() => {
          const data = {type: 'GA', __rowId: rowId1};

          a1 = new ReplayableAction('array', 'tickets', data, false, findItem);
          r1 = {...data, id: dbId1};

          queue.add(`tickets:${rowId1}`, a1);
        });

        it('sets the local data on success.', async () => {
          saveToDB.mockReturnValueOnce(
            resolveLater([{result: r1, action: a1}], TIMEOUT)
          );

          jest.runAllTimers();

          await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

          expect(deal.tickets.length).toEqual(1);
          // The row id will be merged in so we can find this row again even if
          // the DB request hasn't completed yet.
          expect(deal.tickets).toEqual([{...r1, __rowId: rowId1}]);
          expect(onComplete).toHaveBeenCalledTimes(1);
          expect(onComplete).toHaveBeenCalledWith(deal);

          expect(onError).not.toHaveBeenCalled();
        });

        it('does not set the local data on failure.', async () => {
          saveToDB.mockImplementationOnce(
            () => rejectLater(error, TIMEOUT)
          );

          jest.runAllTimers();

          await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

          expect(deal.tickets.length).toEqual(0);
          expect(onComplete).not.toHaveBeenCalled();

          expect(onError).toHaveBeenCalledTimes(1);
          expect(onError).toHaveBeenCalledWith([a1], error);
        });

        describe('before the API request is made', () => {
          beforeEach(() => {
            // Delete the row currently being inserted.
            a2 = new ReplayableAction('array', 'tickets', a1.data, true, findItem);
            r2 = r1;

            queue.add(`tickets:${rowId1}`, a1);
          });

          it('should not make any API requests.', async () => {
            saveToDB.mockReturnValueOnce(resolveLater([{result: r2, action: a2}], TIMEOUT));

            queue.add(`tickets:${rowId1}`, a2);

            jest.runAllTimers();

            await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

            expect(handleSave).toHaveBeenCalledWith([a2]);

            expect(saveToDB).not.toHaveBeenCalled();

            expect(deal.tickets.length).toEqual(0);
            expect(onComplete).not.toHaveBeenCalled();
          });

          describe('and a second insert is queued', () => {
            beforeEach(() => {
              // This will not include the DB id.
              const data = {type: 'VIP', capacity: 10, __rowId: rowId2};

              // Insert a new item.
              a2 = new ReplayableAction('array', 'tickets', data, false, findItem);

              queue.add(`tickets:${rowId2}`, a2);
            });

            describe('and the insert completes successfully', () => {
              xit('should store both items locally.', () => {});
            });
            describe('and the insert fails', () => {
              xit('should not store either item locally.', () => {});
            });

            describe('and the new insert is immediately deleted', () => {
              let a3;

              beforeEach(() => {
                // And then remove that item.
                a3 = new ReplayableAction('array', 'tickets', a2.data, true, findItem);

                queue.add(`tickets:${rowId2}`, a3);
              });

              it('should not include the second insert in the request that gets made.', async () => {
                saveToDB.mockReturnValueOnce(resolveLater([{result: r1, action: a1}], TIMEOUT));

                jest.runAllTimers();

                await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

                expect(handleSave).toHaveBeenCalledWith([a1, a3]);

                expect(saveToDB).toHaveBeenCalledTimes(1);
                // The second insert should be filtered out of the request.
                expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

                expect(deal.tickets.length).toEqual(1);
                // The row id will be merged in so we can find this row again even if
                // the DB request hasn't completed yet.
                expect(deal.tickets).toEqual([
                  {...r1, __rowId: rowId1},
                ]);
                expect(onComplete).toHaveBeenCalledTimes(1);
                expect(onComplete).toHaveBeenCalledWith(deal);
              });
            });
          });
        });

        describe('before the insert completes successfully', () => {
          beforeEach(() => {
            saveToDB.mockImplementationOnce(
              () => resolveLater([{result: r1, action: a1}], TIMEOUT)
            );

            queue.add(`tickets:${rowId1}`, a1);

            jest.advanceTimersByTime(TIMEOUT);
          });

          describe('and an edit is queued', () => {
            beforeEach(() => {
              // This will not include the DB id.
              const data = {type: 'GA', capacity: 100, __rowId: rowId1};

              // The update is still associated for the first row.
              a2 = new ReplayableAction('array', 'tickets', data, false, findItem);
              r2 = {...data, id: dbId1};

              queue.add(`tickets:${rowId1}`, a2);
            });

            it('should update the item locally if the update succeeds.', async () => {
              saveToDB.mockImplementationOnce(
                () => resolveLater([{result: r2, action: a2}], TIMEOUT)
              );

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(deal, [
                new ReplayableAction(a2.type, a2.property, r2, a2.remove, a2.compare)
              ]);

              // It should only add one ticket but it should be the most recent
              // update to the ticket.
              expect(deal.tickets.length).toEqual(1);
              // The row id will be merged in so we can find this row again even if
              // the DB request hasn't completed yet.
              expect(deal.tickets).toEqual([{...r2, __rowId: rowId1}]);
              expect(onComplete).toHaveBeenCalledTimes(2);
              expect(onComplete).toHaveBeenCalledWith(deal);
            });

            it('should not update the item locally if the update fails.', async () => {
              saveToDB.mockImplementationOnce(
                () => rejectLater(error, TIMEOUT)
              );

              queue.add(`tickets:${rowId1}`, a2);

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              const dbAction = new ReplayableAction(
                a2.type,
                a2.property,
                // The previous results should be merged in so we update the
                // existing row.
                {...a2.data, __rowId: rowId1, id: dbId1},
                a2.remove,
                findItem
              );
              expect(saveToDB).toHaveBeenCalledWith(deal, [dbAction]);

              expect(deal.tickets.length).toEqual(1);
              // The deal retain the previous DB state.
              expect(deal.tickets).toEqual([{...r1, __rowId: rowId1}]);
              expect(onComplete).toHaveBeenCalledTimes(1);
              expect(onComplete).toHaveBeenCalledWith(deal);

              expect(onError).toHaveBeenCalledTimes(1);
              expect(onError).toHaveBeenCalledWith([a2], error);
            });
          });

          describe('and a different insert is queued', () => {
            beforeEach(() => {
              // This will not include the DB id.
              const data = {type: 'VIP', capacity: 10, __rowId: rowId2};

              // The update is still associated for the first row.
              a2 = new ReplayableAction('array', 'tickets', data, false, findItem);
              r2 = {...data, id: dbId2};

              queue.add(`tickets:${rowId2}`, a2);
            });

            it('should insert both items locally if the second insert succeeds.', async () => {
              saveToDB.mockImplementationOnce(
                () => resolveLater([{result: r2, action: a2}], TIMEOUT)
              );

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a2]);

              expect(deal.tickets.length).toEqual(2);
              // The row id will be merged in so we can find this row again even if
              // the DB request hasn't completed yet.
              expect(deal.tickets).toEqual([
                {...r1, __rowId: rowId1},
                {...r2, __rowId: rowId2},
              ]);
              expect(onComplete).toHaveBeenCalledTimes(2);
              expect(onComplete).toHaveBeenCalledWith(deal);
            });

            it('should only insert the first item if the second insert fails.', async () => {
              saveToDB.mockImplementationOnce(
                () => rejectLater(error, TIMEOUT)
              );

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a2]);

              expect(onError).toHaveBeenCalledTimes(1);
              expect(onError).toHaveBeenCalledWith([a2], error);

              expect(deal.tickets.length).toEqual(1);
              // The row id will be merged in so we can find this row again even if
              // the DB request hasn't completed yet.
              expect(deal.tickets).toEqual([
                {...r1, __rowId: rowId1},
              ]);
              expect(onComplete).toHaveBeenCalledTimes(1);
              expect(onComplete).toHaveBeenCalledWith(deal);
            });
          });

          describe('and a delete is queued for the item', () => {
            beforeEach(() => {
              // Delete the row currently being inserted.
              a2 = new ReplayableAction('array', 'tickets', a1.data, true, findItem);
              r2 = r1;

              queue.add(`tickets:${rowId1}`, a2);
            });

            it('should delete the item locally if the delete succeeds.', async () => {
              saveToDB.mockReturnValueOnce(resolveLater([{result: r2, action: a2}], TIMEOUT));

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(deal, [
                new ReplayableAction(a2.type, a2.property, r2, a2.remove, findItem)
              ]);

              expect(deal.tickets.length).toEqual(0);
              expect(onComplete).toHaveBeenCalledTimes(2);
              expect(onComplete).toHaveBeenCalledWith(deal);

              expect(onError).not.toHaveBeenCalled();
            });

            it('should not delete the item locally if the delete fails.', async () => {
              saveToDB.mockImplementationOnce(
                () => rejectLater(error, TIMEOUT)
              );

              jest.runAllTimers();

              await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

              expect(handleSave).toHaveBeenCalledWith([a1]);
              expect(handleSave).toHaveBeenCalledWith([a2]);

              expect(saveToDB).toHaveBeenCalledTimes(2);
              expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);
              expect(saveToDB).toHaveBeenCalledWith(deal, [
                new ReplayableAction(a2.type, a2.property, r2, a2.remove, findItem)
              ]);

              expect(onError).toHaveBeenCalledTimes(1);
              expect(onError).toHaveBeenCalledWith([a2], error);

              expect(deal.tickets.length).toEqual(1);
              // The row id will be merged in so we can find this row again even if
              // the DB request hasn't completed yet.
              expect(deal.tickets).toEqual([
                {...r1, __rowId: rowId1},
              ]);
              expect(onComplete).toHaveBeenCalledTimes(1);
              expect(onComplete).toHaveBeenCalledWith(deal);
            });
          });
        });

        describe('before the insert fails', () => {
          describe('and an edit is queued', () => {
            xit('should insert the edit on success.', () => {});
            xit('should not update the local data on failure.', () => {});
          });
        });

        describe('after the insert succeeds', () => {
          beforeEach(async () => {
            saveToDB.mockReturnValueOnce(
              resolveLater([{result: r1, action: a1}], TIMEOUT)
            );

            queue.add(`tickets:${rowId1}`, a1);

            jest.runAllTimers();

            await waitFor(() => expect(deal.tickets.length).toEqual(1));

            // This will not include the DB id.
            const data = {type: 'GA', capacity: 100, __rowId: rowId1};

            // The update is still associated for the first row.
            a2 = new ReplayableAction('array', 'tickets', data, false, findItem);
            r2 = {...data, id: dbId1};
          });

          it('editing that item should update the local data if the request succeeds.', async () => {
            saveToDB.mockReturnValueOnce(resolveLater([{result: r2, action: a2}], TIMEOUT));

            queue.add(`tickets:${rowId1}`, a2);

            jest.runAllTimers();

            await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

            expect(handleSave).toHaveBeenCalledWith([a1]);
            expect(handleSave).toHaveBeenCalledWith([a2]);

            expect(saveToDB).toHaveBeenCalledTimes(2);
            const dbAction = new ReplayableAction(
              a2.type,
              a2.property,
              // The previous results should be merged in so we update the
              // existing row.
              {...a2.data, __rowId: rowId1, id: dbId1},
              a2.remove,
              findItem
            );
            expect(saveToDB).toHaveBeenCalledWith(deal, [dbAction]);

            expect(deal.tickets.length).toEqual(1);
            // The row id will be merged in so we can find this row again even if
            // the DB request hasn't completed yet.
            expect(deal.tickets).toEqual([{...r2, __rowId: rowId1}]);
            expect(onComplete).toHaveBeenCalledTimes(2);
            expect(onComplete).toHaveBeenCalledWith(deal);
          });

          it('editing the item should keep the previous data if the request fails.', async () => {
            saveToDB.mockImplementationOnce(
              () => rejectLater(error, TIMEOUT)
            );

            queue.add(`tickets:${rowId1}`, a2);

            jest.runAllTimers();

            await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));

            expect(handleSave).toHaveBeenCalledWith([a1]);
            expect(handleSave).toHaveBeenCalledWith([a2]);

            expect(saveToDB).toHaveBeenCalledTimes(2);
            const dbAction = new ReplayableAction(
              a2.type,
              a2.property,
              // The previous results should be merged in so we update the
              // existing row.
              {...a2.data, __rowId: rowId1, id: dbId1},
              a2.remove,
              findItem
            );
            expect(saveToDB).toHaveBeenCalledWith(deal, [dbAction]);

            // The deal tickets should not be modified.
            expect(deal.tickets.length).toEqual(1);
            // The row id will be merged in so we can find this row again even if
            // the DB request hasn't completed yet.
            expect(deal.tickets).toEqual([{...r1, __rowId: rowId1}]);
            expect(onComplete).toHaveBeenCalledTimes(1);
            expect(onComplete).toHaveBeenCalledWith(deal);

            expect(onError).toHaveBeenCalledTimes(1);
            expect(onError).toHaveBeenCalledWith([a2], error);
          });
        });
      });

      describe('editing an existing item', () => {
        beforeEach(() => {
          // This represents the data in the DB and thus does not have a __rowId.
          deal.tickets = [{type: 'GA', id: dbId1}];
          const data = {...deal.tickets[0], capacity: 10, __rowId: rowId1};

          a1 = new ReplayableAction('array', 'tickets', data, false, findItem);
          r1 = data;

          queue.add(`tickets:${rowId1}`, a1);
        });

        it('sets the local data on success.', async () => {
          saveToDB.mockReturnValueOnce(resolveLater([{result: r1, action: a1}], TIMEOUT));

          jest.runAllTimers();

          await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

          expect(deal.tickets.length).toEqual(1);
          // The row id will be merged in so we can find this row again even if
          // the DB request hasn't completed yet.
          expect(deal.tickets).toEqual([
            {...r1, __rowId: rowId1},
          ]);
          expect(onComplete).toHaveBeenCalledTimes(1);
          expect(onComplete).toHaveBeenCalledWith(deal);

          expect(onError).not.toHaveBeenCalled();
        });

        it('does not set the local data on failure.', async () => {
          saveToDB.mockImplementationOnce(() => rejectLater(error, TIMEOUT));

          jest.runAllTimers();

          await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

          expect(onError).toHaveBeenCalledTimes(1);
          expect(onError).toHaveBeenCalledWith([a1], error);

          expect(deal.tickets.length).toEqual(1);
          // Should not include the rowId or the updates.
          expect(deal.tickets).toEqual([{type: 'GA', id: dbId1}]);
          expect(onComplete).not.toHaveBeenCalled();
        });

        describe('before the edit fails', () => {
          describe('and another edit is queued', () => {
            xit('should insert the second edit on success.', () => {});
            xit('should not update the local data on failure.', () => {});
          });
        });

        describe('before the edit completes successfully', () => {
          describe('and another edit is queued', () => {
            xit('should set both edits locally if the update succeeds.', () => {});
            xit('should not update the item locally if the update fails.', () => {});
          });

          describe('and a delete is queued', () => {
            xit('should delete the item locally if the delete succeeds.', () => {});
            xit('should not delete the item locally if the delete succeeds.', () => {});
          });
        });
      });

      describe('removing an existing item', () => {
        beforeEach(() => {
          // This represents the data in the DB and thus does not have a __rowId.
          deal.tickets = [{type: 'GA', id: dbId1}];
          const data = {...deal.tickets[0], __rowId: rowId1};

          a1 = new ReplayableAction('array', 'tickets', data, true, findItem);
          r1 = data;

          queue.add(`tickets:${rowId1}`, a1);
        });

        it('should remove the local item if the delete is successful.', async () => {
          saveToDB.mockReturnValue(resolveLater([{result: r1, action: a1}], TIMEOUT));

          jest.runAllTimers();

          await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

          expect(deal.tickets.length).toEqual(0);
          expect(onComplete).toHaveBeenCalledTimes(1);
          expect(onComplete).toHaveBeenCalledWith(deal);

          expect(onError).not.toHaveBeenCalled();
        });

        it('should not remove the item locally if the delete fails.', async () => {
          saveToDB.mockImplementationOnce(() => rejectLater(error, TIMEOUT));

          jest.runAllTimers();

          await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));

          expect(handleSave).toHaveBeenCalledWith([a1]);

          expect(saveToDB).toHaveBeenCalledTimes(1);
          expect(saveToDB).toHaveBeenCalledWith(deal, [a1]);

          expect(onError).toHaveBeenCalledTimes(1);
          expect(onError).toHaveBeenCalledWith([a1], error);

          expect(deal.tickets.length).toEqual(1);
          expect(onComplete).not.toHaveBeenCalled();
        });
      });
    });
  });
});
