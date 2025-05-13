import { snakeCase } from 'snake-case';

/**
 * A Proxy around `process.env` that allows
 * you to access variables without remembering to
 * prefix the variable names with "REACT_APP_".
 * However, you can still reference them that way
 * if you choose. Additionally, you can expose helpers
 * on this class to simplify using variables.
 *
 * Some Examples:
 * --------------
 * env.name === process.env.REACT_APP_NAME
 * env.REACT_APP_NAME === process.env.REACT_APP_NAME
 * env.production === (process.env.NODE_ENV === 'production')
 */
export class EnvWrapper {
  constructor(env = process.env) {
    const me = this;
    return new Proxy(env, {
      get: function(target, prop, receiver) {
        // If the property is defined on this class, use that.
        if (me[prop] !== undefined) {
          return me[prop];
        }
        // If the property is defined on process.env, use that.
        else if (target[prop] !== undefined) {
          return Reflect.get(target, prop, receiver);
        }
        // If the prop is something like "fooBar",
        // then look for "REACT_APP_FOO_BAR".
        else {
          const snaked = 'REACT_APP_' + snakeCase(prop).toUpperCase();
          if (target[snaked] !== undefined) {
            return Reflect.get(target, snaked, receiver);
          }
        }
      }
    });
  }

  get verbose() {
    return process.env.REACT_APP_VERBOSE === 'true'
  }

  get environment() {
    return process.env.REACT_APP_ENV
  }

  get production() {
    return process.env.REACT_APP_ENV === 'production' || process.env.REACT_APP_ENV === 'prod'
  }

  get test() {
    return process.env.REACT_APP_ENV === 'test'
  }

  // Alias for test
  get testing() {
    return process.env.REACT_APP_ENV === 'test'
  }

  get development() {
    return process.env.REACT_APP_ENV === 'development' || process.env.REACT_APP_ENV === 'dev'
  }

  // Whether or not to run against mock APIs.
  get mocks() {
    return process.env.REACT_APP_MOCK_APIS === 'true'
  }

  // Alias for mocks
  get mock() {
    return process.env.REACT_APP_MOCK_APIS === 'true'
  }

  // The name of the app.
  get appName() {
    return process.env.REACT_APP_NAME
  }

  /**
   * Log the environment variables.
   */
  log(force = false) {
    if (
      force ||
      (!env.production && env.verbose && !env.test)
    ) {
      console.log('[ENV] environment:', env.environment);
      for (let key in env) {
        const blacklist = ['log', 'environment', 'graphAPIKey'];
        if (blacklist.indexOf(key) === -1 && key.startsWith('REACT_APP')) {
          console.log(`[ENV] ${key}:`, env[key]);
        }
      }
    }
  }
}

export const env = new EnvWrapper(process.env);
