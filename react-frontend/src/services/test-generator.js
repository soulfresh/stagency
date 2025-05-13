import {
  fromGraphQL,
} from '~/services';
import {
  generateGraphQL,
} from '~/services/mocks';

/**
 * EXPERIMENTAL
 * This class simplifies generating mock data as returned
 * by your service classes. The API simply combines
 * your service generators with their `fromService`
 * functions.
 *
 * Using this class allows you to do this in your tests:
 * const items = generate.items({randomize: false});
 *
 * Instead of having to do this:
 * const items = fromGraphQL.items(
 *   generateGraphQL.items({randomize: false})
 * );
 */
export class TestGenerator {
  /**
   * @typedef Service
   * @property {*} generate - The factory used to generate API data.
   * @property {*} from - The factory used to translate from the API data
   *   into the domain model.
   */
  /**
   * @param {Service[]} services - The list of services to proxy.
   */
  constructor(services = []) {
    this.services = services;
    const me = this;

    // @ts-ignore
    return new Proxy({}, {
      get: function(_, prop, __) {
        if (me[prop]) {
          return me[prop];
        } else {
          const found = services.filter(s => !!s.generate[prop] && !!s.from[prop]);

          if (found.length < 1) {
            throw new Error(`Unable to find a factory named "${String(prop)}" on the available services.`);
          }
          else if (found.length > 1) {
            throw new Error(`Found multiple services with a "${String(prop)}" factory.`);
          }

          const {generate, from} = found[0];
          // Return a closure that when called, will first generate
          // values using the factory and any arguments passed.
          // The result will then be passed to the equivalent fromService function.
          return (...args) => from[prop](generate[prop].apply(generate, args));
        }
      }
    });
  }
}

export const generate = new TestGenerator([{
  generate: generateGraphQL,
  from: fromGraphQL,
}]);
