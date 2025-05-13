export interface Entity {
  id: string
  name: string
  image: string
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
  type: EventType
  billingType: EventBillingType
  events: Event[]
  venues: Venue[]
  tickets: TicketScaling[]
  showSchedule: ShowSchedule[]
  performanceSchedule: PerformanceSchedule[]
  status: DealStatusType
  expenses: Expense[]
  lastUpdate: string
}

