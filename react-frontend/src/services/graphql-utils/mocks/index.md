- root
  - <a href="#creategraphclientmock">createGraphClientMock</a>
  - <a href="#createtestclient">createTestClient</a>


## createGraphClientMock

  ▸ **createGraphClientMock**(`schema`, `errorLink`, `cache`, `debug`) => `ApolloClient`

Create a mock Apollo GraphQL client with the given mock schema.
This is useful in situations where you want to provide a full
schema with mocks (such as integration tests). This client
is automatically used during tests and the mock server.

```js
import { makeExecutableSchema } from '@graphql-tools/schema';
const schema = makeExecutableSchema({ typeDefs: schemaDefinition });

// Your mock schema generator here. See: https://www.graphql-tools.com/docs/mocking#customizing-mocks
const mocks = {
  query_root: () => ({}),
  mutation_root: () => ({}),
  // your scalar type mocks here...
};

addMocksToSchema({
  schema,
  mocks: {
    ...mocks,
    // You could merge in any additional mocks from somewhere else
    // if you needed.
    // ...additionalMocks
  }
});

return createGraphClientMock(errorLink, schema, cache);
```




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| schema | `any` | *-* |
| errorLink | `any` | *-* |
| cache | `InMemoryCache` | `...` |
| debug | `boolean` | `false` |


#### Returns
`ApolloClient` 


#### Defined in
- *[graph-client.mock.js:38](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-utils/mocks/graph-client.mock.js#L38)*

<br/>
## createTestClient

  ▸ **createTestClient**(`mocks`, `errorLink`, `cache`, `debug`) => `ApolloClient`

Generate a mock client for use in tests. This is most
useful when you want to specifically control the responses
from the GraphQL mocks. The downside of this approach is
you must precisely define the request mocks to exactly
match all requests that will be made.

You can pass an empty array in order to test the
loading state of a request.

More information about mocking can be found at:
https://www.apollographql.com/docs/react/development-testing/testing/#testing-loading-states

```js
const onAuthFailure = jest.fn();
const authToken = 'abc123';

// Create a service instance that will respond to specific requests.
const service = new GraphAPI(
   onAuthFailure,
   authToken,
   createTestClient([
     // Each item in this list should match a request that will be made.
     {
       // This request definition must match the GraphQL request query
       // and variables exactly.
       request: {
         query: GQL_QUERY,
         variables: {
           // ...variables must match the request exactly
         },
       },
       // The following properties are optional based on
       // the needs of your test.
       result: {
         data: {
           // ...your result data goes here
         },
       },
       // If you specify an error property, the request will
       // fail with the given error.
       error: new Error('your error here'),
     }
  ])
);
```

You can setup your client to hook into Apollo's global
error handler as follows:

```js
import { makeGraphQLErrorLink } from '~/services';
// Create an Apollo Link that will hook into the global error handler.
const errorLink = makeGraphQLErrorLink(jest.fn());
// Pass the error link to your test client.
const apolloClient = createTestClient({}, errorLink);
```




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| mocks | `any` | *-* |
| errorLink | `any` | *-* |
| cache | `InMemoryCache` | `...` |
| debug | `boolean` | `false` |


#### Returns
`ApolloClient` 


#### Defined in
- *[graph-client.mock.js:122](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-utils/mocks/graph-client.mock.js#L122)*

<br/>
