import queryString from 'query-string';
import { matchPath } from 'react-router';

/*
 * A Map of route names to `Route` objects.
 *
 * IMPORTANT: These routes need to be inserted in order of
 * specificity (least specific to most specific) so the
 * `findRouteMatching` method finds the first matching route.
 *
 * @typedef {Object} Route
 * @property {string} title - The default title to display for the matching page. Some
 *   pages may choose to ignore this and build a more specific title.
 * @property {string} path - The path with replacement variables.
 *
 * @const {Map} Routes
 */
// IMPORTANT: These routes need to be inserted in order of
// specificity (lease specific to most specific);
export const Routes = new Map([
  [ 'HOME'       , {title: 'Stagency'   , path : '/'} ],
  [ 'DEALS'      , {title: 'Stagency'   , path : '/'} ],
  [ 'CREATE_DEAL', {title: 'Create Deal', path: '/deals/new'}],
  [ 'DEAL'       , {title: 'Deal'       , path: '/deals/:id'}],
]);

/**
 * Get the URL for a specific route with path parameters
 * replaced.
 *
 * @param {string} name - The name of the route (key) in the Routes map.
 * @param {Object} [urlParams] - An object with the url parameters to replace.
 *   Each key in the parameter should match a variable token in the route
 *   (without the leading ':'). If parameters is not passed, the raw
 *   path is returned.
 *
 *   Ex: {projectId: 123} will replace the project id token in the route
 *   `/project/:projectId/new` with the value 123.
 * @param {Object} [queryParams] - An object of key/value pairs to use as
 *   query parameters on the URL.
 *
 * @return {string} The url that can be used to route to a specific page.
 */
export function getRoute(name, urlParams, queryParams, mapping = Routes) {
  const route = mapping.get(name);
  if (!route) {
    console.error('Could not find route called', name);
    return '#';
  }

  let r = route.path;
  if (urlParams) {
    Object.keys(urlParams).forEach((key) => r = r.replace(`:${key}`, urlParams[key]));
  }

  if (queryParams) {
    const q = queryString.stringify(queryParams);
    if (q) r += `?${q}`;
  }

  return r;
}

/**
 * @typedef {object} RouteMatch
 * @prop {string} key The key of the route.
 * @prop {object} route The route.
 * @prop {object} match The match.
 */

/**
 * Get an element from the `Routes` map based on the current browser location.
 *
 * @param {string} location The location url to match.
 * @return {RouteMatch|null} The route match if found.
 */
export function findRouteMatchingLocation(location, mapping = Routes) {
  // Convert the Routes map into objects that contain both the key and value.
  let values = [];
  mapping.forEach((value, key) => values.push({value, key}));
  values = values.reverse();

  // Search the routes in reverse looking for the first route to match the given location.
  for (let route of values) {
    const match = matchPath(location, {path: route.value.path, exact: true, strict: false});
    if (match) {
      return {
        key: route.key,
        route: route.value,
        match
      };
    }
  }
  return null;
}

/**
 * Check to see if a URL matches one of the routes provided.
 *
 * @param {string} url The url to match.
 * @param {string|string[]} routes The routes to compare to.
 * @return {boolean} true if the url matches one of the routes.
 */
export function doesURLMatch(url, routes) {
  if (!Array.isArray(routes)) routes = [routes];
  const filtered = routes.filter(t => {
    return matchPath(url, {
      path: t,
      exact: true,
      strict: false
    });
  });
  return filtered.length > 0;
}

/**
 * Given a route or query parameter name,
 * normalize the value. For example, if the
 * param should be treated as a number, this
 * will convert the value into a number.
 *
 * @param {string} name
 * @param {string} value
 * @return {string|number}
 */
export function normalizeParam(name, value) {
  if (/(Id$|Count$)/.test(name)) {
    return Number(value);
  }

  return value;
}

/**
 * Normalize all keys in a parameter object.
 *
 * @param {object} params The params to normalize.
 * @return {object} The normalized params.
 */
export function normalizeAllParams(params) {
  if (!params) return null;
  const out = {};
  Object.keys(params).forEach(key => {
    out[key] = normalizeParam(key, params[key]);
  });
  return out;
}

/**
 * Get a parameter from a parameter object, doing any necessary casting.
 * For convenience, you can pass the react-router `match` object or
 * the `match.params` property.
 *
 * @param {string} name - The name of the property to retrieve and cast.
 * @param {object} match - The `react-router` match object or an object
 *   that contains the expected key.
 * @return {*} The value of the desired key.
 */
export function getRouteParam(name, match) {
  // Allow passing either the `match` object or
  // the `match.params` object.
  const params = match.params ? match.params : match;

  return normalizeParam(name, params[name]);
}

/**
 * Get all parameters from the URL match as noramlized values.
 * For convenience, you can pass the react-router `match` object or
 * the `match.params` property.
 *
 * @param {object} match - The `react-router` match object or an object
 *   with keys to convert.
 * @return {object} An object with all keys cast into usable values.
 */
export function getAllRouteParams(match) {
  const params = match.params ? match.params : match;
  return normalizeAllParams(params);
}

/**
 * Get a parameter from the URL query string.
 * @param {string} name - The name of the paramerter to retrieve.
 * @param {string | location} search - The search string from window.location
 *   or the location object from react-router.
 */
export function getQueryParam(name, search) {
  if (typeof(search) === 'object' && search.search) search = search.search;
  const params = queryString.parse(search);

  return normalizeParam(name, params[name]);
}

/**
 * Get an object with all of the query params in the search
 * string with all params normalized.
 *
 * @param {object} search The search params.
 * @return {object|null} The normalized params.
 */
export function getAllQueryParams(search) {
  if (typeof(search) === 'object' && search.search) search = search.search;
  if (!search) return null;
  const params = queryString.parse(search);
  return normalizeAllParams(params);
}
