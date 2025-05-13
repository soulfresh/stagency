- services
  - auth
    - <a href="#authservice">AuthService</a>
      - <a href="#constructor">constructor</a>
      - <a href="#client">client</a>
      - <a href="#delay">delay</a>
      - <a href="#loggedin">loggedIn</a>
      - <a href="#loginsuccess">loginSuccess</a>
      - <a href="#user">user</a>
      - <a href="#_authresponse">_authResponse</a>
      - <a href="#authenticate">authenticate</a>
      - <a href="#debug">debug</a>
      - <a href="#emit">emit</a>
      - <a href="#error">error</a>
      - <a href="#info">info</a>
      - <a href="#login">login</a>
      - <a href="#logout">logout</a>
      - <a href="#warn">warn</a>
    - <a href="#useauthservice">useAuthService</a>


## AuthService Class

__Extends__
`ServiceBase`


<br/>

### new AuthService( loggedIn, loginSuccess, user, delay )

Service used to authenticate users.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| loggedIn | `boolean` | `true` |
| loginSuccess | `boolean` | `true` |
| user |  | `...` |
| delay | `number` | `0` |


#### Defined in
- *[services/auth/AuthService.js:8](https://github.com/soulfresh/react-website-template/tree/master/src/services/auth/services/auth/AuthService.js#L8)*

<br/>### AuthService.client


#### Defined in
- *[@types/@thesoulfresh-utils.d.ts:3](https://github.com/soulfresh/react-website-template/tree/master/src/services/auth/@types/@thesoulfresh-utils.d.ts#L3)*

<br/>### AuthService.delay


#### Defined in
- *[services/auth/AuthService.js:19](https://github.com/soulfresh/react-website-template/tree/master/src/services/auth/services/auth/AuthService.js#L19)*

<br/>### AuthService.loggedIn


#### Defined in
- *[services/auth/AuthService.js:15](https://github.com/soulfresh/react-website-template/tree/master/src/services/auth/services/auth/AuthService.js#L15)*

<br/>### AuthService.loginSuccess


#### Defined in
- *[services/auth/AuthService.js:16](https://github.com/soulfresh/react-website-template/tree/master/src/services/auth/services/auth/AuthService.js#L16)*

<br/>### AuthService.user


#### Defined in
- *[services/auth/AuthService.js:17](https://github.com/soulfresh/react-website-template/tree/master/src/services/auth/services/auth/AuthService.js#L17)*

<br/>### AuthService._authResponse








#### Defined in
- *[services/auth/AuthService.js:27](https://github.com/soulfresh/react-website-template/tree/master/src/services/auth/services/auth/AuthService.js#L27)*

<br/>### AuthService.authenticate


Check it the user is currently authenticated.
This should be used at application startup to see
if the user has an existing auth token you can use
to keep them logged in. If the returned promise
rejects, then you will need to call `login` to
log the user in.






#### Defined in
- *[services/auth/AuthService.js:45](https://github.com/soulfresh/react-website-template/tree/master/src/services/auth/services/auth/AuthService.js#L45)*

<br/>### AuthService.debug




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| args |  | *-* |


#### Defined in
- *[@types/@thesoulfresh-utils.d.ts:5](https://github.com/soulfresh/react-website-template/tree/master/src/services/auth/@types/@thesoulfresh-utils.d.ts#L5)*

<br/>### AuthService.emit




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| args |  | *-* |


#### Defined in
- *[@types/@thesoulfresh-utils.d.ts:9](https://github.com/soulfresh/react-website-template/tree/master/src/services/auth/@types/@thesoulfresh-utils.d.ts#L9)*

<br/>### AuthService.error




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| args |  | *-* |


#### Defined in
- *[@types/@thesoulfresh-utils.d.ts:8](https://github.com/soulfresh/react-website-template/tree/master/src/services/auth/@types/@thesoulfresh-utils.d.ts#L8)*

<br/>### AuthService.info




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| args |  | *-* |


#### Defined in
- *[@types/@thesoulfresh-utils.d.ts:6](https://github.com/soulfresh/react-website-template/tree/master/src/services/auth/@types/@thesoulfresh-utils.d.ts#L6)*

<br/>### AuthService.login


Log the user in.






#### Defined in
- *[services/auth/AuthService.js:63](https://github.com/soulfresh/react-website-template/tree/master/src/services/auth/services/auth/AuthService.js#L63)*

<br/>### AuthService.logout


Log the user out.






#### Defined in
- *[services/auth/AuthService.js:82](https://github.com/soulfresh/react-website-template/tree/master/src/services/auth/services/auth/AuthService.js#L82)*

<br/>### AuthService.warn




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| args |  | *-* |


#### Defined in
- *[@types/@thesoulfresh-utils.d.ts:7](https://github.com/soulfresh/react-website-template/tree/master/src/services/auth/@types/@thesoulfresh-utils.d.ts#L7)*

<br/><br/>
## useAuthService

  ▸ **useAuthService**(`authService`, `debug`) => `void`

This hook stores the user's authenticated state and provides
login, logout and forgot login callbacks. Internally it uses
an auth service to perform the authentication steps.




#### Parameters
| Name | Type | Default Value |
| :--- | :--- | :------------ |
| authService | `any` | *-* |
| debug | `boolean` | `env.verbose` |


#### Returns
`void` 


#### Defined in
- *[services/auth/useAuthService.js:15](https://github.com/soulfresh/react-website-template/tree/master/src/services/auth/services/auth/useAuthService.js#L15)*

<br/>

