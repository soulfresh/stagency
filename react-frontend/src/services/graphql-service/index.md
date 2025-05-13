- root
  - <a href="#graphqlservice">GraphQLService</a>
    - <a href="#constructor">constructor</a>
    - <a href="#clear">clear</a>
    - <a href="#getappconfig">getAppConfig</a>
    - <a href="#getdeals">getDeals</a>
    - <a href="#getusers">getUsers</a>
  - <a href="#get_app_config">GET_APP_CONFIG</a>
  - <a href="#get_deal">GET_DEAL</a>
  - <a href="#get_deals">GET_DEALS</a>
  - <a href="#get_users">GET_USERS</a>
  - <a href="#graphqlservicecontext">GraphQLServiceContext</a>
  - <a href="#graphqlserviceprovider">GraphQLServiceProvider</a>
  - <a href="#fragments">fragments</a>
  - <a href="#makegraphqlservicecacheclient">makeGraphQLServiceCacheClient</a>
  - <a href="#usegraphqlservice">useGraphQLService</a>
- transform
  - <a href="#fromgraphql">fromGraphQL</a>
  - <a href="#tographql">toGraphQL</a>
  - <a href="#collapsenestedrelationships">collapseNestedRelationships</a>
  - <a href="#preparenestedrelationships">prepareNestedRelationships</a>


## GraphQLService Class

__Extends__
`unknown`


<br/>

### new GraphQLService( __namedParameters )



#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| __namedParameters | `Object` | *-* |


#### Defined in
- *[graphql-service.js:28](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/graphql-service.js#L28)*

<br/>### GraphQLService.clear


Clear the data cache (for example after logout).
Returns a promise that will resolve after the
cache has been cleared.

For more info, see:
https://www.apollographql.com/docs/react/caching/cache-interaction/#resetting-the-store






#### Defined in
- *[graphql-service.js:73](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/graphql-service.js#L73)*

<br/>### GraphQLService.getAppConfig






#### Defined in
- *[graphql-service.js:102](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/graphql-service.js#L102)*

<br/>### GraphQLService.getDeals


Get the list of all deal summaries this user has access to.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| args |  | *-* |


#### Defined in
- *[graphql-service.js:121](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/graphql-service.js#L121)*

<br/>### GraphQLService.getUsers


TEMP
Get the list of all users in the application.






#### Defined in
- *[graphql-service.js:81](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/graphql-service.js#L81)*

<br/><br/>
## GET_APP_CONFIG



`DocumentNode`

#### Defined in
- *[graphql-service.queries.js:13](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/graphql-service.queries.js#L13)*

<br/>
## GET_DEAL



`DocumentNode`

#### Defined in
- *[graphql-service.queries.js:49](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/graphql-service.queries.js#L49)*

<br/>
## GET_DEALS



`DocumentNode`

#### Defined in
- *[graphql-service.queries.js:22](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/graphql-service.queries.js#L22)*

<br/>
## GET_USERS



`DocumentNode`

#### Defined in
- *[graphql-service.queries.js:4](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/graphql-service.queries.js#L4)*

<br/>
## GraphQLServiceContext



`Context`

#### Defined in
- *[graphql-service.js:199](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/graphql-service.js#L199)*

<br/>
## GraphQLServiceProvider



`Provider`

#### Defined in
- *[graphql-service.js:200](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/graphql-service.js#L200)*

<br/>
## fragments





#### Defined in
- *[graphql-service.fragments.js:112](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/graphql-service.fragments.js#L112)*

<br/>
## makeGraphQLServiceCacheClient

  ▸ **makeGraphQLServiceCacheClient**() => `InMemoryCache`

Make an apollo cache client that can be used to cache results so they're
not always requested from the server.






#### Returns
`InMemoryCache` 


#### Defined in
- *[cache.js:7](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/cache.js#L7)*

<br/>
## useGraphQLService

  ▸ **useGraphQLService**() => `undefined`





#### Returns
`undefined` 


#### Defined in
- *[graphql-service.js:202](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/graphql-service.js#L202)*

<br/>
## fromGraphQL

`fromGraphQL` allows you to transform data from
the relational data model returned from GraphQL into
the application domain model used in the client code.
This sheilds the application from relational data changes
that don't affect the application's logic or data structure.






#### Defined in
- *[transform/fromGraphQL.js:9](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/transform/fromGraphQL.js#L9)*

<br/>
## toGraphQL

`toGraphQL` allows transforming data
from the application domain model to
the relational data model used in GraphQL.


__See:__ fromGraphQL for transformations coming from GraphQL. <br/>




#### Defined in
- *[transform/toGraphQL.js:9](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/transform/toGraphQL.js#L9)*

<br/>
## collapseNestedRelationships

  ▸ **collapseNestedRelationships**(`original`) => `any`

Perform the inverse of `prepareNestedRelationships`.

```js
collapseNestedRelationships({foo: {data: {bar: 'baz'}}});
// -> {foo: {bar: 'baz'}}
```




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| original | `any` | *-* |


#### Returns
`any` 


#### Defined in
- *[transform/util.js:47](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/transform/util.js#L47)*

<br/>
## prepareNestedRelationships

  ▸ **prepareNestedRelationships**(`original`) => `any`

Transform an object with nested object properties into
GraphQL relationships (ie, replace those properties with
a data property that points to the nested object).

```js
prepareNestedRelationships({foo: {bar: 'baz'}});
// -> {foo: {data: {bar: 'baz'}}}
```




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| original | `any` | *-* |


#### Returns
`any` 


#### Defined in
- *[transform/util.js:16](https://github.com/soulfresh/react-website-template/tree/master/src/services/graphql-service/transform/util.js#L16)*

<br/>
