import { render, mostRecentCall, waitFor } from '~/test';
import { ActionQueue, ReplayableAction } from '~/utils';
import { useDealBatchUpdate } from './useDealBatchUpdate'

const Example = ({children, initialDeal, onSave, onError, timeout, debug}) => {
  const result = useDealBatchUpdate({initialDeal, onSave, onError, timeout, debug});
  children(result);
  return null;
}

describe('useDealBatchUpdate', () => {
  let children, initialDeal, onSave, onError;
  const debug = false;
  const timeout = 10;
  const dealId = 'deal-1';

  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  beforeEach(() => {
    initialDeal = {id: dealId};
    children = jest.fn();
    onSave = jest.fn();
    onError = jest.fn((e, m) => {
      console.log('ERROR', e, m)
    });
  });

  describe('after calling the hook', () => {
    beforeEach(() => {

      render(
        <Example
          initialDeal={initialDeal}
          onSave={onSave}
          onError={onError}
          timeout={timeout}
          debug={debug}
          children={children}
        />
      )
    });

    it('should return the expected API.', () => {
      expect(children).toHaveBeenCalledWith({
        deal: expect.any(Object),
        queue: expect.any(ActionQueue),
        createAction: expect.any(Function),
      });

      const args = mostRecentCall(children)[0];
      const queue = args.queue;
      expect(queue.queued).toBe(false);
      expect(queue.saving).toBe(false);
    });

    describe('and then creating an action factory', () => {
      let onTicketUpdate, ticket1Id, ticket1;

      beforeEach(() => {
        const hookArgs = mostRecentCall(children)[0];
        const createAction = hookArgs.createAction;
        const findPredicate = jest.fn();
        onTicketUpdate = createAction('array', 'tickets', false, findPredicate);
      });

      it('should return an action callback.', () => {
        expect(onTicketUpdate).toEqual(expect.any(Function));
      });

      describe('and adding a ticket to the queue', () => {
        let result1;
        beforeEach(() => {
          result1 = {ticketId: 'ticket-1'};
          onSave.mockImplementation((target, actions) => {
            return Promise.resolve([ {result: result1, action: actions[0]} ])
          });

          ticket1Id = 'local-ticket-1';
          ticket1 = {capacity: 100};
          onTicketUpdate(ticket1Id, ticket1);

          jest.runAllTimers();
        });

        it('should perform a batch save.', async () => {
          expect(onSave).toHaveBeenCalledTimes(1);
          expect(onSave).toHaveBeenCalledWith(expect.objectContaining({id: dealId}), [expect.any(ReplayableAction)]);

          const onSaveArgs = mostRecentCall(onSave);
          const action = onSaveArgs[1][0];
          expect(action.type).toEqual('array');
          expect(action.property).toEqual('tickets');
          expect(action.remove).toEqual(false);
          expect(action.data).toEqual(ticket1);

          await waitFor(() => expect(children).toHaveBeenCalledTimes(2));
          expect(children).toHaveBeenCalledWith(expect.objectContaining({
            deal: expect.objectContaining({
              // It must merge the data from the db with the data we are trying
              // to set. That way we don't lose any custom identifiers used to
              // track the ticket locally.
              tickets: [{...ticket1, ...result1}],
            }),
          }));
        });

        describe('and then saving a second ticket batch', () => {
          let result2, ticket2Id, ticket2;

          beforeEach(() => {
            onSave.mockClear();
            children.mockClear();

            result2 = {ticketId: 'ticket-2'};
            onSave.mockImplementation((target, actions) => {
              return Promise.resolve([ {result: result2, action: actions[0]} ])
            });

            ticket2Id = 'local-ticket-2';
            ticket2 = {capacity: 200};
            onTicketUpdate(ticket2Id, ticket2);

            jest.runAllTimers();
          });

          it('should pass the updated deal to `onSave` after the first batch is saved.', async () => {
            expect(onSave).toHaveBeenCalledTimes(1);
            expect(onSave).toHaveBeenCalledWith(expect.objectContaining({id: dealId}), [expect.any(ReplayableAction)]);

            const onSaveArgs = mostRecentCall(onSave);
            const action = onSaveArgs[1][0];
            expect(action.type).toEqual('array');
            expect(action.property).toEqual('tickets');
            expect(action.remove).toEqual(false);
            expect(action.data).toEqual(ticket2);

            await waitFor(() => expect(children).toHaveBeenCalledTimes(1));
            expect(children).toHaveBeenCalledWith(expect.objectContaining({
              deal: expect.objectContaining({
                // It should now include both tickets correctly merged with
                // their database results.
                tickets: [
                  {...ticket1, ...result1},
                  {...ticket2, ...result2},
                ],
              }),
            }));
          });
        });
      });
    });
  });
});
