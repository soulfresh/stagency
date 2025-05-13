/**
 * `fromGraphQL` allows you to transform data from
 * the relational data model returned from GraphQL into
 * the application domain model used in the client code.
 * This sheilds the application from relational data changes
 * that don't affect the application's logic or data structure.
 */
export const fromGraphQL = {
  app_ticket_type: (t = {}) => ({
    value: t.value,
    comment: t.comment,
  }),

  app_ticket_scaling: (s = {}) => ({
    id: s.id,
    type: s.type ? fromGraphQL.app_ticket_type(s.type) : undefined,
    capacity: s.capacity,
    complimentary: s.complimentary,
    kills: s.kills,
    price: s.price,
    facility: s.facility,
    charity: s.charity,
    secondary: s.secondary,
    other: s.other,
    notes: s.notes,
    sortOrder: s.sort_order,
  }),

  app_show_schedule: (s = {}) => ({
    id: s.id,
    startTime: s.start_time,
    type: s.show_schedule_type,
    notes: s.notes,
    sortOrder: s.sort_order,
  }),

  app_performance_schedule: (s = {}) => ({
    id: s.id,
    startTime: s.start_time,
    setLength: s.set_length,
    artist: s.artist_name,
    notes: s.notes,
    sortOrder: s.sort_order,
  }),

  app_deal_event_type: (e = {}) => ({
    value: e.value,
    comment: e.comment,
  }),

  app_deal_event_billing_type: (e = {}) => ({
    value: e.value,
    comment: e.comment,
  }),

  app_expense_type: (e = {}) => ({
    value: e.value,
    comment: e.comment,
  }),

  app_expense: (e = {}) => ({
    id: e.id,
    name: e.name,
    type: e.type ? fromGraphQL.app_expense_type(e.type) : undefined,
    cost: e.cost,
    maximum: e.maximum,
    notes: e.notes,
    sortOrder: e.sort_order,
  }),

  app_artist: (a = {}) => ({
    id: a.id,
    name: a.name,
    image: a.image,
  }),

  app_person: (v = {}) => ({
    id: v.id,
    name: v.name,
    image: v.image,
  }),

  app_venue: (v = {}) => ({
    id: v.id,
    name: v.name,
    image: v.image,
  }),

  app_deal_structure: (s = {}) => ({
    id: s.id,
    name: s.name,
    description: s.description,
  }),

  app_deal_event: (v = {}) => ({
    id: v.id,
    date: v.date,
    buyer: v.buyer ? fromGraphQL.app_person(v.buyer) : null,
    copromoter: v.buyer ? fromGraphQL.app_person(v.copromoter) : null,
    venue: v.venue ? fromGraphQL.app_venue(v.venue) : null,
  }),

  app_deal_status_type: (s = {}) => ({
    comment: s.comment,
    value: s.value,
  }),

  app_deal: (d = {}) => {
    return {
      id: d.id,
      artist: d.artist ? fromGraphQL.app_artist(d.artist) : null,
      eventType: d.deal_event_type ? fromGraphQL.app_deal_event_type(d.deal_event_type) : null,
      eventBillingType: d.deal_event_billing_type ? fromGraphQL.app_deal_event_billing_type(d.deal_event_billing_type) : null,
      events: (d.events || []).map(e => fromGraphQL.app_deal_event(e)),
      tickets: d.ticket_scalings ? d.ticket_scalings.map(fromGraphQL.app_ticket_scaling) : [],
      showSchedule: (d.show_schedules || []).map(fromGraphQL.app_show_schedule),
      performanceSchedule: d.performance_schedules ? d.performance_schedules.map(fromGraphQL.app_performance_schedule) : [],
      status: d.deal_status_type ? fromGraphQL.app_deal_status_type(d.deal_status_type) : null,
      expenses: (d.expenses || []).map(fromGraphQL.app_expense),
      lastUpdated: d.updated_at,
    }
  },
}
