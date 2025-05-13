import React from 'react'

import {
  ApolloClient,
  ApolloLink,
  Observable,
  ApolloCache,
  DocumentNode,
} from '@apollo/client';
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { RetryLink } from '@apollo/client/link/retry';
import { ServiceBase } from '@thesoulfresh/utils';

import { env } from '~/env';
import type {
  Deal,
  ShowSchedule,
  TicketScaling,
  PerformanceSchedule,
  Expense,
  Artist,
  EventType,
  EventBillingType,
} from './types';
import { LoggingLink, makeGraphQLErrorLink } from '../graphql-utils';
import { fromGraphQL, toGraphQL, prepareNestedRelationships } from './transform';
import { makeGraphQLServiceCacheClient } from './cache';
import { clean, replaceOrInsertItems, ReplayableAction } from '~/utils';

import * as graph from './GraphQLService.queries';

/**
 * Prepare an object for the graph by nesting any relationships and removing
 * undefined values so they don't throw errors.
 */
export function prepareForGraph(v: Bag) {
  return prepareNestedRelationships( clean( v ) );
}

/**
 * Update a property of a cached deal.
 */
function updateDealCache(
  /**
   * The cache object provided by the Apollo mutation update function.
   */
  cache: any,
  /**
   * The mutation result on the response object provided by the Apollo mutation
   * update function (ex.  response.data.insert_app_show_schedule)
   */
  insert: {affected_rows: number, returning: any},
  /**
   * The id of the deal being updated in cache.
   */
  dealId: string,
  /**
   * The property on the cached deal that needs to be updated.
   */
  property: string
) {
  if (insert.affected_rows > 0) {
    // Update the deal list query cache.
    cache.updateQuery(
      {query: graph.GET_DEALS},
      (data: any) => {
        if (data && data.app_deal?.length) {
          const index = data.app_deal.findIndex((d: Deal) => d.id === dealId)
          const deal = {...data.app_deal[index]}
          const updated = {
            ...deal,
            [property]: !Array.isArray(insert.returning)
              ? insert.returning
              : replaceOrInsertItems(
                deal[property],
                insert.returning,
                (a: {id: string}, b: {id: string}) => a.id === b.id,
              )
          }
          const deals = [...data.app_deal]
          deals.splice(index, 1, updated)
          return { app_deal: deals }
        }
      }
    )

    // Update deal details query cache.
    cache.updateQuery(
      {query: graph.GET_DEAL, variables: {dealId}},
      (data: any) => {
        if (data && data.app_deal?.length) {
          const deal = data.app_deal[0];
          return {
            app_deal: [{
              ...deal,
              [property]: !Array.isArray(insert.returning)
                ? insert.returning
                : replaceOrInsertItems(
                    deal[property],
                    insert.returning,
                    (a: {id: string}, b: {id: string}) => a.id === b.id,
                  )
            }]
          }
        }
      }
    )
  }
}

interface GraphQLServiceOptions {
  onAuthFailure?: () => void
  authToken?: string
  client?: ApolloClient<any> | any
  url?: string,
  debug?: boolean
}

/*
 * Use this class to make GraphQL requests.
 *
 * Global error handling is taken care of
 * by the Apollo client configuration.
 */
export class GraphQLService extends ServiceBase {
  constructor({
    onAuthFailure,
    authToken,
    client,
    url = (env as any).graphqlUrl,
    debug = env.verbose,
  }: GraphQLServiceOptions) {
    /* istanbul ignore next: never use the live api during testing */
    if (!client) {
      const retry = new RetryLink()

      // Use a batching HttpLink so we can combine multiple requests into a
      // single HTTP call if they happen within a few milliseconds of each
      // other.
      const http = new BatchHttpLink({
        uri: url,
        headers: {
          Authorization: `Bearer ${authToken}`,
          //todo: get auth0 integration working
          'x-hasura-admin-secret': 'developer',
        },
        // No more than 5 operations per batch
        batchMax: 5,
        // Wait no more than 20ms after first batched operation
        batchInterval: 20,
      });

      const errorLink = makeGraphQLErrorLink(onAuthFailure)

      const links = [errorLink, retry, http]

      if (debug) links.unshift(new LoggingLink())

      client = new ApolloClient({
        link: ApolloLink.from(links),
        cache: makeGraphQLServiceCacheClient(),
        connectToDevTools: !env.test && !env.production,
      })
    }

    super(client, (client as any).debug ?? debug)

    this.info('created with API', (env as any).exampleGraphAPI)
  }

  /**
   * Clear the data cache (for example after logout).
   * Returns a promise that will resolve after the
   * cache has been cleared.
   *
   * For more info, see:
   * https://www.apollographql.com/docs/react/caching/cache-interaction/#resetting-the-store
   */
  clearStore() {
    return this.client.clearStore()
  }

  /**
   * Get application level configuration that is stored in the backend.
   */
  getAppConfig() {
    this.debug('getAppConfig')
    return this.client
      .query({
        query: graph.GET_APP_CONFIG,
      })
      .then((results: any) => {
        const ticketTypes = results.data.app_ticket_type || [];
        const expenseTypes = results.data.app_expense_type || [];
        const eventTypes = results.data.app_deal_event_type || [];
        const billingTypes = results.data.app_deal_event_billing_type || [];
        const out = {
          TICKET_TYPES: ticketTypes.map((t: Bag) => fromGraphQL.app_ticket_type(t)),
          EXPENSE_TYPES: expenseTypes.map((t: Bag) => fromGraphQL.app_expense_type(t)),
          EVENT_TYPES: eventTypes.map((t: Bag) => fromGraphQL.app_deal_event_type(t)),
          EVENT_BILLING_TYPES: billingTypes.map((t: Bag) => fromGraphQL.app_deal_event_billing_type(t)),
        }
        this.debug('getAppConfig SUCCESS', out);
        return out;
      })
  }

  /**
   * Get the list of all deal summaries this user has access to.
   */
  getDeals() {
    this.debug('getDeals', arguments)

    return this.client
      .query({
        query: graph.GET_DEALS,
      })
      .then((response: any) => {
        const deals = response.data.app_deal
        // Transform the data into the format used by the UI
        const out = deals?.map((d: Bag) => fromGraphQL.app_deal(d)) || []
        this.debug('getDeals SUCCESS', out)
        return out
      })
  }

  /**
   * Watch the list of deals from the backend.
   */
  watchDeals() {
    return new Observable(o => this.client.watchQuery({
      query: graph.GET_DEALS,
      fetchResults: true,
      fetchPolicy: 'cache-first',
    }).subscribe({
      next: (response: any) => {
        const deals = response.data.app_deal
        const out = deals?.map(( d: Bag ) => fromGraphQL.app_deal(d)) || []
        this.info('watchItems NEXT >', out);
        o.next(out);
      },
      error: (err: Error) => o.error(err),
    }));
  }

  /**
   * Create an empty 'PENDING' deal on the backend. This will give you a deal
   * object with id that you can configure with deal properties during the
   * create deal flow.
   */
  async createEmptyDeal() {
    this.debug('createEmptyDeal');

    const response = await this.client.mutate({
      mutation: graph.CREATE_EMPTY_DEAL,
      update: (cache: any, response: any) => {
        const insert = response.data.insert_app_deal;
        if (insert.affected_rows > 0) {
          const deal = insert.returning[0];

          // Update the GET_DEALS query cache to include the deal we just
          // created.
          try {
            cache.updateQuery(
              {query: graph.GET_DEALS},
              (data: {app_deal: Deal[]}) => ({
                app_deal: [...data.app_deal, deal],
              })
            );
          } catch(e) {
            // If we got here, it's because we haven't requested an deals yet.
            this.debug('createEmptyDeal failed to update cache ->', e);
          }
        }
      }
    });

    const insert = response.data.insert_app_deal
    if (insert.affected_rows > 0) {
      const out = fromGraphQL.app_deal(insert.returning[0]);
      this.debug('createEmptyDeal SUCCESS', out);
      return out;
    } else {
      throw new Error('Failed to create empty deal');
    }
  }

  /**
   * Delete the given deal.
   */
  async deleteDeal(id: string) {
    this.debug('deleteDeal', ...arguments);

    const response = await this.client.mutate({
      mutation: graph.DELETE_DEAL,
      variables: {id},
      // TODO Optimistic updates
      update: (cache: any) => {
        cache.evict({ id: `app_deal:${id}` });
        cache.gc();
      },
    });

    if (response.data.delete_app_deal.affected_rows === 1) {
      this.debug('deleteDeal SUCCESS', id);
      return true;
    } else {
      throw new Error(`Failed to delete deal "${id}"`);
    }
  }

  /**
   * Get the details for a single deal.
   */
  async getDeal(id: string) {
    this.debug('getDeal', ...arguments);

    const variables = {id}

    const response = await this.client.query({
      query: graph.GET_DEAL,
      variables
    });

    const deals = response.data.app_deal;
    if (deals.length) {
      const out = fromGraphQL.app_deal(deals[0]);
      this.debug('getDeal SUCCESS', out);
      return out;
    }

    this.warn('getDeal FAILED: Returned 0 deals.', response);
    return undefined
  }

  /**
   * Watch the given deal for updates.
   */
  watchDeal(id: string) {
    this.debug('watchDeal', ...arguments);

    return new Observable(o => this.client.watchQuery({
      query: graph.GET_DEAL,
      variables: {id},
      fetchResults: true,
      fetchPolicy: 'cache-first',
    }).subscribe({
      next: (response: any) => {
        const deals = response.data.app_deal
        if (deals.length) {
          const out = fromGraphQL.app_deal(deals[0]);
          this.info('watchDeal NEXT >', out);
          o.next(out);
        }
      },
      error: ( err: Error ) => o.error(err),
    }));
  }

  /**
   * A generic function for deleting items from an array relationship of a deal.
   * For example, deleting tickets on a deal or performance schedule rows.
   */
  async deleteDealItems<Type extends {id: any}>(
    /**
     * The id of the deal.
     */
    id: string,
    /**
     * The list of items to delete.
     */
    items: Type[],
    /**
     * The delete query. This should be a document defined in the
     * `GraphQLService.queries` file (ex. `graph.DELETE_DEAL_TICKETS`).
     */
    query: DocumentNode,
    /**
     * The GraphQL type being deleted. This should be a string representing one
     * of the deal relationship types defined in `GraphQLService.schema.graphql`
     * like 'app_ticket_scaling'.
     */
    graphType: keyof typeof toGraphQL,
    /**
     * The GraphQL action type being performed. This should be a string
     * representing one of the action types definined in
     * `GraphQLService.schema.graphql` like 'delete_app_ticket_scaling'.
     */
    graphAction = `delete_${graphType}`,
    /**
     * An optional callback that can be used to customize the items returned in
     * the optimistic update. For example, when deleting ticket scaling rows on
     * a deal, we want the returned tickets to include the ticket scaling "type"
     * object relationship but we want to pass the "ticket_type_id" in the items
     * param to this function.
     */
    toGraph = (i: any) => toGraphQL[graphType](i as any)
  ) {
    const response = await this.client.mutate({
      mutation: query,
      variables: {
        items: items.map(i => i.id),
      },
      update: (cache: ApolloCache<any>) => {
        try {
          items.forEach(item => {
            cache.evict({id: `${graphType}:${item.id}`});
          });
          cache.gc();
        } catch(e) {
          this.warn(`Failed to update the ${graphType} cache`, e);
        }
      },
      optimisticResponse: {
        [graphAction]: {
          affected_rows: items.length,
          returning: items.map(toGraph)
        }
      },
    });

    const result = response.data[graphAction];
    if (result.affected_rows > 0) {
      return result.returning.map((s: Bag) => fromGraphQL[graphType](s))
    }
    return [];
  }

  /**
   * A generic function for upserting items in an array relationship of a deal.
   * For example, inserting or updating deal ticket scaling rows.
   */
  async upsertDealItems<Type>(
    /**
     * The id of the deal.
     */
    id: string,
    /**
     * The list of items to delete.
     */
    items: Type[],
    /**
     * The upsert query. This should be a document defined in the
     * `GraphQLService.queries` file (ex. `graph.UPSERT_DEAL_TICKETS`).
     */
    mutation: DocumentNode,
    /**
     * The property on the deal being edited. This is the property as it's named
     * in GraphQL (ex. 'ticket_scalings').
     */
    property: string,
    /**
     * The GraphQL type being upserted. This should be a string representing one
     * of the deal relationship types defined in `GraphQLService.schema.graphql`
     * like 'app_ticket_scaling'.
     */
    graphType: keyof typeof toGraphQL,
    /**
     * The GraphQL action type being performed. This should be a string
     * representing one of the action types definined in
     * `GraphQLService.schema.graphql` like 'insert_app_ticket_scaling'.
     */
    graphAction = `insert_${graphType}`,
    /**
     * An optional callback that can be used to customize the items returned in
     * the optimistic update. For example, when upserting ticket scaling rows on
     * a deal, we want the returned tickets to include the ticket scaling "type"
     * object relationship but we want to pass the "ticket_type_id" in the items
     * param to this function. By passing this function, you can customize the
     * optimistic data returned. This is optional if there are no object
     * relationships you need to return.
     */
    toGraph = (i: any) => toGraphQL[graphType](i, id),
  ) {
    const response = await this.client.mutate({
      mutation: mutation,
      variables: {
        items: items.map((s: any) =>
          prepareForGraph(
            toGraphQL[graphType](s, id)
          )
        )
      },
      update: (cache: any, response: any) => {
        try {
          const insert = response.data[graphAction];
          updateDealCache(cache, insert, id, property);
        } catch(e) {
          this.warn(`Failed to update the ${graphType} cache`, e);
        }
      },
      optimisticResponse: {
        [graphAction]: {
          affected_rows: items.length,
          returning: items.map(toGraph),
        }
      }
    });

    const results = response.data[graphAction];
    if (results.affected_rows > 0) {
      return results.returning.map((s: Bag) => fromGraphQL[graphType](s));
    }
    return [];
  }

  // getCachedDeal(id) {
  //   const { items } = this.client.readQuery({
  //     query: graph.GET_DEAL,
  //     variables: {id}
  //   });
  //
  //   // Add the new item to the collection.
  //   return (items && items.length > 0)
  //     ? items[0]
  //     : null;
  // }

  async upsertDealArtist(dealId: string, artist: Artist) {
    this.debug('upsertDealArtist', ...arguments)

    const response = await this.client.mutate({
      mutation: graph.UPSERT_DEAL_ARTIST,
      variables: {dealId, artistId: artist.id},
      update: (cache: any, response: any) => {
        try {
          const insert = response.data.update_app_deal
          updateDealCache(
            cache,
            {...insert, returning: {...artist, __typename: 'app_artist'}},
            dealId,
            'artist'
          )
        } catch(e) {
          this.warn(`Failed to update the cache`, e);
        }
      },
      optimisticResponse: {
        update_app_deal: { affected_rows: 1 }
      }
    })

    if (response.data?.update_app_deal?.affected_rows > 0) {
      this.info('upsertDealArtist SUCCESS', artist);
      return artist
    } else {
      this.warn('upsertDealArtist FAILED: Mutation affected 0 rows.');
    }
  }

  async deleteDealArtist(dealId: string, artist: Artist) {
    this.debug('deleteDealArtist', ...arguments)

    const response = await this.client.mutate({
      // Just use the upsert query with a null artist id.
      mutation: graph.UPSERT_DEAL_ARTIST,
      variables: {dealId, artistId: null},
      update: (cache: any, response: any) => {
        try {
          const insert = response.data.update_app_deal
          updateDealCache(cache, {...insert, returning: null}, dealId, 'artist')
        } catch(e) {
          this.warn(`Failed to update the cache`, e);
        }
      },
      optimisticResponse: {
        update_app_deal: { affected_rows: 1 }
      }
    })

    if (response.data?.update_app_deal?.affected_rows > 0) {
      this.info('deleteDealArtist SUCCESS', artist);
      return null
    } else {
      this.warn('deleteDealArtist FAILED: Mutation affected 0 rows.');
    }
  }

  async upsertDealEventType(dealId: string, eventType: EventType) {
    this.debug('upsertDealEventType', ...arguments)

    const response = await this.client.mutate({
      mutation: graph.UPSERT_DEAL_EVENT_TYPE,
      variables: {dealId, eventType: eventType.value},
      update: (cache: any, response: any) => {
        try {
          const insert = response.data.update_app_deal
          updateDealCache(cache, {...insert, returning: eventType}, dealId, 'event_type')
        } catch(e) {
          this.warn(`Failed to update the cache`, e);
        }
      },
      optimisticResponse: {
        update_app_deal: { affected_rows: 1 }
      }
    })

    if (response.data?.update_app_deal?.affected_rows > 0) {
      this.info('upsertDealEventType SUCCESS', eventType);
      return eventType
    } else {
      this.warn('upsertDealEventType FAILED: Mutation affected 0 rows.');
    }
  }

  async deleteDealEventType(dealId: string, eventType: EventType) {
    this.debug('deleteDealEventType', ...arguments)

    const response = await this.client.mutate({
      // Just use the upsert query with a null artist id.
      mutation: graph.UPSERT_DEAL_EVENT_TYPE,
      variables: {dealId, eventType: null},
      update: (cache: any, response: any) => {
        try {
          const insert = response.data.update_app_deal
          updateDealCache(cache, {...insert, returning: null}, dealId, 'event_type')
        } catch(e) {
          this.warn(`Failed to update the cache`, e);
        }
      },
      optimisticResponse: {
        update_app_deal: { affected_rows: 1 }
      }
    })

    if (response.data?.update_app_deal?.affected_rows > 0) {
      this.info('deleteDealEventType SUCCESS', eventType);
      return null
    } else {
      this.warn('deleteDealEventType FAILED: Mutation affected 0 rows.');
    }
  }

  async upsertDealEventBillingType(dealId: string, billingType: EventBillingType) {
    this.debug('upsertDealEventBillingType', ...arguments)

    const response = await this.client.mutate({
      mutation: graph.UPSERT_DEAL_EVENT_BILLING_TYPE,
      variables: {dealId, billingType: billingType.value},
      update: (cache: any, response: any) => {
        try {
          const insert = response.data.update_app_deal
          updateDealCache(cache, {...insert, returning: billingType}, dealId, 'event_billing_type')
        } catch(e) {
          this.warn(`Failed to update the cache`, e);
        }
      },
      optimisticResponse: {
        update_app_deal: { affected_rows: 1 }
      }
    })

    if (response.data?.update_app_deal?.affected_rows > 0) {
      this.info('upsertDealEventBillingType SUCCESS', billingType);
      return billingType
    } else {
      this.warn('upsertDealEventBillingType FAILED: Mutation affected 0 rows.');
    }
  }

  async deleteDealEventBillingType(dealId: string, billingType: EventBillingType) {
    this.debug('deleteDealEventBillingType', ...arguments)

    const response = await this.client.mutate({
      // Just use the upsert query with a null artist id.
      mutation: graph.UPSERT_DEAL_EVENT_BILLING_TYPE,
      variables: {dealId, billingType: null},
      update: (cache: any, response: any) => {
        try {
          const insert = response.data.update_app_deal
          updateDealCache(cache, {...insert, returning: null}, dealId, 'event_billing_type')
        } catch(e) {
          this.warn(`Failed to update the cache`, e);
        }
      },
      optimisticResponse: {
        update_app_deal: { affected_rows: 1 }
      }
    })

    if (response.data?.update_app_deal?.affected_rows > 0) {
      this.info('deleteDealEventBillingType SUCCESS', billingType);
      return null
    } else {
      this.warn('deleteDealEventBillingType FAILED: Mutation affected 0 rows.');
    }
  }

  /**
   * Upsert the given list of tickets to a deal object.
   */
  async upsertDealTickets(
    /**
     * The id of the deal being modified.
     */
    id: string,
    /**
     * The list of tickets to upsert.
     */
    tickets: TicketScaling[]
  ) {
    this.debug('upsertDealTickets', ...arguments);

    const results = await this.upsertDealItems(
      id,
      tickets,
      graph.UPSERT_DEAL_TICKETS,
      'ticket_scalings',
      'app_ticket_scaling',
      'insert_app_ticket_scaling',
      (t: TicketScaling) => ({
        ...toGraphQL.app_ticket_scaling(t, id),
        // Additional relationships to merge in...
        type: toGraphQL.app_ticket_type(t.type),
      })
    )

    if (results.length) {
      this.debug('upsertDealTickets SUCCESS', results);
      return results;
    } else {
      this.warn('upsertDealTickets FAILED: Mutation affected 0 rows.');
    }
  }

  /**
   * Delete tickets associated with a deal.
   */
  async deleteDealTickets(id: string, tickets: TicketScaling[]) {
    this.debug('deleteDealTickets:', ...arguments);

    const results = await this.deleteDealItems<TicketScaling>(
      id,
      tickets,
      graph.DELETE_DEAL_TICKETS,
      'app_ticket_scaling',
      'delete_app_ticket_scaling',
      (t: TicketScaling) => ({
        ...toGraphQL.app_ticket_scaling(t, id),
        // Additional relationships to merge in...
        type: toGraphQL.app_ticket_type(t.type),
      })
    );

    if (results.length) {
      this.debug('deleteTickets SUCCESS', results);
      return results;
    } else {
      this.warn('deleteTickets FAILED: Mutation affected 0 rows.', results);
      // TODO Is it better to return undefined or an empty array or throw an error?
    }
  }

  /**
   * Upsert the given list of show schedules on a deal.
   */
  async upsertShowScheduleItems(id: string, schedules: ShowSchedule[]) {
    this.debug('upsertShowScheduleItems', ...arguments);

    const results = await this.upsertDealItems(
      id,
      schedules,
      graph.UPSERT_SHOW_SCHEDULES,
      'show_schedules',
      'app_show_schedule'
    )

    if (results.length) {
      this.debug('upsertShowScheduleItems SUCCESS', results);
      return results;
    } else {
      this.warn('upsertShowScheduleItems FAILED: Mutation affected 0 rows.');
    }
  }

  async deleteShowScheduleItems(id: string, items: ShowSchedule[]) {
    this.debug('deleteShowScheduleItems', ...arguments);

    const results = await this.deleteDealItems<ShowSchedule>(
      id,
      items,
      graph.DELETE_SHOW_SCHEDULE_ITEMS,
      'app_show_schedule',
      'delete_app_show_schedule'
    );

    if (results.length) {
      this.debug('deleteShowScheduleItems SUCCESS', results);
      return results;
    } else {
      this.warn('deleteShowScheduleItems FAILED: Mutation affected 0 rows.', results);
    }
  }

  async upsertPerformanceScheduleItems(id: string, schedules: PerformanceSchedule[]) {
    this.debug('upsertPerformanceScheduleItems', ...arguments)

    const results = await this.upsertDealItems(
      id,
      schedules,
      graph.UPSERT_PERFORMANCE_SCHEDULES,
      'performance_schedules',
      'app_performance_schedule'
    )

    if (results.length) {
      this.debug('upsertPerformanceScheduleItems SUCCESS', results);
      return results;
    } else {
      this.warn('upsertPerformanceScheduleItems FAILED: Mutation affected 0 rows.');
    }
  }

  async deletePerformanceScheduleItems(id: string, items: PerformanceSchedule[]) {
    this.debug('deletePerformanceScheduleItems', ...arguments);

    const results = await this.deleteDealItems<PerformanceSchedule>(
      id,
      items,
      graph.DELETE_PERFORMANCE_SCHEDULE_ITEMS,
      'app_performance_schedule',
    );

    if (results.length) {
      this.debug('deletePerformanceScheduleItems SUCCESS', results);
      return results;
    } else {
      this.warn('deletePerformanceScheduleItems FAILED: Mutation affected 0 rows.', results);
    }
  }

  async upsertExpenses(id: string, expenses: Expense[]) {
    this.debug('upsertExpenses', ...arguments)

    const results = await this.upsertDealItems(
      id,
      expenses,
      graph.UPSERT_EXPENSES,
      'expenses',
      'app_expense',
      'insert_app_expense',
      (i: Expense) => ({
        ...toGraphQL.app_expense(i, id),
        type: i.type || null,
      })
    )

    if (results.length) {
      this.debug('upsertExpenses SUCCESS', results);
      return results;
    } else {
      this.warn('upsertExpenses FAILED: Mutation affected 0 rows.');
    }
  }

  async deleteExpenses(id: string, expenses: Expense[]) {
    this.debug('deleteExpenses', ...arguments);

    const results = await this.deleteDealItems(
      id,
      expenses,
      graph.DELETE_EXPENSES,
      'app_expense',
      'delete_app_expense',
      (i: Expense) => ({
        ...toGraphQL.app_expense(i, id),
        type: i.type || null,
      })
    );

    if (results.length) {
      this.debug('deleteExpenses SUCCESS', results);
      return results;
    } else {
      this.warn('deleteExpenses FAILED: Mutation affected 0 rows.', results);
    }
  }

  /**
   * Update a batch of objects in GraphQL.
   */
  batchUpdateDeal(
    /**
     * The id of the deal being updated.
     */
    id: string,
    /**
     * The list of ReplayableAction objects defining the updates to make.
     */
    batch: ReplayableAction[]
  ) {
    this.debug('batchUpdateDeal', ...arguments);

    return Promise.all(
      batch.map(async (action) => {
        switch (action.property) {
          case 'tickets':
            return action.remove
              ? await this.deleteDealTickets(id, [action.data]).then((r) => ({result: r[0], action}))
              : await this.upsertDealTickets(id, [action.data]).then((r) => ({result: r[0], action}));
          case 'expenses':
            return action.remove
              ? await this.deleteExpenses(id, [action.data]).then((r) => ({result: r[0], action}))
              : await this.upsertExpenses(id, [action.data]).then((r) => ({result: r[0], action}));
          case 'showSchedule':
            return action.remove
              ? await this.deleteShowScheduleItems(id, [action.data]).then(r => ({result: r[0], action}))
              : await this.upsertShowScheduleItems(id, [action.data]).then(r => ({result: r[0], action}));
          case 'performanceSchedule':
            return action.remove
              ? await this.deletePerformanceScheduleItems(id, [action.data]).then(r => ({result: r[0], action}))
              : await this.upsertPerformanceScheduleItems(id, [action.data]).then(r => ({result: r[0], action}));
          case 'artist':
            return action.remove
              ? await this.deleteDealArtist(id, action.data).then((a) => ({result: a, action}))
              : await this.upsertDealArtist(id, action.data).then((a) => ({result: a, action}));
          case 'eventType':
            return action.remove
              ? await this.deleteDealEventType(id, action.data).then((a) => ({result: a, action}))
              : await this.upsertDealEventType(id, action.data).then((a) => ({result: a, action}));
          case 'eventBillingType':
            return action.remove
              ? await this.deleteDealEventBillingType(id, action.data).then((a) => ({result: a, action}))
              : await this.upsertDealEventBillingType(id, action.data).then((a) => ({result: a, action}));
          default:
            console.error(`Unable to save unknow "batchUpdateDeal" property ${action.property}.`, action);
            return Promise.reject();
        }
      })
    )
    // ).then(results => {
    //   console.log('DELAYING...');
    //   return new Promise(resolve => {
    //     setTimeout(() => {
    //       resolve(results)
    //     }, 5000);
    //   })
    // })
  }

  async searchArtists(term: string) {
    this.debug('searchArtists', ...arguments);

    if (!term) {
      this.debug('searchArtists EMPTY SEARCH', []);
      return [];
    }

    const response = await this.client.query({
      query: graph.SEARCH_ARTISTS,
      variables: {term: `%${term}%`}
    });

    const out = response.data.app_artist.map((a: any) => fromGraphQL.app_artist(a));

    this.debug('searchArtists SUCCESS', out);
    return out;
  }

  async searchVenues(term: string) {
    this.debug('searchVenues', ...arguments);

    if (!term) {
      this.debug('searchVenues EMPTY SEARCH', []);
      return [];
    }

    const response = await this.client.query({
      query: graph.SEARCH_VENUES,
      variables: {term: `%${term}%`}
    });

    const out = response.data.app_venue.map((a: any) => fromGraphQL.app_venue(a));

    this.debug('searchVenues SUCCESS', out);
    return out;
  }

  async searchPeople(term: string) {
    this.debug('searchPeople', ...arguments);

    if (!term) {
      this.debug('searchPeople EMPTY SEARCH', []);
      return [];
    }

    const response = await this.client.query({
      query: graph.SEARCH_PEOPLE,
      variables: {term: `%${term}%`}
    });

    const out = response.data.app_person.map((a: any) => fromGraphQL.app_person(a));

    this.debug('searchPeople SUCCESS', out);
    return out;
  }

  // Example of how to get a collection from the cache
  // getCachedItems() {
  //   const { items } = this.client.readQuery({
  //     query: graph.GET_ITEMS,
  //   });
  //   return items;
  // }

  // Example of how to put a collection in the cache
  // updateCachedItems(items) {
  //   this.client.writeQuery({
  //     query: graph.GET_ITEMS,
  //     data: {items},
  //   });
  // }

  // Example of how to get an item from the cache
  // getCachedItem(itemId) {
  //   const { items } = this.client.readQuery({
  //     query: graph.GET_ITEM,
  //     variables: {id: itemId}
  //   });
  //
  //   // Add the new item to the collection.
  //   return (items && items.length > 0)
  //     ? items[0]
  //     : null;
  // }

  // Example of how to put an item in the cache
  // updateCachedItem(itemId, items) {
  //   this.client.writeQuery({
  //     query: graph.GET_ITEM,
  //     variables: {id: itemId},
  //     data: {items: [ items ]},
  //   });
  // }

  // Example of how to observe the cache
  // watchItems() {
  //   return new Observable(o => this.client.watchQuery({
  //     query: graph.GET_ITEMS,
  //     fetchResults: true,
  //     fetchPolicy: 'cache-first',
  //   }).subscribe({
  //     next: results => {
  //       this.log('GET_ITEMS NEXT >', results);
  //
  //       // Transform the data into the format used by the UI
  //       const out = results.data.items.map(fromGraph.item);
  //       this.info('watchItems NEXT >', out);
  //       o.next(out);
  //     },
  //     // NOTE: This error must be bound to `o` correctly.
  //     error: err => o.error(err),
  //   }));
  // }
}

export const GraphQLServiceContext = React.createContext(undefined)
export const GraphQLServiceProvider = GraphQLServiceContext.Provider

export function useGraphQLService() {
  return React.useContext(GraphQLServiceContext)
}
