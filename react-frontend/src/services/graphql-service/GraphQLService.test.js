import { GraphQLService, prepareForGraph } from './GraphQLService'
import { makeGraphQLServiceCacheClient } from './cache'
import { makeGraphQLErrorLink } from '../graphql-utils'
import { createGraphQLServiceMockClient } from './mocks'
import { listOf, mostRecentCall } from '~/test';
import { toGraphQL } from './transform';
import { generate } from '~/services/test-generator';

// These tests require a schema.
describe('GraphQLService', () => {
  let onAuthFailure

  const debug = false;
  const build = (options = {}) => {
    const client = createGraphQLServiceMockClient({
      errorLink: makeGraphQLErrorLink(onAuthFailure),
      cache: makeGraphQLServiceCacheClient(),
      generatorOptions: {includeId: true, allowEmpty: false, ...options},
      debug,
    })

    jest.spyOn(client, 'query')
    jest.spyOn(client, 'mutate')
    jest.spyOn(client, 'clearStore')

    return new GraphQLService({ client, debug })
  }

  beforeEach(() => {
    onAuthFailure = jest.fn()
  });

  describe('clear', () => {
    it('should clear the Apollo cache.', () => {
      const api = build()
      api.clearStore();

      expect(api.client.clearStore).toHaveBeenCalledTimes(1)
    })
  });

  describe('getAppConfig', () => {
    xit('should be able to get the application config stored in GraphQL.', () => {});
  });

  describe('getDeals', () => {
    it('should be able to get all deals for the user.', async () => {
      const dealCount = 3;
      const api = build({dealCount});
      const result = await api.getDeals();

      expect(api.client.query).toHaveBeenCalledTimes(1);

      expect(result.length).toEqual(dealCount);
      result.forEach(r => {
        expect(r).toBeADealSummary();
      });
    });
  });

  describe('watchDeals', () => {
    xit('should be able to get deals from the backend.', () => {});
    xit('should return updated deals when the deal cache changes.', () => {});
  });

  describe('getDeal', () => {
    xit('should be able to get the full details for a deal.', () => {});
  });

  describe('createEmptyDeal', () => {
    xit('should be able to create an empty deal record.', () => {});
  });

  describe('deleteDeal', () => {
    xit('should be able to delete a deal record.', () => {});
  });

  describe('upsertDealTickets', () => {
    it('should be able to add a new ticket to a deal.', async () => {
      const dealId = 'abc123';
      const tickets = listOf(3, t => generate.app_ticket_scaling(t));
      const api = build({includeId: false});
      const result = await api.upsertDealTickets(dealId, tickets);

      expect(api.client.mutate).toHaveBeenCalledTimes(1);
      expect(api.client.mutate).toHaveBeenCalledWith(expect.objectContaining({
        variables: {
          items: expect.any(Array),
        }
      }));


      const ticketVariables = mostRecentCall(api.client.mutate)[0].variables.items;
      // Ensure that toGraphQL is called
      expect(ticketVariables[0]).toEqual(prepareForGraph(
        toGraphQL.app_ticket_scaling(tickets[0], dealId)
      ));
      // Ensure the deal id was specified for each ticket.
      expect(ticketVariables[0]).toEqual(expect.objectContaining({
        deal_id: dealId,
      }));

      expect(result.length).toEqual(tickets.length);
      result.forEach(r => {
        expect(r).toBeATicketScaling();
      });
    });

    it('should only save properties that are set.', async () => {
      const dealId = 'abc123';
      const type = generate.app_ticket_type();
      const tickets = [{
        type,
        capacity: 100,
        price: null,
        charity: undefined,
      }];
      const api = build({includeId: false});
      const result = await api.upsertDealTickets(dealId, tickets);

      expect(api.client.mutate).toHaveBeenCalledTimes(1);
      expect(api.client.mutate).toHaveBeenCalledWith(expect.objectContaining({
        variables: {
          items: expect.any(Array),
        }
      }));


      const ticketVariables = mostRecentCall(api.client.mutate)[0].variables.items;
      // Ensure that only the properties passed are saved to the graph.
      expect(ticketVariables[0]).toEqual({
        deal_id: dealId,
        ticket_type: type.value,
        capacity: 100,
        price:null,
      });

      expect(result.length).toEqual(tickets.length);
      result.forEach(r => {
        expect(r).toBeATicketScaling();
      });
    });
  });

  describe('deleteDealTickets', () => {
    it('should be able to delete a ticket on a deal', async () => {
      const dealId = 'abc123';
      const tickets = [
        generate.app_ticket_scaling({includeId: true}),
        generate.app_ticket_scaling({includeId: true}),
        generate.app_ticket_scaling({includeId: true}),
      ];
      const api = build({includeId: false});
      const response = await api.deleteDealTickets(dealId, tickets);

      expect(api.client.mutate).toHaveBeenCalledTimes(1);
      expect(api.client.mutate).toHaveBeenCalledWith(expect.objectContaining({
        variables: {
          items: tickets.map(t => t.id),
        }
      }));

      expect(response).toEqual(expect.any(Array));
      expect(response.length).toEqual(tickets.length);
      response.forEach((ticket) => {
        expect(ticket).toBeATicketScaling();
      });
    });
  });

  describe('upsertExpenses', () => {
    it('should be able to update the expenses for a deal.', async () => {
      const dealId = 'abc123';
      const expenses = [
        generate.app_expense({includeId: true}),
        generate.app_expense({includeId: true}),
        // Insert a new item
        generate.app_expense({includeId: false}),
      ];
      const api = build({includeId: false});
      const response = await api.upsertExpenses(dealId, expenses);

      expect(api.client.mutate).toHaveBeenCalledTimes(1);
      expect(api.client.mutate).toHaveBeenCalledWith(expect.objectContaining({
        variables: {
          items: expect.any(Array),
        }
      }));

      expect(response).toEqual(expect.any(Array));
      expect(response.length).toEqual(expenses.length);
      expect(response[2].id).toBeDefined();
      response.forEach((item) => {
        expect(item).toBeAnExpense();
      })
    })
  })

  describe('deleteExpenses', () => {
    it('should be able to delete expenses on a deal.', async () => {
      const dealId = 'abc123';
      const expenses = [
        generate.app_expense({includeId: true}),
        generate.app_expense({includeId: true}),
        generate.app_expense({includeId: true}),
      ];
      const api = build({includeId: false});
      const response = await api.deleteExpenses(dealId, expenses);

      expect(api.client.mutate).toHaveBeenCalledTimes(1);
      expect(api.client.mutate).toHaveBeenCalledWith(expect.objectContaining({
        variables: {
          items: expenses.map(s => s.id)
        }
      }));

      expect(response).toEqual(expect.any(Array));
      expect(response.length).toEqual(expenses.length);
      response.forEach((item) => {
        expect(item).toBeAnExpense();
      });
    });
  });

  describe('upsertShowScheduleItems', () => {
    it('should be able to update the show schedule for a deal.', async () => {
      const dealId = 'abc123';
      const schedule = [
        generate.app_show_schedule({includeId: true}),
        generate.app_show_schedule({includeId: true}),
        // Insert a new item
        generate.app_show_schedule({includeId: false}),
      ];
      const api = build({includeId: false});
      const response = await api.upsertShowScheduleItems(dealId, schedule);

      expect(api.client.mutate).toHaveBeenCalledTimes(1);
      expect(api.client.mutate).toHaveBeenCalledWith(expect.objectContaining({
        variables: {
          items: expect.any(Array),
        }
      }));

      expect(response).toEqual(expect.any(Array));
      expect(response.length).toEqual(schedule.length);
      expect(response[2].id).toBeDefined();
      response.forEach((item) => {
        expect(item).toBeAShowSchedule();
      })
    });
  });

  describe('deleteShowScheduleItems', () => {
    it('should be able to delete the show schedule for a deal.', async () => {
      const dealId = 'abc123';
      const schedule = [
        generate.app_show_schedule({includeId: true}),
        generate.app_show_schedule({includeId: true}),
        generate.app_show_schedule({includeId: true}),
      ];
      const api = build({includeId: false});
      const response = await api.deleteShowScheduleItems(dealId, schedule);

      expect(api.client.mutate).toHaveBeenCalledTimes(1);
      expect(api.client.mutate).toHaveBeenCalledWith(expect.objectContaining({
        variables: {
          items: schedule.map(s => s.id)
        }
      }));

      expect(response).toEqual(expect.any(Array));
      expect(response.length).toEqual(schedule.length);
      response.forEach((item) => {
        expect(item).toBeAShowSchedule();
      });
    });
  });

  describe('upsertPerformanceScheduleItems', () => {
    it('should be able to add or update a deal performance schedule.', async () => {
      const dealId = 'abc123';
      const schedule = [
        generate.app_performance_schedule({includeId: true}),
        generate.app_performance_schedule({includeId: true}),
        // Insert a new item
        generate.app_performance_schedule({includeId: false}),
      ];
      const api = build({includeId: false});
      const response = await api.upsertPerformanceScheduleItems(dealId, schedule);

      expect(api.client.mutate).toHaveBeenCalledTimes(1);
      expect(api.client.mutate).toHaveBeenCalledWith(expect.objectContaining({
        variables: {
          items: expect.any(Array),
        }
      }));

      expect(response).toEqual(expect.any(Array));
      expect(response.length).toEqual(schedule.length);
      expect(response[2].id).toBeDefined();
      response.forEach((item) => {
        expect(item).toBeAPerformanceSchedule();
      })
    });
  });

  describe('deletePerformanceScheduleItems', () => {
    it('should be able to delete the performance schedule items for a deal.', async () => {
      const dealId = 'abc123';
      const schedule = [
        generate.app_performance_schedule({includeId: true}),
        generate.app_performance_schedule({includeId: true}),
        generate.app_performance_schedule({includeId: true}),
      ];
      const api = build({includeId: false});
      const response = await api.deletePerformanceScheduleItems(dealId, schedule);

      expect(api.client.mutate).toHaveBeenCalledTimes(1);
      expect(api.client.mutate).toHaveBeenCalledWith(expect.objectContaining({
        variables: {
          items: schedule.map(s => s.id)
        }
      }));

      expect(response).toEqual(expect.any(Array));
      expect(response.length).toEqual(schedule.length);
      response.forEach((item) => {
        expect(item).toBeAPerformanceSchedule();
      });
    });
  });

  describe('batchUpdateDeal', () => {
    xit('should be able to batch update the properties of a deal.', () => {});
  });
})
