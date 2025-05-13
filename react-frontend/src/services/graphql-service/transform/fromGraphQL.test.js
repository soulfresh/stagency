import { fromGraphQL } from './fromGraphQL'
import { generateGraphQL as gen } from '../mocks'

describe('fromGraphQL', () => {
  const options = {includeId: true, allowEmpty: false};

  it('app_ticket_type', () => {
    const type = gen.app_ticket_type(options);
    const transformed = fromGraphQL.app_ticket_type(type);
    expect(transformed).toEqual({
      value: type.value,
      comment: type.comment,
    });
    expect(transformed).toBeATicketType();
  })

  it('app_ticket_scaling', () => {
    const ticket = gen.app_ticket_scaling(options)
    const transformed = fromGraphQL.app_ticket_scaling(ticket)
    expect(transformed).toEqual({
      id            : ticket.id,
      type          : ticket.type,
      price         : ticket.price,
      capacity      : ticket.capacity,
      complimentary : ticket.complimentary,
      kills         : ticket.kills,
      facility      : ticket.facility,
      charity       : ticket.charity,
      secondary     : ticket.secondary,
      other         : ticket.other,
      notes         : ticket.notes,
      sortOrder     : ticket.sort_order,
    })
    expect(transformed).toBeATicketScaling();

    expect(fromGraphQL.app_ticket_scaling({...ticket, type: undefined})).toBeATicketScaling();
  })

  it('app_show_schedule', function() {
    const s = gen.app_show_schedule(options);
    const transformed = fromGraphQL.app_show_schedule(s);
    expect(transformed).toEqual({
      id        : s.id,
      type      : s.show_schedule_type,
      startTime : s.start_time,
      notes     : s.notes,
      sortOrder : s.sort_order,
    })
    expect(transformed).toBeAShowSchedule();
  });

  it('app_performance_schedule', function() {
    const s = gen.app_performance_schedule(options)
    const transformed = fromGraphQL.app_performance_schedule(s)
    expect(transformed).toEqual({
      id        : s.id,
      startTime : s.start_time,
      setLength : s.set_length,
      artist    : s.artist_name,
      notes     : s.notes,
      sortOrder : s.sort_order,
    });
    expect(transformed).toBeAPerformanceSchedule();
  });

  it('app_expense_type', () => {
    const e = gen.app_expense_type(options)
    const transformed = fromGraphQL.app_expense_type(e)
    expect(transformed).toEqual({
      value   : e.value,
      comment : e.comment,
    });
    expect(transformed).toBeAnExpenseType();
  });

  it('app_expense', function() {
    const e = gen.app_expense(options);
    const transformed = fromGraphQL.app_expense(e);
    expect(transformed).toEqual({
      id            : e.id,
      name          : e.name,
      type          : e.type,
      cost          : e.cost,
      maximum       : e.maximum,
      notes         : e.notes,
      sortOrder     : e.sort_order,
    });
    expect(transformed).toBeAnExpense();
    expect(transformed.type).toBeAnExpenseType();

    const e2 = {...e, type: null}
    const transformed2 = fromGraphQL.app_expense(e2);
    expect(transformed2).toBeAnExpense();
  });

  it('app_artist', function() {
    const a = gen.app_artist(options)
    const transformed = fromGraphQL.app_artist(a)
    expect(transformed).toEqual({
      id    : a.id,
      name  : a.name,
      image : a.image,
    });
    expect(transformed).toBeAnArtist();
  });

  it('app_person', function() {
    const a = gen.app_person(options)
    const transformed = fromGraphQL.app_person(a)
    expect(transformed).toEqual({
      id    : a.id,
      name  : a.name,
      image : a.image,
    });
    expect(transformed).toBeAPerson();
  });

  it('app_venue', function() {
    const v = gen.app_venue(options)
    const transformed = fromGraphQL.app_venue(v)
    expect(transformed).toEqual({
      id    : v.id,
      name  : v.name,
      image : v.image,
    });
    expect(transformed).toBeAVenue();
  });

  it('app_deal_status_type', function() {
    const s = gen.app_deal_status_type(options);
    const transformed = fromGraphQL.app_deal_status_type(s);
    expect(transformed).toEqual({
      comment : s.comment,
      value   : s.value,
    });
    expect(transformed).toBeADealStatus();
  });

  it('app_deal_event_type', () => {
    const s = gen.app_deal_event_type(options);
    const transformed = fromGraphQL.app_deal_event_type(s);
    expect(transformed).toEqual({
      comment : s.comment,
      value   : s.value,
    });
    expect(transformed).toBeADealEventType();
  })

  it('app_deal_event_billing_type', () => {
    const s = gen.app_deal_event_billing_type(options);
    const transformed = fromGraphQL.app_deal_event_billing_type(s);
    expect(transformed).toEqual({
      comment : s.comment,
      value   : s.value,
    });
    expect(transformed).toBeADealEventBillingType();
  })

  it('app_deal_event', () => {
    const s = gen.app_deal_event(options);
    const transformed = fromGraphQL.app_deal_event(s);
    expect(transformed).toEqual({
      id: s.id,
      date: s.date,
      buyer: fromGraphQL.app_person(s.buyer),
      copromoter: fromGraphQL.app_person(s.copromoter),
      venue: fromGraphQL.app_venue(s.venue),
    });
    expect(transformed).toBeADealEvent();
  })

  it('app_deal', function() {
    const venueCount               = 10;
    const ticketCount              = 20;
    const showScheduleCount        = 30;
    const performanceScheduleCount = 40;
    const expenseCount             = 50;

    const d = gen.app_deal({
      ...options,
      venueCount,
      ticketCount,
      showScheduleCount,
      performanceScheduleCount,
      expenseCount,
    });

    const transformed = fromGraphQL.app_deal(d);
    expect(transformed).toEqual({
      id                  : d.id,
      eventType           : fromGraphQL.app_deal_event_type(d.deal_event_type),
      eventBillingType    : fromGraphQL.app_deal_event_billing_type(d.deal_event_billing_type),
      artist              : fromGraphQL.app_artist(d.artist),
      events              : d.events.map(e => fromGraphQL.app_deal_event(e)),
      tickets             : d.ticket_scalings.map(fromGraphQL.app_ticket_scaling),
      showSchedule        : d.show_schedules.map(fromGraphQL.app_show_schedule),
      performanceSchedule : d.performance_schedules.map(fromGraphQL.app_performance_schedule),
      expenses            : d.expenses.map(fromGraphQL.app_expense),
      status              : d.deal_status_type,
      lastUpdated         : d.updated_at,
    });
    expect(transformed).toBeADeal();


    expect(transformed.tickets.length).toEqual(ticketCount);
    expect(transformed.showSchedule.length).toEqual(showScheduleCount);
    expect(transformed.performanceSchedule.length).toEqual(performanceScheduleCount);
  });
});

