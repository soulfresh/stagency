import { gql } from '@apollo/client'

const UserSummary = gql`
  fragment UserSummary on user {
    user_id
    email
    first_name
    last_name
  }
`

const UserDetail = gql`
  ${UserSummary}
  fragment UserDetail on user {
    ...UserSummary
    profile_picture
    bio
  }
`

const ArtistSummary = gql`
  fragment ArtistSummary on app_artist {
    id
    name
    image
  }
`

const PersonSummary = gql`
  fragment PersonSummary on app_person {
    id
    name
    image
  }
`

const VenueSummary = gql`
  fragment VenueSummary on app_venue {
    id
    name
    image
  }
`

const DealEventSummary = gql`
  fragment DealEventSummary on app_deal_event {
    id
    date
  }
`

const EventSummary = gql`
  fragment EventSummary on app_deal_event {
    id
    date
  }
`

const PerformanceScheduleSummary = gql`
  fragment PerformanceScheduleSummary on app_performance_schedule {
    id
    notes
    artist_name
    set_length
    start_time
    sort_order
  }
`

const ShowScheduleSummary = gql`
  fragment ShowScheduleSummary on app_show_schedule {
    id
    notes
    show_schedule_type
    start_time
    sort_order
  }
`

const EventTypeSummary = gql`
  fragment EventTypeSummary on app_deal_event_type {
    value
    comment
  }
`

const EventBillingTypeSummary = gql`
  fragment EventBillingTypeSummary on app_deal_event_billing_type {
    value
    comment
  }
`

const TicketTypeSummary = gql`
  fragment TicketTypeSummary on app_ticket_type {
    value
    comment
  }
`

const TicketScalingSummary = gql`
  fragment TicketScalingSummary on app_ticket_scaling {
    id
    capacity
    charity
    complimentary
    facility
    kills
    notes
    other
    price
    secondary
    sort_order
  }
`

const ExpenseTypeSummary = gql`
  fragment ExpenseTypeSummary on app_expense_type {
    value
    comment
  }
`

const ExpenseSummary = gql`
  fragment ExpenseSummary on app_expense {
    id
    name
    cost
    maximum
    notes
    sort_order
  }
`

const DealStatusTypeSummary = gql`
  fragment DealStatusTypeSummary on app_deal_status_type {
    comment
    value
  }
`

const DealSummary = gql`
  fragment DealSummary on app_deal {
    id
    created_at
    updated_at
  }
`

export const fragments = {
  UserSummary,
  UserDetail,
  ArtistSummary,
  PersonSummary,
  VenueSummary,
  EventSummary,
  DealSummary,
  DealEventSummary,
  PerformanceScheduleSummary,
  ShowScheduleSummary,
  TicketScalingSummary,
  TicketTypeSummary,
  ExpenseSummary,
  ExpenseTypeSummary,
  DealStatusTypeSummary,
  EventTypeSummary,
  EventBillingTypeSummary,
}

