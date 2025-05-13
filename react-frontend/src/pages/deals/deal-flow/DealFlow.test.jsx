import ResizeObserver from 'resize-observer-polyfill'
import { renderWithAllDeps, TICKET_TYPES } from '~/test';

import { ActionPageObject } from '~/components/page-objects';
import { DealFlow } from './DealFlow';
// import { DealFlowPO } from './DealFlow.page-object.js';

describe('DealFlow', function() {
  let saveButton;

  describe('that is cancellable', () => {
    beforeEach(() => {
      saveButton = ActionPageObject('Save and Exit');
      renderWithAllDeps(
        <DealFlow
          data-testid="DealFlow"
          config={{
            TICKET_TYPES,
          }}
          ResizeObserver={ResizeObserver}
        />
      );
    });

    it('should render.', async () => {
      await saveButton.exists();
    });

    xit('should show the first page of the deal flow.', () => {});
    xit('should be able to advance through the flow.', () => {});
    xit('should save the deal as the user advances through the flow.', () => {});
    describe('after clicking the cancel button', () => {
      xit('should prompt the user to confirm that they really want to delete the deal.', () => {});
      describe('and then confirming the cancel.', () => {
        xit('should delete the deal object.', () => {});
      });
    });
    xit('should be able to save and exit the deal flow.', () => {});
    describe('after starting the save process', () => {
      xit('should flush the queue.', () => {});
      xit('should redirect immidiately to the Deals page if there is nothing in the queue.', () => {});
      xit('should show the loader', () => {})
      xit('should redirect to the Deals page after successfully flushing the queue.', () => {});
      describe('if the flush fails', () => {
        xit('should show an error toast.', () => {});
        xit('should ask the user if they want to replay the error or just exit.', () => {});
      });
    });
    describe('after a save error', () => {
      xit('should show an error toast.', () => {});
      xit('should be able to replay the action.', () => {});
      describe('after replaying an action', () => {
        xit('should show the toast again if another error occurs.', () => {});
      });
    });
  });

  describe('that is not cancellable', () => {
    xit('should not show a cancel button.', () => {});
  });
});

