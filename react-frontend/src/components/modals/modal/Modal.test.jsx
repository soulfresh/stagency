import React from 'react';
import { render } from '@testing-library/react';

import { ActionPageObject } from '../../buttons/page-objects.js';
import { Action } from '../../buttons';
import { Modal } from './Modal.jsx';
import { ModalPageObject } from './Modal.page-object';

const Sandbox = ({children, ...props}) => children(props);

describe('Modal', function() {
  let modal, trigger, closeButton;

  beforeEach(() => {
    modal = ModalPageObject('Example Modal');
    trigger = ActionPageObject('Open');
    closeButton = ActionPageObject({label: 'Close Modal'});
  });

  describe('by default', () => {
    beforeEach(() => {
      render(
        <Sandbox>
          {() => {
            const [isOpen, setIsOpen] = React.useState(false);
            return (
              <>
                <div id="root">
                  <Action onClick={() => setIsOpen(true)}>Open</Action>
                </div>
                <Modal
                  aria-label="Example Modal"
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  disableAnimations
                >
                  <div>My Modal Content</div>
                </Modal>
              </>
            );
          }}
        </Sandbox>
      );

      Modal.setAppElement('#root');
    });

    it('should not be visible.', async () => {
      await modal.absent();
    });

    describe('after opening the modal', () => {
      beforeEach(async function() {
        await trigger.click();
      });

      it('should show the modal contents.', async () => {
        await modal.exists();
      });

      describe('and then closing the modal', () => {
        beforeEach(async function() {
          await closeButton.click();
        });

        it('should hide the modal contents.', async () => {
          await modal.absent();
        });
      });
    });
  });
});
