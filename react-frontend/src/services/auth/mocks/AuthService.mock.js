import { generateAuth as generate } from './generateAuth'
import { ServiceBase } from '@thesoulfresh/utils'

export class AuthServiceMock extends ServiceBase {
  /**
   * A mock implementation of the Auth0 service.
   * This can be used in tests and during the static
   * server to mimic Auth0 interactions.
   * @param {boolean} [loggedIn] - Whether the user should be logged in initially.
   *   This only applies to the initial `authenticate`
   *   call. Subsequently, the logged in state will be
   *   determined by the login/logout calls.
   * @param {boolean} [loginSuccess] - Whether calls to authenticate the user should succeed. Use this
   *   to test failure states. It will cause all methods
   *   (authenticate, login, logout) to fail. If you want
   *   to force specific methods to fail, you should spyOn
   *   the methods you want to fail and return a `Promise.reject()`
   * @param {*} [user] - The user data to return from Auth0. See `./generateAuth#user`
   * @param {number} [delay] - A delay to use in order to make the authentication process
     * feel more realistic. This helpful in the mock server mode.
   */
  constructor(
    loggedIn = false,
    loginSuccess = true,
    user = {},
    delay = 0,
  ) {
    super(null, true)
    this.loggedIn = loggedIn
    this.loginSuccess = loginSuccess
    this.user = generate.user(user)
    this.delay = delay
  }

  /**
   * @private
   * This function just ensures the mock auth response
   * shape is consistent between authenticate and login.
   */
  _authResponse() {
    return {
      token: generate.accessToken(),
      user: this.user,
    }
  }

  authenticate() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.loggedIn) {
          return resolve(this._authResponse())
        } else {
          return reject(false)
        }
      }, this.delay)
    })
  }

  login() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.loginSuccess) {
          this.loggedIn = true
          return resolve(this._authResponse())
        } else {
          this.loggedIn = false
          return reject(new Error('Login failed'))
        }
      }, this.delay)
    })
  }

  logout() {
    this.loggedIn = false
    return Promise.resolve(true)
  }
}
