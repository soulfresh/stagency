- src
  - services
    - graphql-utils
      - <a href="#logginglink">LoggingLink</a>
        - <a href="#constructor">constructor</a>
        - <a href="#level">level</a>
        - <a href="#concat">concat</a>
        - <a href="#logoperation">logOperation</a>
        - <a href="#onerror">onError</a>
        - <a href="#request">request</a>
        - <a href="#setonerror">setOnError</a>
        - <a href="#split">split</a>
        - <a href="#concat">concat</a>
        - <a href="#empty">empty</a>
        - <a href="#execute">execute</a>
        - <a href="#from">from</a>
        - <a href="#split">split</a>
      - <a href="#graphqlerrorhandler">graphQLErrorHandler</a>
      - <a href="#makegraphqlerrorlink">makeGraphQLErrorLink</a>


## LoggingLink Class

__Extends__
`ApolloLink`

Apollo link object that will log GraphQL requests.



<br/>

### new LoggingLink( level )



#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| level | `string` | `'debug'` |


#### Defined in
- *[src/services/graphql-utils/logging-link.js:13](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-utils/src/services/graphql-utils/logging-link.js#L13)*

<br/>### LoggingLink.level


#### Defined in
- *[src/services/graphql-utils/logging-link.js:21](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-utils/src/services/graphql-utils/logging-link.js#L21)*

<br/>### LoggingLink.concat




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| next |  | *-* |


#### Defined in
- *[node_modules/@apollo/client/link/core/ApolloLink.d.ts:11](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-utils/node_modules/@apollo/client/link/core/ApolloLink.d.ts#L11)*

<br/>### LoggingLink.logOperation




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| operation | `any` | *-* |
| type | `any` | *-* |
| rest |  | *-* |


#### Defined in
- *[src/services/graphql-utils/logging-link.js:27](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-utils/src/services/graphql-utils/logging-link.js#L27)*

<br/>### LoggingLink.onError




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| error | `any` | *-* |
| observer | `Observer` | *-* |


#### Defined in
- *[node_modules/@apollo/client/link/core/ApolloLink.d.ts:13](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-utils/node_modules/@apollo/client/link/core/ApolloLink.d.ts#L13)*

<br/>### LoggingLink.request




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| operation | `any` | *-* |
| forward | `any` | *-* |


#### Defined in
- *[src/services/graphql-utils/logging-link.js:50](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-utils/src/services/graphql-utils/logging-link.js#L50)*

<br/>### LoggingLink.setOnError




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| fn | (`error`, `observer`) => `void` | *-* |


#### Defined in
- *[node_modules/@apollo/client/link/core/ApolloLink.d.ts:14](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-utils/node_modules/@apollo/client/link/core/ApolloLink.d.ts#L14)*

<br/>### LoggingLink.split




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| test | (`op`) => `boolean` | *-* |
| left |  | *-* |
| right |  | *-* |


#### Defined in
- *[node_modules/@apollo/client/link/core/ApolloLink.d.ts:10](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-utils/node_modules/@apollo/client/link/core/ApolloLink.d.ts#L10)*

<br/>### LoggingLink.concat




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| first |  | *-* |
| second |  | *-* |


#### Defined in
- *[node_modules/@apollo/client/link/core/ApolloLink.d.ts:8](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-utils/node_modules/@apollo/client/link/core/ApolloLink.d.ts#L8)*

<br/>### LoggingLink.empty






#### Defined in
- *[node_modules/@apollo/client/link/core/ApolloLink.d.ts:4](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-utils/node_modules/@apollo/client/link/core/ApolloLink.d.ts#L4)*

<br/>### LoggingLink.execute




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| link | `ApolloLink` | *-* |
| operation | `GraphQLRequest` | *-* |


#### Defined in
- *[node_modules/@apollo/client/link/core/ApolloLink.d.ts:7](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-utils/node_modules/@apollo/client/link/core/ApolloLink.d.ts#L7)*

<br/>### LoggingLink.from




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| links |  | *-* |


#### Defined in
- *[node_modules/@apollo/client/link/core/ApolloLink.d.ts:5](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-utils/node_modules/@apollo/client/link/core/ApolloLink.d.ts#L5)*

<br/>### LoggingLink.split




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| test | (`op`) => `boolean` | *-* |
| left |  | *-* |
| right |  | *-* |


#### Defined in
- *[node_modules/@apollo/client/link/core/ApolloLink.d.ts:6](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-utils/node_modules/@apollo/client/link/core/ApolloLink.d.ts#L6)*

<br/><br/>
## graphQLErrorHandler

  ▸ **graphQLErrorHandler**(`__namedParameters`) => `void`

A global error handler used to handle GraphQL errors
before they are dispatched to individual GraphQL query
handlers. This method is called for each error with
parameters describing any GraphQL or network errors.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| __namedParameters | `Object` | *-* |


#### Returns
`void` 


#### Defined in
- *[src/services/graphql-utils/errors.js:9](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-utils/src/services/graphql-utils/errors.js#L9)*

<br/>
## makeGraphQLErrorLink

  ▸ **makeGraphQLErrorLink**(`onAuthFailure`) => `ApolloLink`

Make an apollo-link-error instance that is configured to use the
global error handler.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| onAuthFailure | `any` | *-* |


#### Returns
`ApolloLink` 


#### Defined in
- *[src/services/graphql-utils/errors.js:65](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-utils/src/services/graphql-utils/errors.js#L65)*

<br/>


