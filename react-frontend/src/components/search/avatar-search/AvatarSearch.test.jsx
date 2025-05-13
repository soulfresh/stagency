import React from 'react';
import { render } from '@testing-library/react';

import { artists, including } from '~/test';
import { Modal } from '../../modals';
import { AvatarSearch } from './AvatarSearch.jsx';
import { AvatarSearchPageObject } from './AvatarSearch.page-object';

describe('AvatarSearch', function() {
  let page, onSearch, onSelect, onClear;

  beforeEach(() => {
    onSearch = jest.fn((term) => {
      if (term) {
        return artists
          .filter(a => new RegExp(term, 'i').test(a.name));
      } else {
        return [];
      }
    });
    onSelect = jest.fn();
    onClear = jest.fn();
    page = AvatarSearchPageObject({testId: 'ArtistSearch'});
  });


  describe('by default', () => {
    beforeEach(() => {
      render(
        <AvatarSearch
          data-testid="ArtistSearch"
          modalLabel="Artist Search"
          onSearch={onSearch}
          onSelect={onSelect}
          onClear={onClear}
          getImage={a => a.image.url}
          placeholder="Search Artists..."
        />
      );

      Modal.setAppElement('body');
    });

    it('should render the empty button', async () => {
      await page.exists();
      await page.has({placeholder: 'Search Artists...'});
    });

    it('should not render the clear button.', async () => {
      await page.is({clearable: false});
    });

    describe('after clicking on the input', () => {
      beforeEach(async () => {
        await page.click();
      });

      it('should open the search modal.', async () => {
        await page.has({modal: true});
      });

      describe('and then searching for an artist', () => {
        beforeEach(async () => {
          await page.searchFor('Jimi Hendrix');
        });

        it('should have called the onSearch method.', () => {
          expect(onSearch).toHaveBeenCalledWith('Jimi Hendrix');
        });

        it('should show the artist results.', async () => {
          await page.has({resultCount: 1});
          await page.has({results: ['Jimi Hendrix']});
        });

        describe('and then selecting an artist', () => {
          beforeEach(async () => {
            await page.selectResult(0);
          });

          it('should hide the modal.', () => {
            expect(onSelect).toHaveBeenCalledTimes(1);
            expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({
              name: 'Jimi Hendrix',
            }))
          });

          it('should show the selected artist in the avatar input.', async () => {
            await page.has({value: including('Jimi Hendrix')});
          });

          it('should show the clear button.', async () => {
            await page.is({clearable: true});
          });

          describe('and then clearing the artist', () => {
            beforeEach(async () => {
              await page.clear();
            });

            it('should empty the button value.', async () => {
              await page.has({value: including('Search Artists...')});
            });

            it('should call the onClear callback.', () => {
              expect(onClear).toHaveBeenCalledTimes(1);
            })
          });
        });
      });
    });
  });

  describe('with a value', () => {
    xit('should should show the existing value in the avatar input.', () => {});

    describe('and then clearing the input', () => {
      xit('should empty the avatar input element.', () => {});
      xit('should call the onClear callabck.', () => {});
    });

    describe('after finding a different artist', () => {
      xit('should show the new artist in the avatar input.', () => {});
    });
  });
});
