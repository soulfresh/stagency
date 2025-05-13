import { InMemoryCache } from '@apollo/client'

/**
 * Make an apollo cache client that can be used to cache results so they're
 * not always requested from the server.
 */
export function makeGraphQLServiceCacheClient() {
  return new InMemoryCache({
    addTypename: true,
    // typePolicies allow us to redirect to queries to the cache if
    // the query is different but we know the data may already exist in
    // cache. For example, if we've already requested a list of all Users,
    // then we could go to the cache when looking for a specific user
    // rather than making another network request for data we already
    // have in memory.
    // For more details, see
    // https://www.apollographql.com/docs/react/caching/advanced-topics/#cache-redirects
    typePolicies: {
      // Query: {},
    },
  })
}
