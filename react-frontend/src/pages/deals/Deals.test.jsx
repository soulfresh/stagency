import React from 'react';

import {
  renderWithRouter,
  and,
  including,
  ResizeObserver,
  equals,
  greaterThan,
  anything,
  matchingArray,
  containingArray,
} from '~/test';
import { generateGraphQL as mock } from '~/services/mocks';
import { fromGraphQL } from '~/services';
import { formatDateRange, formatDate } from '~/utils';
import { Deals } from './Deals.jsx';
import { DealsPageObject } from './Deals.page-object';

describe('Deals', function() {
  let page, deals, getDealURL, onDeleteDeal;
  const newDealURL = 'new/deal/url';

  beforeEach(() => {
    getDealURL = jest.fn(() => 'existing/deal/url');
    onDeleteDeal = jest.fn();
  })

  describe('with no deals', () => {
    beforeEach(() => {
      page = DealsPageObject();
      renderWithRouter(
        <Deals
          getDealURL={getDealURL}
          newDealURL={newDealURL}
          onDeleteDeal={onDeleteDeal}
          ResizeObserver={ResizeObserver}
        />
      );
    });

    it('should render with no deals.', async () => {
      await page.exists();
      await page.has({dealCount: 0});
    });

    it('should render the correct Create Deal link.', async () => {
      await page.has({newDealURL: including(newDealURL)});
    });
  });

  describe('with deals', () => {
    beforeEach(() => {
      deals = [
        mock.app_deal({
          events  : [mock.app_deal_event({
            date: (new Date('10/1/3333')).toISOString()
          })],
          deal_status_type: mock.app_deal_status_type({comment: 'Confirmed'})
        }),
        mock.app_deal({
          artist  : mock.app_artist({name: 'Foo Artist'}),
          events  : [mock.app_deal_event({
            venue: mock.app_venue({name: 'Foo Venue'}),
            date: (new Date('1/1/3333')).toISOString()
          })],
          deal_status_type: mock.app_deal_status_type({comment: 'Pending'}),
        }),
        mock.app_deal({
          events  : [mock.app_deal_event({
            date: (new Date('7/1/3333')).toISOString()
          })],
          deal_status_type: mock.app_deal_status_type({comment: 'Confirmed'}),
        }),
        mock.app_deal({
          events  : [mock.app_deal_event({
            date: (new Date('8/1/3333')).toISOString(),
          })],
          deal_status_type: mock.app_deal_status_type({comment: 'Confirmed'}),
        }),
      ].map(fromGraphQL.app_deal);

      page = DealsPageObject();

      renderWithRouter(
        <Deals
          deals={deals}
          getDealURL={getDealURL}
          newDealURL={newDealURL}
          onDeleteDeal={onDeleteDeal}
          ResizeObserver={ResizeObserver}
        />
      )
    });

    it('should render all deal rows.', async () => {
      await page.has({
        dealCount: and(
          greaterThan(0),
          equals(deals.length)
        )
      });
    });

    it('should render the correct deal data.', async () => {
      await page.has({
        deals: matchingArray(
          deals.map(d => [
            d.artist.name,
            including(d.events[0].venue.name),
            formatDateRange(d.events.map(e => e.date)),
            formatDate(d.lastUpdated),
            d.status.comment,
            anything(),
          ])
        )
      })
    });

    it('should render the correct link for the Create Deal button.', async () => {
      await page.has({newDealURL: including(newDealURL)});
    });

    it('should be able to filter deals by artist name.', async () => {
      await page.search(deals[1].artist.name);

      await page.has({dealCount: 1});
      await page.has({
        deals: matchingArray([
          containingArray(['Foo Artist'])
        ])
      });
    });

    it('should be able to filter deals by venue.', async () => {
      await page.search('Foo Venue');

      await page.has({dealCount: 1});
      await page.has({
        deals: matchingArray([
          containingArray(['Foo Artist', 'Foo Venue'])
        ])
      });
    });

    it('should be able to filter deals by event date.', async () => {
      await page.search('January');

      await page.has({dealCount: 1});
      await page.has({
        deals: matchingArray([
          containingArray(['Foo Artist', 'Jan 1, 3333'])
        ])
      })
    });

    it('should be able filter deals by status.', async () => {
      await page.search('Pending');

      await page.has({dealCount: greaterThan(0)});
      await page.has({
        deals: containingArray([
          containingArray(['Foo Artist', 'Pending'])
        ])
      })
    });

    describe('after opening the deal actions menu', () => {
      xit('should render the correct edit link.', () => {});

      describe('and then clicking on the delete button', () => {
        xit('should call the onDelete callback.', () => {});
        xit('should remove the deal from the list of deals.', () => {});
      });
    });
  });
});
