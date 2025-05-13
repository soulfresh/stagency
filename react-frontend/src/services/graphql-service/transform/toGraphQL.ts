import {
  ShowSchedule,
  TicketScaling,
  TicketType,
  PerformanceSchedule,
  Expense,
} from "../types";

type OptionalId = string | null

/**
 * `toGraphQL` allows transforming data
 * from the application domain model to
 * the relational data model used in GraphQL.
 *
 * @see fromGraphQL for transformations coming from GraphQL.
 */
export const toGraphQL = {
  app_ticket_type: (t: TicketType = {} as TicketType) => ({
    value: t.value,
    comment: t.comment,
  }),

  app_ticket_scaling: (s: TicketScaling = {} as TicketScaling, deal_id: OptionalId = null) => ({
    deal_id,
    id: s.id,
    // Always save the ticket type using the field as opposed to the enum.
    ticket_type: s.type?.value,
    capacity: s.capacity,
    complimentary: s.complimentary,
    kills: s.kills,
    price: s.price,
    facility: s.facility,
    charity: s.charity,
    secondary: s.secondary,
    other: s.other,
    notes: s.notes,
    sort_order: s.sortOrder,
  }),

  app_show_schedule: (s: ShowSchedule = {} as ShowSchedule, deal_id: OptionalId = null) => ({
    deal_id,
    id: s.id,
    notes: s.notes,
    show_schedule_type: s.type,
    start_time: s.startTime,
    sort_order: s.sortOrder,
  }),

  app_performance_schedule: (
    s: PerformanceSchedule = {} as PerformanceSchedule,
    deal_id: OptionalId = null
  ) => ({
    deal_id,
    id: s.id,
    start_time: s.startTime,
    set_length: s.setLength,
    artist_name: s.artist,
    notes: s.notes,
    sort_order: s.sortOrder,
  }),

  app_expense: (
    e: Expense = {} as Expense,
    deal_id: OptionalId = null,
  ) => ({
    deal_id,
    id: e.id,
    name: e.name,
    // Always save the expense type using the field as opposed to the enum.
    expense_type: e.type?.value,
    cost: e.cost,
    maximum: e.maximum,
    notes: e.notes,
    sort_order: e.sortOrder,
  }),
}
