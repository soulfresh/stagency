import { generate } from '../../mocks'
import { toGraphQL } from './toGraphQL'

describe('toGraphQL', () => {
  const options = {includeId: true, allowEmpty: false};

  it('app_ticket_type', () => {
    const type = generate.app_ticket_type(options);

    expect(toGraphQL.app_ticket_type(type)).toEqual({
      value: type.value,
      comment: type.comment,
    });
  });

  it('app_ticket_scaling', () => {
    const ticket = generate.app_ticket_scaling(options);

    expect(toGraphQL.app_ticket_scaling(ticket)).toEqual({
      deal_id: null,
      id: ticket.id,
      ticket_type: ticket.type.value,
      capacity: ticket.capacity,
      complimentary: ticket.complimentary,
      kills: ticket.kills,
      price: ticket.price,
      facility: ticket.facility,
      charity: ticket.charity,
      secondary: ticket.secondary,
      other: ticket.other,
      notes: ticket.notes,
      sort_order: ticket.sortOrder,
    });

    expect(toGraphQL.app_ticket_scaling(ticket, 'abc')).toEqual(expect.objectContaining({
      deal_id: 'abc',
      id: ticket.id,
    }));

    expect(toGraphQL.app_ticket_scaling({...ticket, type: undefined})).toBeATicketScaling();
  });

  it('app_show_schedule', () => {
    const dealId = 'abc123'
    const show = generate.app_show_schedule(options);

    expect(toGraphQL.app_show_schedule(show)).toEqual({
      deal_id: null,
      id: show.id,
      notes: show.notes,
      show_schedule_type: show.type,
      start_time: show.startTime,
      sort_order: show.sortOrder,
    });

    expect(toGraphQL.app_show_schedule(show, dealId)).toEqual(expect.objectContaining({
      deal_id: dealId,
      id: show.id,
    }));
  });

  it('app_performance_schedule', () => {
    const dealId = 'abc123'
    const show = generate.app_performance_schedule(options);

    expect(toGraphQL.app_performance_schedule(show)).toEqual({
      deal_id: null,
      id: show.id,
      start_time: show.startTime,
      set_length: show.setLength,
      artist_name: show.artist,
      notes: show.notes,
      sort_order: show.sortOrder,
    });

    expect(toGraphQL.app_performance_schedule(show, dealId)).toEqual(expect.objectContaining({
      deal_id: dealId,
      id: show.id,
    }));
  });

  it('app_expense', () => {
    const dealId = 'abc123'
    const expense = generate.app_expense(options);

    expect(toGraphQL.app_expense(expense)).toEqual({
      deal_id: null,
      id: expense.id,
      name: expense.name,
      expense_type: expense.type.value,
      cost: expense.cost,
      maximum: expense.maximum,
      notes: expense.notes,
      sort_order: expense.sortOrder,
    });

    expect(toGraphQL.app_expense(expense, dealId)).toEqual(expect.objectContaining({
      deal_id: dealId,
      id: expense.id,
    }));

    expect(toGraphQL.app_expense({...expense, type: undefined})).toBeAnExpense();
  });
});
