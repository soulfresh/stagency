import {
  randUser,
  randParagraph,
  randNumber,
  randSentence,
  rand,
  randFutureDate,
  randPastDate,
  randRecentDate,
  randFullName,
  randAvatar,
} from '@ngneat/falso'

import { DEAL_STRUCTURES } from '~/model'
import { generateId as gid, listOf, maybeGenerate } from '~/test/helpers'
import { fake, TICKET_TYPES, EXPENSE_TYPES } from '~/test/fake'
import { clean } from '~/utils'

/**
 * Maybe generate an id value. If `includeId` is false, then undefined
 * is returned which allows the GraphQL mocks to generate their own
 * ids.
 * @param [includeId] - Whether to return a unique id or undefined.
 * @return The id string
 */
function generateId(includeId) {
  return includeId ? gid() : undefined
}

/**
 * `generate` provides factories for generating each
 * of the types defined in our Example API schema (`~/example-graph-api-schema.graphql`).
 *
 * You can use the `generate` factories in your tests,
 * in your Storybook stories and in the Apollo mocks
 * (defined in `example-service-schema-mocks.ts`).
 * The shape of the values returned by the `generate`
 * factories match the shape returned by the Example API
 * GraphQL schema. This is great when mocking GraphQL
 * responses but less useful if your tests/stories do not
 * hit the Example API Service class (this will be the case
 * everywhere except integration tests). In those cases,
 * you should pass the data returned by `generate` through one of the
 * `fromGraphQL` transform methods in order to
 * get the same shape of data returned by the Example API Service.
 *
 * ```js
 * import { transform } from '~/services/example-service';
 * import { generateGraphQL } from '~/services/example-service/mocks';
 *
 * // Create a user object as it is returned by GraphQL
 * const user = generateGraphQL.user();
 *
 * // Transform the user object for use in the application
 * const property = transform.user(user);
 *
 * // Now you can pass the property object directly to
 * // your components.
 * ```
 *
 * ### Developer Notes
 *
 * Each of the factories on this object should match the name
 * of a type definition in the `~/example-graph-api-schema.graphql`
 * file and should return a value matching that type.
 */
export const generateGraphQL = {
  bigint: () => randNumber({min: 0, max: 100000}),
  numeric: () => randNumber({min: 0, max: 100000}),
  timestamptz: () => randRecentDate().toISOString(),
  jsonb: () => {},

  /**
   * @param {boolean} [includeId]
   * @param {object} [user]
   * @param {string} [user_id]
   * @param {string} [email]
   * @param {string} [first_name]
   * @param {string} [last_name]
   * @param {string} [profile_picture]
   * @param {string} [bio]
   */
  user: ({
    // Passing false for `includeId` allows you to generate graphql
    // objects without the ids which is useful for mocking data
    // to insert into GraphQL during testing.
    includeId,
    user = randUser(),
    user_id = generateId(includeId),
    email = user.email,
    first_name = user.firstName,
    last_name = user.lastName,
    profile_picture = user.img,
    bio = randParagraph(),
  } = {}) => clean({
    user_id,
    email,
    first_name,
    last_name,
    profile_picture,
    bio,
  }),

  app_ticket_type({
    allowEmpty,
    includeId,
    type = rand(TICKET_TYPES),
    value = type.value,
    comment = type.comment,
  } = {}) {
    return clean({ value, comment });
  },

  /**
   * @param {object} [options]
   * @param {boolean} [options.allowEmpty]
   * @param {boolean} [options.includeId]
   * @param {number} [options.id]
   * @param {string} [options.type]
   * @param {number} [options.capacity]
   * @param {number} [options.complimentary]
   * @param {number} [options.kills]
   * @param {number} [options.price]
   * @param {number} [options.facility]
   * @param {number} [options.charity]
   * @param {number} [options.secondary]
   * @param {number} [options.other]
   * @param {string} [options.notes]
   */
  app_ticket_scaling({
    allowEmpty,
    includeId,
    id            = generateId(includeId),
    type          = maybeGenerate(() => generateGraphQL.app_ticket_type({includeId, allowEmpty}), allowEmpty),
    capacity      = maybeGenerate(() => randNumber({min : 10, max : 10000}), allowEmpty),
    complimentary = maybeGenerate(() => randNumber({min: 0, max: (capacity * 0.2 || 0)}), allowEmpty),
    kills         = maybeGenerate(() => randNumber({min: 0, max: (capacity * 0.05 || 0)}), allowEmpty),
    price         = maybeGenerate(() => randNumber({min: 500, max: 30000}), allowEmpty),
    facility      = maybeGenerate(() => randNumber({min: 0, max: Math.round((price * 0.3 || 0))}), allowEmpty),
    charity       = maybeGenerate(() => randNumber({min: 0, max: Math.round((price * 0.2 || 0))}), allowEmpty),
    secondary     = maybeGenerate(() => randNumber({min: 0, max: Math.round((price * 0.1 || 0))}), allowEmpty),
    other         = maybeGenerate(() => randNumber({min: 0, max: Math.round((price * 0.1 || 0))}), allowEmpty),
    notes         = maybeGenerate(() => randSentence(), allowEmpty),
    sort_order    = maybeGenerate(() => fake.sortOrder(), allowEmpty),
  } = {}) {
    return clean({
      id,
      type,
      capacity,
      complimentary,
      kills,
      price,
      facility,
      charity,
      secondary,
      other,
      notes,
      sort_order,
    });
  },

  /**
   * @param {object} [options]
   * @param {boolean} [options.allowEmpty]
   * @param {boolean} [options.includeId]
   * @param {number} [options.id]
   * @param {string} [options.start_time]
   * @param {string} [options.show_schedule_type]
   * @param {string} [options.notes]
   */
  app_show_schedule({
    allowEmpty,
    includeId,
    id                 = generateId(includeId),
    start_time         = maybeGenerate(() => fake.startTime(), allowEmpty),
    show_schedule_type = maybeGenerate(() => fake.showScheduleType(), allowEmpty),
    notes              = maybeGenerate(() => randSentence(), allowEmpty),
    sort_order         = maybeGenerate(() => fake.sortOrder(), allowEmpty),
  }                    = {}) {
    return clean({
      id,
      start_time,
      show_schedule_type,
      notes,
      sort_order,
    })
  },

  /**
   * @param {object} [options]
   * @param {boolean} [options.allowEmpty]
   * @param {boolean} [options.includeId]
   * @param {number} [options.id]
   * @param {string} [options.start_time]
   * @param {string} [options.set_length]
   * @param {string} [options.artist]
   * @param {string} [options.notes]
   */
  app_performance_schedule({
    allowEmpty,
    includeId,
    id          = generateId(includeId),
    start_time  = maybeGenerate(() => fake.startTime(), allowEmpty),
    set_length  = maybeGenerate(() => fake.duration(), allowEmpty),
    artist_name = maybeGenerate(() => fake.artist().name, allowEmpty),
    notes       = maybeGenerate(() => randSentence(), allowEmpty),
    sort_order  = maybeGenerate(() => fake.sortOrder(), allowEmpty),
  } = {}) {
    return clean({
      id,
      start_time,
      set_length,
      artist_name,
      notes,
      sort_order,
    });
  },

  /**
   * @param {object} [options]
   * @param {object} [options.type] - Used to populate the value/type from the
   *   EXPENSE_TYPES defined in the `fake` namespace.
   * @param {string} [options.value]
   * @param {string} [options.comment]
   */
  app_expense_type: ({
    type = rand(EXPENSE_TYPES),
    value = type.value,
    comment = type.comment,
  } = {}) => clean({
    value,
    comment,
  }),

  /**
   * @param {object} [options]
   * @param {boolean} [options.allowEmpty]
   * @param {boolean} [options.includeId]
   * @param {number} [options.id]
   * @param {string} [options.name]
   * @param {object} [options.type]
   * @param {number} [options.cost]
   * @param {number} [options.maximum]
   * @param {string} [options.notes]
   */
  app_expense: ({
    allowEmpty,
    includeId,
    id = generateId(includeId),
    name = maybeGenerate(() => fake.expenseName(), allowEmpty),
    type = maybeGenerate(() => generateGraphQL.app_expense_type(), allowEmpty),
    cost = maybeGenerate(() => {
      switch(type.value) {
        case 'FLAT_COST':
          return randNumber({min: 5000, max: 100000});
        case 'PER_TICKET_COST':
          return randNumber({min: 5, max: 200});
        case 'PERCENTAGE_COST':
          return randNumber({min: 5, max: 30});
      }
    }, allowEmpty),
    maximum = maybeGenerate(() => randNumber({min: 1000, max: 10000}), allowEmpty),
    notes = maybeGenerate(() => randSentence(), allowEmpty),
    sort_order = '',
  } = {}) => {
    return clean({
      id,
      name,
      type,
      cost,
      maximum,
      notes,
      sort_order,
    });
  },

  /**
   * @param {object} [options]
   * @param {boolean} [options.allowEmpty]
   * @param {boolean} [options.includeId]
   * @param {number} [options.id]
   * @param {object} [options.artist] - An artist from `fake.artist()`
   * @param {string} [options.name]
   * @param {object} [options.image]
   */
  app_artist({
    allowEmpty,
    includeId,
    id = generateId(includeId),
    artist = fake.artist(),
    name = artist.name,
    image = artist.image,
  } = {}) {
    return clean({
      id,
      name,
      image,
    })
  },

  /**
   * @param {object} [options]
   * @param {boolean} [options.allowEmpty]
   * @param {boolea} [options.includeId]
   * @param {string} [options.id]
   * @param {string} [options.name]
   * @param {object} [options.image]
   */
  app_person({
    allowEmpty,
    includeId,
    id = generateId(includeId),
    name = randFullName(),
    image = {url: randAvatar()},
  } = {}) {
    return clean({
      id,
      name,
      image
    })
  },

  /**
   * @param {object} [options]
   * @param {boolean} [options.allowEmpty]
   * @param {boolean} [options.includeId]
   * @param {number} [options.id]
   * @param {object} [options.venue] - A venue object from `fake.venue()`
   * @param {string} [options.name]
   * @param {object} [options.image]
   */
  app_venue({
    allowEmpty,
    includeId,
    id = generateId(includeId),
    venue = fake.venue(),
    name = venue.name,
    image = venue.image,
  } = {}) {
    return clean({id, name, image});
  },

  /**
   * @param {object} [options]
   * @param {boolean} [options.allowEmpty]
   * @param {boolean} [options.includeId]
   * @param {number} [options.id]
   * @param {number} [options.id]
   * @param {object} [options.dealStructure] - Item from DEAL_STRUCTURES
   * @param {string} [options.name]
   * @param {string} [options.description]
   */
  app_deal_structure({
    allowEmpty,
    includeId,
    id = generateId(includeId),
    dealStructure = rand(DEAL_STRUCTURES),
    name = dealStructure.name,
    description = dealStructure.description,
  } = {}) {
    return clean({id, name, description});
  },

  /**
   * @param {object} [options]
   * @param {string} [options.comment]
   * @param {string} [options.value]
   */
  app_deal_status_type: ({
    comment = fake.dealStatus(),
    value = comment.toUpperCase(),
  } = {}) => clean({
    comment,
    value,
  }),

  /**
   * @param {object} [options]
   * @param {string} [options.comment]
   * @param {string} [options.value]
   */
  app_deal_event_type: ({
    type = fake.dealEventType(),
    comment = type.comment,
    value = type.value,
  } = {}) => clean({
    comment,
    value,
  }),

  /**
   * @param {object} [options]
   * @param {string} [options.comment]
   * @param {string} [options.value]
   */
  app_deal_event_billing_type: ({
    type = fake.dealEventBillingType(),
    comment = type.comment,
    value = type.value,
  } = {}) => clean({
    comment,
    value,
  }),

  /**
   * @param {object} [options]
   * @param {boolean} [options.includeId]
   * @param {boolean} [options.allowEmpty]
   * @param {string} [options.id]
   * @param {string} [options.date]
   * @param {object} [options.buyer]
   * @param {object} [options.copromoter]
   * @param {object} [options.venue]
   */
  app_deal_event: ({
    includeId,
    allowEmpty,
    id = generateId(includeId),
    date = randFutureDate().toISOString(),
    buyer = generateGraphQL.app_person({allowEmpty, includeId}),
    copromoter = generateGraphQL.app_person({allowEmpty, includeId}),
    venue = generateGraphQL.app_venue({allowEmpty, includeId})
  } = {}) => clean({
    id,
    date,
    buyer,
    copromoter,
    venue
  }),

  /**
   * @param {object} [options]
   * @param {boolean} [options.allowEmpty]
   * @param {boolean} [options.includeId]
   * @param {number} [options.id]
   * @param {object} [options.artist]
   * @param {object} [options.deal_event_type]
   * @param {object} [options.deal_event_billing_type]
   * @param {object[]} [options.events]
   * @param {object[]} [options.deal_venues]
   * @param {string[]} [options.dates]
   * @param {string} [options.status]
   * @param {object[]} [options.ticket_scalings]
   * @param {object[]} [options.show_schedules]
   * @param {object[]} [options.performance_schedules]
   * @param {object[]} [options.expenses]
   * @param {string} [options.updated_at]
   */
  app_deal({
    allowEmpty,
    includeId,
    eventCount = 1,
    venueCount               = randNumber({min: 1, max: 3}),
    ticketCount              = randNumber({min: allowEmpty ? 0 : 1, max: 10}),
    showScheduleCount        = randNumber({min: allowEmpty ? 0 : 1, max: 10}),
    performanceScheduleCount = randNumber({min: allowEmpty ? 0 : 1, max: 10}),
    expenseCount             = randNumber({min: allowEmpty ? 0 : 1, max: 10}),

    id     = generateId(includeId),
    deal_status_type = generateGraphQL.app_deal_status_type({allowEmpty, includeId}),
    deal_event_type = generateGraphQL.app_deal_event_type({allowEmpty, includeId}),
    deal_event_billing_type = generateGraphQL.app_deal_event_billing_type({allowEmpty, includeId}),
    artist = generateGraphQL.app_artist({allowEmpty, includeId}),
    events = listOf(
      eventCount,
      () => generateGraphQL.app_deal_event({allowEmpty, includeId})
    ),
    ticket_scalings = listOf(ticketCount, () => generateGraphQL.app_ticket_scaling({allowEmpty, includeId})),
    show_schedules = listOf(showScheduleCount,        () => generateGraphQL.app_show_schedule({allowEmpty, includeId})),
    // TODO At least one of the artists on the performance schedule needs
    // to be the artist passed above.
    performance_schedules = listOf(performanceScheduleCount, () => generateGraphQL.app_performance_schedule({allowEmpty, includeId})),
    expenses = listOf(expenseCount, () => generateGraphQL.app_expense({allowEmpty, includeId})),
    updated_at = randPastDate().toISOString(),
  } = {}) {
    return clean({
      id,
      artist,
      deal_status_type,
      deal_event_type,
      deal_event_billing_type,
      events,
      ticket_scalings,
      show_schedules,
      performance_schedules,
      expenses,
      updated_at,
    })
  }
}
