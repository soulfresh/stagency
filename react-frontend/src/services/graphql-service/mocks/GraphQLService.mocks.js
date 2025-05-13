import { makeExecutableSchema } from '@graphql-tools/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import merge from 'lodash.merge';
import { randNumber } from '@ngneat/falso';

import { createGraphClientMock } from '../../graphql-utils/mocks';
import { listOf, TICKET_TYPES, generateId, EXPENSE_TYPES } from '~/test';
import { generateGraphQL as generate } from './GraphQLService.generate';
import { toGraphQL } from '../transform';

import { loader } from 'graphql.macro';

const schemaDefinition = loader('../GraphQLService.schema.graphql');

function findNextId(store, type, start = 1) {
  let id = start;
  while(store.has(type, id)) {
    console.log('checking for id', id)
    id++;
  }
  console.log('use id:', id)
  return id;
}

/**
 * Output the full shape of a schema object from the given schema type.
 * `toGraphQL` will be used to generate the shape of the schema object with all
 * null values. The `id` property will be stripped.
 *
 * @param {string} relationship - The name of the schema object to generate.
 */
function makeTemplate(relationship) {
  const generate = toGraphQL[relationship];
  if (!generate || typeof(generate) !== 'function') {
    console.warn('[GraphQLService.mocks] Unable to create relationship template for', relationship);
    return {}
  }

  // Fill in the template properties.
  const base = generate();
  const out = Object.keys(base).reduce((acc, key) => {
    acc[key] = base[key] === undefined ? null : base[key];
    return acc;
  }, {});

  // Remove id because the mock store `set()` function will throw and error if
  // it is included. If you need that property, simply set it manually after
  // using this function.
  delete out.id;
  return out;
}

/**
 * @type GraphQLServiceMockClientOptions
 * @property {any} [errorLink]
 * @property {any} [cache]
 * @property {Bag} [mocks]
 * @property {Bag} [generatorOptions]
 * @property {Bag} [resolvers]
 * @property {boolean} [debug]
 */

/**
 * Creates a mock Apollo client that will auto generate fake data
 * for requests against it using the mocks returned by `createGraphMocks`.
 * You can use this function to create Apollo clients that
 * return mock data during testing, the mock server or Storybook.
 *
 * For information on how the schema mocks, see
 * https://www.graphql-tools.com/docs/mocking#mocking-custom-scalar-types
 *
 * @param {GraphQLServiceMockClientOptions} options
 */
export function createGraphQLServiceMockClient({
  /**
   * Apollo Error Link instance to pass to the Apollo client.
   * You can get an `errorLink` that will trigger the global
   * error handler by importing `createErrorLink` from `Home.jsx`.
   */
  errorLink,
  /** Apollo Cache Link instance to pass to the Apollo client. */
  cache,
  /** Any additional GraphQL Type mocks you wish to merge into the default mocks */
  mocks,
  /** Options to pass to the generator methods (ie. GraphQLService.generate) */
  generatorOptions = {},
  /** Resolvers to use as described at https://www.graphql-tools.com/docs/mocking#mockstore */
  resolvers = {},
  /** Whether to perform verbose logging */
  debug = false,
} = {}) {
  const generatorDefaults = {
    includeId: false,
    userCount: randNumber({min: 1, max: 10}),
    dealCount: randNumber({min: 1, max: 20}),
  }
  // Merge together our defaults and the overrides passed in.
  const options = { ...generatorDefaults, ...generatorOptions }
  const schema = makeExecutableSchema({ typeDefs: schemaDefinition })

  const schemaWithMocks = addMocksToSchema({
    schema,
    preserveResolvers: false,
    // These type policies configure the field used as the "id" for
    // looking up each relationship object in the mock store.
    // prettier-ignore
    typePolicies: {
      // Tell the mock store to use the 'email' as the key for looking up
      // users. You can specify the look up keys used for any object in
      // the mock store.
      'user' : {keyFieldName : 'email'},
    },
    mocks: merge({
        // Proxy the factories on generate so they pass our
        // generator options to the factory methods.
        // NOTE: If you need to specify mock methods in your
        // tests, you should instead pass the mocks option to
        // createReportAPIClientMock
        ...Object.keys(generate).reduce((acc, key) => {
          acc[key] = () => generate[key](options)
          return acc
        }, {}),

        // Type mocks
        // These mocks are used to customize the default mocks provided
        // by `@graphql/tools`. You can specify partial implementations
        // for any `type` definition in our schema and the rest of the
        // type will be populated by `@graphql/tools`. This has the advantage
        // that you can provide partial types but you don't have access
        // to the store (cache layer) or query details in these mocks.
        // For that reason, these mocks are often most useful for providing
        // defaults for low level types in your schema.
        // See: https://www.graphql-tools.com/docs/mocking#customizing-mocks
        // query_root: () => ({}),
        // mutation_root: () => ({}),
      },
      // Also merge in any Type mocks that were passed from tests.
      mocks
    ),
    // The `resolvers` mocks give you access to the query parameters
    // and the store (data cache) in your mocks. In order to work, they
    // must return the full data structure expected by your query
    // (ie. they won't fill in default mock values for you like
    // the schema mocks in `createGraphMocks`). You should use
    // these resolvers to ensure that your mocks maintain data
    // values between requests.
    // For more info see:
    // https://www.graphql-tools.com/docs/mocking#mockstore
    resolvers: (store) => ({
      ...resolvers,
      query_root: {
        // When requesting the Application Config, return all ticket types.
        app_ticket_type: () => {
          return TICKET_TYPES;
        },
        app_expense_type: () => {
          return EXPENSE_TYPES;
        },
        // This example shows how you could setup the mocks to return a specific
        // user by the email address used in the GraphQL query.
        // users: (_, {where}) => {
        //   const email = where.email._eq
        //   return [store.get('user', email)]
        // },
        // This example shows how you could setup the mocks to return a specific
        // number of users by passing the userCount when you create the mock
        // client.
        // users: () => {
        //   return listOf(generatorOptions.userCount, () => store.get('user'))
        // },
        app_deal: (/*_, __, ___, {variableValues}*/) => {
          return listOf(options.dealCount, () => generate.app_deal(options))
        },
        ...resolvers.query_root,
      },
      mutation_root: {
        insert_app_deal: (_, __, ___, last) => {
          // The name of the query being executed.
          const action = last.operation.name.value;
          const date = (new Date()).toISOString();

          if (action === 'createEmptyDeal') {
            const id = findNextId(store, 'app_deal');

            // Create an empty deal in the store.
            store.set('app_deal', id, {
              artist: null,
              deal_status_type: generate.app_deal_status_type({comment: 'Pending', ...options}),
              deal_venues: [],
              expenses: [],
              performance_schedules: [],
              show_schedules: [],
              ticket_scalings: [],
              created_at: date,
              updated_at: date,
            })

            return {
              affected_rows: 1,
              returning: [store.get('app_deal', id)],
            }
          }
        },
        delete_app_deal: () => {
          return {
            affected_rows: 1
          }
        },
        insert_app_ticket_scaling: (_, variables) => {
          const tickets = variables.objects;

          // Upsert each ticket into the store.
          const refs = tickets.map(t => {
            const id = t.id || generateId();
            const type = TICKET_TYPES.find(tt => tt.value === t.ticket_type) || null;

            const template = {
              ...makeTemplate('app_ticket_scaling'),
              ...t,
              deal_id: t.deal_id,
              type: type || null,
            };
            delete template.id;

            store.set('app_ticket_scaling', id, {
              ...template,
            });

            // Get a ref to the updated ticket.
            const ref = store.get('app_ticket_scaling', id);

            // If we're adding a new ticket...
            if (!t.id) {
              // Get the existing tickets on the deal.
              const deal = store.get('app_deal', t.deal_id);
              const existingTickets = store.get(deal, 'ticket_scalings');

              // Merge our new ticket into the deal ticket list.
              store.set(deal, 'ticket_scalings', existingTickets.concat([ref]));
            }

            return ref;
          });

          return {
            affected_rows: 1,
            returning: refs,
          }
        },
        delete_app_ticket_scaling: (_, __, ___, {variableValues}) => {
          const ticketIds = variableValues.items;

          return {
            affected_rows: ticketIds.length,
            returning: ticketIds.map(id => {
              if (store.has('app_ticket_scaling', id)) {
                return store.get(`app_ticket_scaling`, id);
              } else {
                return {id: id};
              }
            })
          }
        },
        insert_app_expense: (_, __, ___, {variableValues}) => {
          const expenses = variableValues.items;

          return {
            affected_rows: expenses.length,
            returning: expenses.map(s => ({
              ...makeTemplate('app_expense'),
              ...s,
              type: EXPENSE_TYPES.find(t => t.value === s.expense_type)
            })),
          }
        },
        delete_app_expense: (_, __, ___, {variableValues}) => {
          const ids = variableValues.items;

          return {
            affected_rows: ids.length,
            returning: ids.map(id => {
              if (store.has('app_expense', id)) {
                return store.get('app_expense', id)
              } else {
                return {id: id}
              }
            })
          }
        },
        insert_app_show_schedule: (_, __, ___, {variableValues}) => {
          const schedule = variableValues.items;

          return {
            affected_rows: schedule.length,
            returning: schedule.map(s => ({
              ...makeTemplate('app_show_schedule'),
              ...s,
            })),
          }
        },
        delete_app_show_schedule: (_, __, ___, {variableValues}) => {
          const ids = variableValues.items;

          return {
            affected_rows: ids.length,
            returning: ids.map(id => {
              if (store.has('app_show_schedule', id)) {
                return store.get('app_show_schedule', id)
              } else {
                return {id: id}
              }
            })
          }
        },
        insert_app_performance_schedule: (_, __, ___, {variableValues}) => {
          const schedule = variableValues.items;

          return {
            affected_rows: schedule.length,
            returning: schedule.map(s => ({
              ...makeTemplate('app_performance_schedule'),
              ...s,
            })),
          }
        },
        delete_app_performance_schedule: (_, __, ___, {variableValues}) => {
          const ids = variableValues.items;

          return {
            affected_rows: ids.length,
            returning: ids.map(id => {
              if (store.has('app_performance_schedule', id)) {
                return store.get('app_performance_schedule', id)
              } else {
                return {id: id}
              }
            })
          }
        }
      },
    }),
  })

  return createGraphClientMock(schemaWithMocks, errorLink, cache, debug)
}

