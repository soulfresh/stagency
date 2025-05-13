import React from 'react';
import PropTypes from 'prop-types';

import { useMaybeControlled } from '@thesoulfresh/react-tools';

import { Avatar } from '../../avatar';
import { Modal } from '../../modals';
import { Search, SearchResult } from '../../search';
import { AvatarInput } from './AvatarInput.jsx';

import styles from './AvatarSearch.module.scss';


/**
 * `<AvatarSearch>` allows users to search for any item
 * that can be represented as an avatar (name and image).
 * This component will render both the avatar input element
 * and the modal used to search for avatars.
 *
 * @param {object} props
 * @param {*} [props.value]
 * @param {function} [props.onSearch]
 * @param {function} [props.onSelect]
 * @param {*} [props.results]
 * @param {string} [props.placeholder]
 * @param {function} [props.getName]
 * @param {function} [props.getImage]
 * @param {string} [props.className]
 * @param {function} [props.ResizeObserver]
 * @return {React.ReactElement}
 */
export function AvatarSearch({
  value,
  results: resultsProp,
  onSearch,
  onSelect,
  onClear,
  placeholder = 'Search...',
  modalLabel = 'Search Dialog',
  getName = a => a.name,
  getImage = a => a.image,
  ResizeObserver,
  className,
  ...rest
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [avatar, setAvatar] = useMaybeControlled(value)
  const [searchTerm, setSearchTerm] = React.useState('');
  const [results, setResults] = useMaybeControlled(resultsProp, undefined, []);

  const handleSelect = avatar => {
    setAvatar(avatar);
    setIsOpen(false);
    if (onSelect) onSelect(avatar);
  }

  const handleSearch = term => {
    setSearchTerm(term);
    return onSearch(term);
  }

  const onSearchResults = r => {
    // Cache the results locally so they are immediately available
    // if we close and reopen the search menu.
    setResults(r);
  }

  const handleClear = () => {
    setAvatar(null);
    onClear && onClear()
  }

  return (
    <>
      <AvatarInput
        data-testid="AvatarInput"
        className={className}
        placeholder={placeholder}
        onClick={() => setIsOpen(true)}
        onClear={handleClear}
        name={ avatar ? getName(avatar)  : ''}
        image={avatar ? getImage(avatar) : ''}
        ResizeObserver={ResizeObserver}
        {...rest}
      />
      <Modal
        data-testid="AvatarSearchModal"
        aria-label={modalLabel}
        className={styles.Modal}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <Search
          className={styles.Search}
          placeholder={placeholder}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          onSearchResults={onSearchResults}
          results={results}
          onSelect={handleSelect}
          renderResult={(props, item, index, list) =>
            <SearchResult {...props}>
              <Avatar
                className={styles.Avatar}
                name={getName(item)}
                image={getImage(item)}
                labelled
                size="s"
              />
            </SearchResult>
          }
        />
      </Modal>
    </>
  );
}

AvatarSearch.propTypes = {
  /**
   * The accessible label to use for the search modal.
   */
  modalLabel: PropTypes.string.isRequired,
  /**
   * A function to call when the user types in the search field.
   */
  onSearch: PropTypes.func,
  /**
   * A function to call when the user selects an item in the search results.
   */
  onSelect: PropTypes.func,
  /**
   * The placeholder text to use in the avatar input element.
   */
  placeholder: PropTypes.string,
  /**
   * A function to get the name of an item in the search results.
   * Defaults to looking for a `name` property on each result.
   */
  getName: PropTypes.func,
  /**
   * A function to get the picture for each item in the search results.
   * Defaults to looking for an `image` property on each result.
   */
  getImage: PropTypes.func,
  /**
   * Allows you to pass a resize observer polyfill during testing.
   */
  ResizeObserver: PropTypes.func,
  /**
   * Any other props will be passed through to the avatar input element
   * via it's `InputDecorator`. This means you can pass any props accepted
   * by the other input elements or any props of `Action`.
   */
  'other props...': PropTypes.any,
};

