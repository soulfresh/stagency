
// import { CreateDealPageObject } from './CreateDeal.page-object';

describe('CreateDeal', function() {
  // let page;

  describe('updateDeal', () => {
    xit('should request the deal from GraphQL.', () => {})
    xit('should be able to add a new row to a table in the deal.', () => {});
    xit('should be able to update the data in a row of a table in the deal', () => {});
    xit('should be able to remove a row of data from a table in the deal.', () => {});
    xit('should modify the deal in place.', () => {});
    xit('should redirect to the homepage on save and exit.', () => {});
    xit('should redirect to the homepage on cancel.', () => {});
  });

  beforeEach(() => {
    // page = CreateDealPageObject();
    // TODO Render the App and deeplink to the create deal page.
  });

  describe('when creating a new deal', () => {
    xit('should start on the first page of the flow.', () => {});
    describe('when on the Ticket Scaling page', () => {
      xit('should show the default ticket types.', () => {})
      // TODO These should all verify the onSave callback.
      xit('should be able to add a new row to the ticket scaling table.', () => {});
      xit('should be able to update new row in the ticket scaling table.', () => {});
      xit('should be able to remove a new row from the ticket scaling table.', () => {});
    });
    describe('after filling in the Ticket Scaling page', () => {
      xit('should go to the Schedule page.', () => {});
      xit('should have called onSave with all ticket scaling updates.', () => {});
      describe('and then going back to the Ticket Scaling page', () => {
        xit('should show the ticket scaling values.', () => {});
      });
    });
    describe('and filling out all pages', () => {
      xit('should have passed all updates to the onSave callback.', () => {});
      describe('and then going back through all pages', () => {
        xit('should retain all of the data the user entered.', () => {});
      });
    });
  });

  describe('with an existing deal', () => {
    xit('should populate the all pages with the deal state from the backend.', () => {});
  });
});

