import { ServiceBase } from '@thesoulfresh/utils'
import { generateAuth as generate } from './mocks'

export class AuthService extends ServiceBase {
  /**
   * Service used to authenticate users.
   */
  constructor(
    loggedIn = true,
    loginSuccess = true,
    user = {name: 'Mr Grumps'},
    delay = 0,
  ) {
    super(null, true)
    this.loggedIn = loggedIn
    this.loginSuccess = loginSuccess
    this.user = user
    // this.user = generate.user(user)
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

  /**
   * Check it the user is currently authenticated.
   * This should be used at application startup to see
   * if the user has an existing auth token you can use
   * to keep them logged in. If the returned promise
   * rejects, then you will need to call `login` to
   * log the user in.
   * @return {Promise<*>} - A promise the resolves
   *   to the auth data/token or rejects if the user
   *   has not been authenticated previously.
   */
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

  /**
   * Log the user in.
   * @return {Promise<*>} - A promise that resolves
   *   to the user's auth data/token or rejects if
   *   login was unsuccessful.
   */
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

  /**
   * Log the user out.
   * @return {Promise<*>} - A promise that resolves
   *   after the user has been logged out.
   */
  logout() {
    this.loggedIn = false
    return Promise.resolve(true)
  }
}
