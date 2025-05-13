import React from 'react'
import queryString from 'query-string';
import {env} from '~/env'

/**
 * Create an options object to pass to the service
 * factories by merging the options passed and
 * any query parameters in the URL.
 * @param {object} options - options
 * @return {object} options that include any query
 *   parameters in the browser URL.
 */
// eslint-disable-next-line no-unused-vars
export function useServiceOptions(options) {
  return React.useMemo(() => {
    // Merge any query params from the URL into the generator
    // options so we can configure the app using query params.
    const params = queryString.parse(window.location.search);
    for (let key in params) {
      if (params[key] === 'true') {
        params[key] = true;
      } else if (params[key] === 'false') {
        params[key] = false;
      }
    }

    const out = {
      ...options,
      ...params,
    };

    if (!env.test && !env.production) console.log('[WithServer] service factory options:', out);
    return out;
  }, [options]);
}
