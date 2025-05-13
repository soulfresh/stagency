import React from 'react';
import { render } from '@testing-library/react';

import { artists, greaterThan } from '~/test';

import { Search } from './Search.jsx';
import { SearchPageObject } from './Search.page-object';

describe('Search', function() {
  let page, onSearch;

  describe('uncontrolled', () => {
    describe('synchronous', () => {
      beforeEach(() => {
        page = SearchPageObject();

        onSearch = jest.fn(term =>
          artists.filter(a => new RegExp(term, 'i').test(a.name))
        )

        render(
          <Search
            itemToString={item => item.name}
            onSearch={onSearch}
          />
        );
      });

      it('should not render any results.', async () => {
        await page.has({resultCount: 0});
      });

      describe('after entering a search term', () => {
        beforeEach(async () => {
          await page.search('jimi');
        })

        it('should call the onSearch callback.', async () => {
          expect(onSearch).toHaveBeenCalledWith('jimi')
        });

        it('should immediately show the results.', async () => {
          await page.has({resultCount: 1});
          await page.has({results: ['Jimi Hendrix']})
        });
      });
    });

    describe('asynchronous', () => {
      beforeEach(() => {
        page = SearchPageObject();

        onSearch = jest.fn(term =>
          new Promise((resolve) => resolve(
            artists.filter(a => new RegExp(term, 'i').test(a.name))
          ))
        )

        render(
          <Search
            itemToString={item => item.name}
            onSearch={onSearch}
          />
        );
      });

      it('should not render any results.', async () => {
        await page.has({resultCount: 0});
      });

      describe('after entering a search term', () => {
        beforeEach(async () => {
          await page.search('jimi');
          await page.has({resultCount: greaterThan(0)})
        });

        it('should call the onSearch callback.', () => {
          expect(onSearch).toHaveBeenCalledWith('jimi')
        });

        it('should should show the results.', async () => {
          await page.has({resultCount: 1});
        });
      });
    });

  });

  describe('controlled', () => {
    beforeEach(() => {
      page = SearchPageObject();
      render(
        <Search
          results={artists}
        />
      );
    });

    xit('should render the results it is given.', async () => {
      await page.exists();
    });

    describe('after entering a search term', () => {
      xit('should call the onSearch callback.', () => {});

      describe('and then receiving results', () => {
        xit('should should show the results.', () => {});
      });
    });
  });
});
