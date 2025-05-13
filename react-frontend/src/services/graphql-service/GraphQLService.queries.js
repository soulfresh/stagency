import { gql } from 'graphql.macro'
import { fragments } from './GraphQLService.fragments'

export const GET_APP_CONFIG = gql`
  ${fragments.TicketTypeSummary}
  ${fragments.ExpenseTypeSummary}
  ${fragments.EventTypeSummary}
  ${fragments.EventBillingTypeSummary}

  query getAppConfig {
    app_ticket_type {
      ...TicketTypeSummary
    }
    app_expense_type {
      ...ExpenseTypeSummary
    }
    app_deal_event_type {
      ...EventTypeSummary
    }
    app_deal_event_billing_type {
      ...EventBillingTypeSummary
    }
  }
`

export const GET_DEALS = gql`
  ${fragments.DealSummary}
  ${fragments.DealStatusTypeSummary}
  ${fragments.ArtistSummary}
  ${fragments.PersonSummary}
  ${fragments.VenueSummary}
  ${fragments.DealEventSummary}

  query getDeals {
    app_deal {
      ...DealSummary
      deal_status_type {
        ...DealStatusTypeSummary
      }
      artist {
        ...ArtistSummary
      }
      events {
        ...DealEventSummary
        buyer {
          ...PersonSummary
        }
        copromoter {
          ...PersonSummary
        }
        venue {
          ...VenueSummary
        }
      }
    }
  }
`;

export const GET_DEAL = gql`
  ${fragments.DealSummary}
  ${fragments.DealStatusTypeSummary}
  ${fragments.ArtistSummary}
  ${fragments.PersonSummary}
  ${fragments.VenueSummary}
  ${fragments.DealEventSummary}
  ${fragments.PerformanceScheduleSummary}
  ${fragments.ShowScheduleSummary}
  ${fragments.TicketScalingSummary}
  ${fragments.TicketTypeSummary}
  ${fragments.ExpenseSummary}
  ${fragments.ExpenseTypeSummary}
  ${fragments.EventTypeSummary}
  ${fragments.EventBillingTypeSummary}

  query getDeal(
    $id: bigint!
  ) {
    app_deal(
      where: {id: {_eq: $id }}
    ) {
      ...DealSummary
      deal_status_type {
        ...DealStatusTypeSummary
      }
      artist {
        ...ArtistSummary
      }
      deal_event_type {
        ...EventTypeSummary
      }
      deal_event_billing_type {
        ...EventBillingTypeSummary
      }
      events {
        ...DealEventSummary
        buyer {
          ...PersonSummary
        }
        copromoter {
          ...PersonSummary
        }
        venue {
          ...VenueSummary
        }
      }
      performance_schedules {
        ...PerformanceScheduleSummary
      }
      show_schedules {
        ...ShowScheduleSummary
      }
      ticket_scalings {
        ...TicketScalingSummary
        type {
          ...TicketTypeSummary
        }
      }
      expenses {
        ...ExpenseSummary
        type {
          ...ExpenseTypeSummary
        }
      }
    }
  }
`;

export const CREATE_EMPTY_DEAL = gql`
  ${fragments.DealSummary}
  ${fragments.DealStatusTypeSummary}
  ${fragments.ArtistSummary}
  ${fragments.PersonSummary}
  ${fragments.VenueSummary}
  ${fragments.DealEventSummary}
  ${fragments.EventTypeSummary}
  ${fragments.EventBillingTypeSummary}

  mutation createEmptyDeal {
    insert_app_deal(objects: {status_type: PENDING}) {
      affected_rows
      # Is there a way to share this with the GET_DEALS query?
      returning {
        ...DealSummary
        deal_status_type {
          ...DealStatusTypeSummary
        }
        artist {
          ...ArtistSummary
        }
        deal_event_type {
          ...EventTypeSummary
        }
        deal_event_billing_type {
          ...EventBillingTypeSummary
        }
        events {
          ...DealEventSummary
          buyer {
            ...PersonSummary
          }
          copromoter {
            ...PersonSummary
          }
          venue {
            ...VenueSummary
          }
        }
      }
    }
  }
`

export const DELETE_DEAL = gql`
  mutation deleteDeal (
    $id: bigint!
  ) {
    delete_app_deal(
      where: {id: {_eq: $id}}
    ) {
      affected_rows
    }
  }
`

export const UPSERT_DEAL_ARTIST = gql`
  ${fragments.ArtistSummary}

  mutation upsertDealArtist(
    $dealId: bigint,
    $artistId: bigint
  ) {
    update_app_deal(
      where: {
        id: {_eq: $dealId}
      },
      _set: {
        artist_id: $artistId
      }
    ) {
      affected_rows
    }
  }
`

export const UPSERT_DEAL_EVENT_TYPE = gql`
  mutation upsertDealEventType(
    $dealId: bigint,
    $eventType: String
  ) {
    update_app_deal(
      where: {
        id: {_eq: $dealId}
      },
      _set: {
        event_type: $eventType
      }
    ) {
      affected_rows
    }
  }
`

export const UPSERT_DEAL_EVENT_BILLING_TYPE = gql`
  mutation upsertDealEventBillingType(
    $dealId: bigint,
    $billingType: String
  ) {
    update_app_deal(
      where: {
        id: {_eq: $dealId}
      },
      _set: {
        event_billing_type: $billingType
      }
    ) {
      affected_rows
    }
  }
`

export const UPSERT_DEAL_TICKETS = gql`
  ${fragments.TicketScalingSummary}
  ${fragments.TicketTypeSummary}
  mutation upsertDealTickets(
    $items: [app_ticket_scaling_insert_input!]!,
  ) {
    insert_app_ticket_scaling(
      objects: $items,
      on_conflict: {
        constraint: ticket_scaling_pkey,
        update_columns: [
          capacity,
          charity,
          complimentary,
          facility,
          kills,
          notes,
          other,
          price,
          secondary,
          ticket_type,
          sort_order,
        ]
      }
    ) {
      affected_rows
      returning {
        deal_id
        ...TicketScalingSummary
        type {
          ...TicketTypeSummary
        }
      }
    }
  }
`

export const DELETE_DEAL_TICKETS = gql`
  ${fragments.TicketScalingSummary}
  ${fragments.TicketTypeSummary}

  mutation deleteDealTickets(
    $items: [bigint!]!
  ) {
    delete_app_ticket_scaling(where: {id: {_in: $items}}) {
      affected_rows
      returning {
        deal_id
        ...TicketScalingSummary
        type {
          ...TicketTypeSummary
        }
      }
    }
  }
`;

export const UPSERT_SHOW_SCHEDULES = gql`
  ${fragments.ShowScheduleSummary}
  mutation upsertShowSchedules(
    $items: [app_show_schedule_insert_input!]!,
  ) {
    insert_app_show_schedule(
      objects: $items,
      on_conflict: {
        constraint: show_schedule_pkey,
        update_columns: [
          start_time
          show_schedule_type
          notes
          sort_order
        ]
      }
    ) {
      affected_rows
      returning {
        deal_id
        ...ShowScheduleSummary
      }
    }
  }
`;

export const DELETE_SHOW_SCHEDULE_ITEMS = gql`
  ${fragments.ShowScheduleSummary}

  mutation deleteShowScheduleItems(
    $items: [bigint!]!
  ) {
    delete_app_show_schedule(where: {id: {_in: $items}}) {
      affected_rows
      returning {
        deal_id
        ...ShowScheduleSummary
      }
    }
  }
`;

export const UPSERT_PERFORMANCE_SCHEDULES = gql`
  ${fragments.PerformanceScheduleSummary}
  mutation upsertPerformanceScheduleItems(
    $items: [app_performance_schedule_insert_input!]!,
  ) {
    insert_app_performance_schedule(
      objects: $items,
      on_conflict: {
        constraint: performance_schedule_pkey,
        update_columns: [
          set_length
          artist_name
          start_time
          sort_order
          notes
        ]
      }
    ) {
      affected_rows
      returning {
        deal_id
        ...PerformanceScheduleSummary
      }
    }
  }
`

export const DELETE_PERFORMANCE_SCHEDULE_ITEMS = gql`
  ${fragments.PerformanceScheduleSummary}

  mutation deletePerformanceScheduleItems(
    $items: [bigint!]!
  ) {
    delete_app_performance_schedule(where: {id: {_in: $items}}) {
      affected_rows
      returning {
        deal_id
        ...PerformanceScheduleSummary
      }
    }
  }
`;

export const UPSERT_EXPENSES = gql`
  ${fragments.ExpenseSummary}
  ${fragments.ExpenseTypeSummary}
  mutation upsertExpenses(
    $items: [app_expense_insert_input!]!,
  ) {
    insert_app_expense(
      objects: $items,
      on_conflict: {
        constraint: expense_pkey,
        update_columns: [
          name
          expense_type
          cost
          maximum
          sort_order
          notes
        ]
      }
    ) {
      affected_rows
      returning {
        deal_id
        ...ExpenseSummary
        type {
          ...ExpenseTypeSummary
        }
      }
    }
  }
`

export const DELETE_EXPENSES = gql`
  ${fragments.ExpenseSummary}
  ${fragments.ExpenseTypeSummary}

  mutation deleteExpenses(
    $items: [bigint!]!
  ) {
    delete_app_expense(where: {id: {_in: $items}}) {
      affected_rows
      returning {
        deal_id
        ...ExpenseSummary
        type {
          ...ExpenseTypeSummary
        }
      }
    }
  }
`;

export const SEARCH_ARTISTS = gql`
  ${fragments.ArtistSummary}

  query searchArtists(
    $term: String!
  ) {
    app_artist(
      where: {
        name: {_ilike: $term}
      },
      limit: 30
    ) {
      ...ArtistSummary
    }
  }
`

export const SEARCH_VENUES = gql`
  ${fragments.VenueSummary}

  query searchVenues(
    $term: String!
  ) {
    app_venue(
      where: {
        name: {_ilike: $term}
      },
      limit: 30
    ) {
      ...VenueSummary
    }
  }
`

export const SEARCH_PEOPLE = gql`
  ${fragments.PersonSummary}

  query searchPeople(
    $term: String!
  ) {
    app_person(
      where: {
        name: {_ilike: $term}
      },
      limit: 30
    ) {
      ...PersonSummary
    }
  }
`
