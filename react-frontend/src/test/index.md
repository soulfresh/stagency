- src
  - test
    - <a href="#buttonpageobject">ButtonPageObject</a>
    - <a href="#tablepageobject">TablePageObject</a>
    - <a href="#textfieldpageobject">TextFieldPageObject</a>
    - <a href="#any">any</a>
    - <a href="#anything">anything</a>
    - <a href="#containingarray">containingArray</a>
    - <a href="#containingobject">containingObject</a>
    - <a href="#elementcontent">elementContent</a>
    - <a href="#elementtext">elementText</a>
    - <a href="#equals">equals</a>
    - <a href="#greaterthan">greaterThan</a>
    - <a href="#greaterthanorequalto">greaterThanOrEqualTo</a>
    - <a href="#is">is</a>
    - <a href="#lessthan">lessThan</a>
    - <a href="#lessthanorequalto">lessThanOrEqualTo</a>
    - <a href="#matchingarray">matchingArray</a>
    - <a href="#matchingobject">matchingObject</a>
    - <a href="#artists">artists</a>
    - <a href="#fake">fake</a>
    - <a href="#mock">mock</a>
    - <a href="#venues">venues</a>
    - <a href="#generateid">generateId</a>
    - <a href="#getallbytestidandfilter">getAllByTestIdAndFilter</a>
    - <a href="#getbytestidandfilter">getByTestIdAndFilter</a>
    - <a href="#getbytextandid">getByTextAndId</a>
    - <a href="#getbytextandidandindex">getByTextAndIdAndIndex</a>
    - <a href="#getlabel">getLabel</a>
    - <a href="#listof">listOf</a>
    - <a href="#maybegenerate">maybeGenerate</a>
    - <a href="#mostrecentcall">mostRecentCall</a>
    - <a href="#printelements">printElements</a>
    - <a href="#renderwithalldeps">renderWithAllDeps</a>
    - <a href="#renderwithanalytics">renderWithAnalytics</a>
    - <a href="#renderwithrouter">renderWithRouter</a>
    - <a href="#renderwithrouterandanalytics">renderWithRouterAndAnalytics</a>
    - <a href="#silencealllogs">silenceAllLogs</a>
    - <a href="#silencelogs">silenceLogs</a>
    - <a href="#silenceunmountedstateupdatewarning">silenceUnmountedStateUpdateWarning</a>
    - <a href="#waitforms">waitForMS</a>
    - <a href="#waitforpromise">waitForPromise</a>
    - <a href="#waitfortrue">waitForTrue</a>
    - <a href="#wrapwithalldependencies">wrapWithAllDependencies</a>
    - <a href="#wrapwithanalytics">wrapWithAnalytics</a>
    - <a href="#wrapwithrouter">wrapWithRouter</a>
    - <a href="#wrapwithrouterandanalytics">wrapWithRouterAndAnalytics</a>
- root
  - <a href="#htmlpageobject">HTMLPageObject</a>



















## artists





#### Defined in
- *[src/test/fake.js:36](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/fake.js#L36)*

<br/>
## fake

This namespace provides functions that allow you
to generate data specific to your domain.






#### Defined in
- *[src/test/fake.js:68](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/fake.js#L68)*

<br/>
## mock



`any`

#### Defined in
- *[src/test/mocks.js:11](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/mocks.js#L11)*

<br/>
## venues





#### Defined in
- *[src/test/fake.js:53](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/fake.js#L53)*

<br/>
## generateId

  ▸ **generateId**(`doGen`) => `void`

Generate a unique id.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| doGen |  | *-* |


#### Returns
`void` 


#### Defined in
- *[src/test/helpers.js:54](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/helpers.js#L54)*

<br/>
## getAllByTestIdAndFilter

  ▸ **getAllByTestIdAndFilter**(`id`, `filter`, `container`) => `void`

Get all elements matching the given test id and filter callback.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| id | `string` | *-* |
| filter | `Function` | *-* |
| container |  | *-* |


#### Returns
`void` 



#### Defined in
- *[src/test/testing-library.js:69](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/testing-library.js#L69)*

<br/>
## getByTestIdAndFilter

  ▸ **getByTestIdAndFilter**(`id`, `filter`, `container`) => `void`

Get a single element matching the given test id and filter callback.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| id | `string` | *-* |
| filter | `Function` | *-* |
| container |  | *-* |


#### Returns
`void` 



#### Defined in
- *[src/test/testing-library.js:95](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/testing-library.js#L95)*

<br/>
## getByTextAndId

  ▸ **getByTextAndId**(`text`, `id`, `container`) => `HTMLElement`

Get an element by its text and test id.
Use this if there are multiple elements with
either the same text or the same test id and
you need to disambiguate between them.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| text | `string` | *-* |
| id | `string` | *-* |
| container | `any` | *-* |


#### Returns
`HTMLElement` 



#### Defined in
- *[src/test/testing-library.js:122](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/testing-library.js#L122)*

<br/>
## getByTextAndIdAndIndex

  ▸ **getByTextAndIdAndIndex**(`text`, `id`, `index`, `container`) => `HTMLElement`

Get an element by its text, test id and its index
in the list of matching elements. Use this if there
could be multiple elements on the page with the same
text and test id.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| text | `string` | *-* |
| id | `string` | *-* |
| index |  | `0` |
| container | `any` | `screen` |


#### Returns
`HTMLElement` 



#### Defined in
- *[src/test/testing-library.js:49](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/testing-library.js#L49)*

<br/>
## getLabel

  ▸ **getLabel**(`el`) => `string`

Get the label text associated with an element.
If the element has multiple object that define it's
label, they will be combined with a space.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| el | `any` | *-* |


#### Returns
`string` 


#### Defined in
- *[src/test/page-object-helpers.js:21](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/page-object-helpers.js#L21)*

<br/>
## listOf

  ▸ **listOf**(`count`, `generate`) => `void`

Generate a list of items, calling a factory function
to generate each item.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| count |  | `1` |
| generate |  | `...` |


#### Returns
`void` The list of generated items.



#### Defined in
- *[src/test/helpers.js:37](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/helpers.js#L37)*

<br/>
## maybeGenerate

  ▸ **maybeGenerate**(`generate`, `allowEmptyEntities`, `weight`) => `any`

Randomly generate a value or return undefined. This allows you
to simulate data that might not be returned from an API.
By default it will call the factory (for safety in tests).




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| generate | `Function` | *-* |
| allowEmptyEntities |  | `false` |
| weight |  | `0.95` |


#### Returns
`any` The generated item.



#### Defined in
- *[src/test/helpers.js:17](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/helpers.js#L17)*

<br/>
## mostRecentCall

  ▸ **mostRecentCall**(`mockFunc`) => `any`



#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| mockFunc | `any` | *-* |


#### Returns
`any` 


#### Defined in
- *[src/test/jest.js:10](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/jest.js#L10)*

<br/>
## printElements

  ▸ **printElements**(`el`) => `void`

Print an element DOM to the console.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| el |  | *-* |


#### Returns
`void` 


#### Defined in
- *[src/test/page-object-helpers.js:8](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/page-object-helpers.js#L8)*

<br/>
## renderWithAllDeps

  ▸ **renderWithAllDeps**(`component`, `options`) => `RenderResult`





#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| component | `any` | *-* |
| options |  | `{}` |


#### Returns
`RenderResult` 


#### Defined in
- *[src/test/render.js:105](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/render.js#L105)*

<br/>
## renderWithAnalytics

  ▸ **renderWithAnalytics**(`component`, `[options]`) => `RenderResult`





#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| component | `any` | *-* |
| [options] |  | `{}` |


#### Returns
`RenderResult` 


#### Defined in
- *[src/test/render.js:71](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/render.js#L71)*

<br/>
## renderWithRouter

  ▸ **renderWithRouter**(`component`, `[options]`) => `RenderResult`





#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| component | `any` | *-* |
| [options] |  | `{}` |


#### Returns
`RenderResult` 


#### Defined in
- *[src/test/render.js:51](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/render.js#L51)*

<br/>
## renderWithRouterAndAnalytics

  ▸ **renderWithRouterAndAnalytics**(`component`, `[options]`) => `RenderResult`





#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| component | `any` | *-* |
| [options] |  | `{}` |


#### Returns
`RenderResult` 


#### Defined in
- *[src/test/render.js:92](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/render.js#L92)*

<br/>
## silenceAllLogs

  ▸ **silenceAllLogs**() => `void`





#### Returns
`void` 


#### Defined in
- *[src/test/jest.js:6](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/jest.js#L6)*

<br/>
## silenceLogs

  ▸ **silenceLogs**(`level`) => `void`



#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| level | `string` | `'log'` |


#### Returns
`void` 


#### Defined in
- *[src/test/jest.js:1](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/jest.js#L1)*

<br/>
## silenceUnmountedStateUpdateWarning

  ▸ **silenceUnmountedStateUpdateWarning**() => `void`

Silence error logs stating that a React can't perform a state update on
an unmounted component.

**Note**: Avoid using this as much as possible. Start by seeing if you
can track down the state update and prevent it from happening. You should
only resort to using this solution when you just can't track down the
problematic state update.

If you do end up using this function, please add a comment with notes around
anything you've discovered or tried while debugging the issue.






#### Returns
`void` 


#### Defined in
- *[src/test/jest.js:26](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/jest.js#L26)*

<br/>
## waitForMS

  ▸ **waitForMS**(`ms`) => `Promise`

Wait for the specified number of milliseconds.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| ms | `number` | *-* |


#### Returns
`Promise` 



#### Defined in
- *[src/test/wait.js:18](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/wait.js#L18)*

<br/>
## waitForPromise

  ▸ **waitForPromise**(`promise`) => `Promise`

Wait for the given promise to either resolve or reject.
This helps clarify the intent of tests and prevents
tests from failing if the promise rejects.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| promise | `Promise` | *-* |


#### Returns
`Promise` 



#### Defined in
- *[src/test/wait.js:9](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/wait.js#L9)*

<br/>
## waitForTrue

  ▸ **waitForTrue**(`cb`) => `Promise`

Wait for the given callback to return true.
This functions similarly to the waitFor method
from @testing-library except that your callback
should return a boolean, rather than throwing an exception.
This makes it a little easier to read and write
terse wait for statements.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| cb | `Function` | *-* |


#### Returns
`Promise` 


#### Defined in
- *[src/test/testing-library.js:30](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/testing-library.js#L30)*

<br/>
## wrapWithAllDependencies

  ▸ **wrapWithAllDependencies**(`component`, `store`, `url`, `analytics`) => `Element`



#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| component | `any` | *-* |
| store | `any` | *-* |
| url | `any` | *-* |
| analytics | `any` | *-* |


#### Returns
`Element` 


#### Defined in
- *[src/test/render.js:96](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/render.js#L96)*

<br/>
## wrapWithAnalytics

  ▸ **wrapWithAnalytics**(`component`, `analytics`) => `Element`



#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| component | `any` | *-* |
| analytics | `any` | `...` |


#### Returns
`Element` 


#### Defined in
- *[src/test/render.js:55](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/render.js#L55)*

<br/>
## wrapWithRouter

  ▸ **wrapWithRouter**(`component`, `url`, `history`) => `Element`



#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| component | `any` | *-* |
| url | `any` | *-* |
| history | `any` | *-* |


#### Returns
`Element` 


#### Defined in
- *[src/test/render.js:11](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/render.js#L11)*

<br/>
## wrapWithRouterAndAnalytics

  ▸ **wrapWithRouterAndAnalytics**(`component`, `url`, `analytics`) => `Element`



#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| component | `any` | *-* |
| url | `any` | *-* |
| analytics | `any` | *-* |


#### Returns
`Element` 


#### Defined in
- *[src/test/render.js:75](https://github.com/soulfresh/react-website-template/tree/master/src/test/src/test/render.js#L75)*

<br/>


