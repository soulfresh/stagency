export interface Image {
  url: string
  width: number
  height: number
}

export interface Entity {
  id: string
  name: string
  image: Image
}

export type Artist = Entity
  // TODO These will need a location and timezone
export type Person = Entity
export type Venue = Entity

export interface DBEnum {
  value: string
  comment: string
}

export type TicketType = DBEnum
export type EventType = DBEnum
export type EventBillingType = DBEnum

export interface Event {
  id: string
  date: string
  venue: Venue
  buyer: Person
  copromoter: Person
}

export interface DealStructureType {
  value: string
  name: string
  description: string
}

// There can be one or more entity payouts for a specific
// deal structure. A deal has a single deal structure but
// that deal structure can have multiple payouts. The list
// of possible payouts is constrained by the deal structure
// type.
export interface DealStructureEntityPayout {
  dealStructureId: string
  // the type of payout the entity will receive
  // guarantee, percent of box office,
  type: string
  // artist, promoter, ...
  entityType: string
  entityId: string
  // can be a percent or a value depending on the deal
  // structure type
  amount: string
  // a string describing any constraints that must be met
  // before the entity can receive this payout. NULL signifies
  // no constraint.
  constraint: string
}

// Example Deal Structures:
//
// __Promoter Profit__
// - type: PROMOTER_PROFIT
// - payouts:
//   - artist guarantee:
//     - entityType: artist
//     - type: guarantee
//     - amount: value in pennies
//     - constraint: null
//   - artist bonus:
//     - entityType: artist
//     - type: percent of box office
//     - amount: percentage
//     - constraint: null
//   - promoter:
//     - entityType: promoter
//     - type: percent of box office
//     - amount: percentage
//     - constraint: null
//
// __Guarantee Plus Bonus__
// - type: GUARANTEE_PLUS_BONUS
// - payouts:
//   - artist guarantee:
//     - entityType: artist
//     - type: guarantee
//     - amount: value in pennies
//     - constraint: NULL
//   - artist bonus (one or more):
//     - entityType: artist
//     - type: bonus
//     - amount: value in pennies
//     - constraint: some scenario description
//
// __Guarantee Vs Percentage of Gross__
// - type: GUARANTEE_VS_PERCENTAGE_OF_GROSS
// - payouts:
//   - artist guarantee:
//     - entityType: artist
//     - type: guarantee
//     - amount: value in pennies
//     - constraint: is less than % of box office receipts
//   - percent of box office
//     - entityType: artist
//     - type: percent of box office
//     - amount: value in pennies
//     - constraint: is greater than artist guarantee
export interface DealStructure {
  id: string
  dealId: string
  type: string
  // The list of people who get paid based on the deal structure type.
  payouts: DealStructureEntityPayout[]
  notes: string
}

export interface TicketScaling {
  id: string
  type: TicketType
  capacity: number
  complimentary: number
  kills: number
  price: number
  facility: number
  charity: number
  secondary: number
  other: number
  notes: string
  sortOrder: string
}

export interface ShowSchedule {
  id: string
  startTime: string
  type: string
  notes: string
  sortOrder: string
}

export interface PerformanceSchedule {
  id: string
  startTime: string
  setLength: string
  artist: Artist
  notes: string
  sortOrder: string
}

export type ExpenseType = DBEnum

export interface Expense {
  id: string
  name: string
  type: ExpenseType
  cost: number
  maximum: number
  notes: string
  sortOrder: string
}

export interface DealStructure {
  id: string
  name: string
  description: string
}

export type DealStatusType = DBEnum

export interface Deal {
  id: string
  artist: Artist
  // TODO Should the event type be configurable per event?
  eventType: EventType
  eventBillingType: EventBillingType
  events: Event[]
  venues: Venue[]
  tickets: TicketScaling[]
  showSchedule: ShowSchedule[]
  performanceSchedule: PerformanceSchedule[]
  status: DealStatusType
  expenses: Expense[]
  lastUpdate: string
}

