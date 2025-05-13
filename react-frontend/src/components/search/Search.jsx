import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';
import { useMaybeControlled, useProcessEvent } from '@thesoulfresh/react-tools';

import { ReactComponent as SearchIcon } from '~/assets/icons/search.svg';
import { Input } from '../inputs';
import { HR } from '../hr';

import styles from './Search.module.scss';

/**
 * `<Search>` is a base component you can use to create other
 * more specific search types. It gives you a search input
 * and a results list without defining exactly how your results
 * are displayed or searched. Use the `onSearch` parameter to provide a function to call
 * when the user types in the search box. You an use the `onSelect`
 * prop to receive the result selected by the user. Use the
 * `renderResult` prop to customize how each result is rendered.
 *
 * `Search` can be used as either a controlled or uncontrolled component.
 *
 * ### Uncontrolled
 * To use as an uncontrolled component, leave the `results` prop `undefined`
 * and return your results in the `onSearch` prop. You can return either
 * an array of results or a `Promise` that resolves to an array.
 *
 * ### Controlled
 * To use as a controlled component, pass the current `results` to
 * display and use the `onSearch` prop to fetch new results to display.
 *
 * ### Result List
 * To control the display of your search results, use the `renderResult`
 * prop. This should return a JSX value to display for each row.
 * It will be called with the following parameters:
 *
 * - **props**: Props you must apply to your item.
 * - **item**: The current item being rendered from the results array.
 * - **index**: The index of the current item being rendered.
 * - **results**: The array of results being rendered.
 *
 * ### SearchResult component
 * `Search` provides a default `renderItem` prop that assumes
 * results is a string array and it will wrap each string in a
 * `SearchResult` button component. This gives us consistent styling
 * of search results throughout the app. You can also customize
 * the `renderResult` prop to anything you want but in this case
 * you will need to make sure you return a DOM element and apply
 * the props you receive from the `renderItem` callback (first argument)
 * to your DOM element.
 *
 * You can also use the `SearchResult` component (exported by this package)
 * your self. Be aware that `SearchResult` will render a `<button>`
 * so make sure you don't pass an `<Action>`, `<button>` or `<a>`
 * as the children of `<SearchResult>`. If you need to pass one of those
 * you should not use `SearchResult`. If it
 * makes sense, you could `import { SearchResult } from 'Search.module.scss'`
 * if you want to reuse those styles.
 *
 *
 * @param {object} props
 * @param {string} [props.placeholder]
 * @param {string} [props.searchTerm]
 * @param {function} [props.itemToString]
 * @param {function} [props.renderResult]
 * @param {*[]} [props.results]
 * @param {boolean} [props.loading]
 * @param {function} [props.onSearch]
 * @param {function} [props.onSearchResults]
 * @param {function} [props.onSelect]
 * @param {string} [props.className]
 * @return {React.ReactElement}
 */
export function Search({
  className,
  placeholder = 'Search',
  searchTerm,
  itemToString = i => i,
  renderResult = (props, item, index, list) => <SearchResult {...props}>{itemToString(item, index, list)}</SearchResult>,
  results: resultsProp,
  loading: loadingProp,
  onSearch,
  onSearchResults,
  onSelect,
  ...rest
}) {
  const handleEvent = useProcessEvent();
  const [loading, setLoading] = useMaybeControlled(loadingProp, undefined, false);
  const [results, _setResults] = useMaybeControlled(resultsProp, undefined, []);
  const setResults = r => {
    onSearchResults && onSearchResults(r);
    _setResults(r);
  }

  const handleSearch = e => {
    if (onSearch) {
      const result = onSearch(e.target?.value)
      if (result instanceof Promise) {
        setLoading(true);
        result.then(handleEvent(r => {
          setLoading(false);
          setResults(r);
        }));
      } else if (Array.isArray(result)) {
        setResults(result);
      } else {
        console.warn('[Search] onSearch must return an array of results but returned:', result);
      }
    }
  }

  const handleSelect = (...args) => {
    if (onSelect) onSelect(...args);
  }

  return (
    <div
      data-testid="Search"
      role="search"
      className={combineClasses(styles.Search, className)}
      {...rest}
    >
      <Input
        data-testid="search-input"
        className={combineClasses(styles.Input, 'search-input')}
        defaultValue={searchTerm}
        placeholder={placeholder}
        onChange={handleSearch}
        icon={<SearchIcon />}
        loading={loading}
        boxy
        transparent
        tight
        autoFocus
      />
      <HR className={styles.HR} />
      <ul
        data-testid="searchResults"
        className={combineClasses(styles.searchResults, 'search-results')}
        aria-label={`${placeholder} Results`}
        aria-live="assertive"
        aria-busy={loading}
      >
        {results.map((r, i) =>
        <li
          key={i}
          data-testid="result"
          className={styles.resultWrapper}
        >
          {renderResult({onClick: () => handleSelect(r, i)}, r, i, results)}
          </li>
        )}
      </ul>
    </div>
  );
}

Search.propTypes = {
  /**
   * The placeholder text to use in the search input.
   */
  placeholder: PropTypes.string,
  /**
   * This function will be called to render each result
   * in the results. The default implementation will render
   * nothing. This function will be called with the following
   * parameters:
   * @param {object} props - Props you must apply to your element.
   * @param {*} item - The item being rendered
   * @param {number} index - The current result index
   * @param {*[]} results - The full list of results
   */
  renderResult: PropTypes.func,
  /**
   * If you want to use the default `renderResult` function but
   * your data is a list of objects (as opposed to strings), you
   * can use this prop to transform each result into a string.
   * It follows the standard array map function signature:
   * @param {*} item - The item being rendered
   * @param {number} index - The current result index
   * @param {*[]} list - The full list of results
   */
  itemToString: PropTypes.func,
  /**
   * The results to show. If you don't pass this prop, then
   * you must return the results (or a Promise) from your
   * `onSearch` prop.
   */
  results: PropTypes.array,
  /**
   * A function that recieves the user's search term.
   * If you are using this as an uncontrolled component
   * (ie. this component maintains it's own state),
   * you should return the results from this function.
   * If you want to control the state for this component,
   * you should pass the `results` prop and ensure that
   * the initial value of `results` is not undefined.
   */
  onSearch: PropTypes.func,
  /**
   * A function that will be called with the search results
   * whenever they are received. This allows you to react
   * to the result data regardless of how it's retreived
   * (useful for caching search results in generic components).
   */
  onSearchResults: PropTypes.func,
  /**
   * A function that will be called if the user clicks
   * on one of the results in the list. The function
   * will receive the following parameters:
   * @param {*} result - The result data for this item.
   * @param {nubmer} index - The index of this result.
   */
  onSelect: PropTypes.func,
  /**
   * Whether or not to show the loading indicator in
   * the input. You only need to pass this if you
   * are controlling this component's state and your
   * search functionality is asynchronous. Otherwise,
   * this is handled for you.
   */
  loading: PropTypes.bool,
};

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export function SearchResult({
  className,
  ...rest
}) {
  return (
    <button
      data-testid="SearchResult"
      className={combineClasses(styles.SearchResult, className)}
      {...rest}
    />
  );
}

SearchResult.propTypes = {
};
