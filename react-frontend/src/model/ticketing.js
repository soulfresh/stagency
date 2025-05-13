
export const DEFAULT_EXPENSES = [
  "ASCAP",
  "APRA",
  "BMI",
  "PRS",
  "SESAC",
  "SOCAN",
  "Advertising",
  "Airfare",
  "Backline",
  "Barricades",
  "Box Office",
  "Catering",
  "Clean Up",
  "Credit Cards",
  "Electrician"
];

/**
 * An algorithm for determining the number of sellable tickets.
 * This can be applied to deals or ticket types.
 * @param {number} capacity - The total number of tickets that can be sold.
 * @param {number} complimentary - The number of tickets that will be given away.
 * @param {number} kills - The number of tickets that can't be sold for any other reason.
 * @return {number} The number of tickets that can be sold.
 */
export function sellableTickets(capacity = 0, complimentary = 0, kills = 0) {
  return capacity - complimentary - kills;
}


/**
 * Determine the gross potential revenue of a specific ticket type.
 * This only takes into account the number of tickets and the price of
 * this ticket type. It does NOT take into account expenses, facility charges,
 * etc.
 * @param {number} capacity - The total number of tickets that can be sold.
 * @param {number} complimentary - The number of tickets that will be given away.
 * @param {number} kills - The number of tickets that can't be sold for any other reason.
 * @param {number} price - The price of a ticket.
 * @return {number} The revenue that will be generated if all tickets are sold.
 */
export function sellableGrossPotential(capacity = 0, complimentary = 0, kills = 0, price = 0) {
  return sellableTickets(capacity, complimentary, kills) * price;
}

/**
 * Determine the potential revenue from a deal if all tickets are sold
 * taking into account only the sellable tickets and ticket prices.
 * It does NOT take into account facility charges, expenses, etc.
 * @param {object[]} tickets - The list of ticket types with the associated
 *   ticket count, kills, price, etc.
 * @return {number} The revenue that will be generated if all tickets are sold.
 */
export function dealSellableGrossPotential(tickets = []) {
  return tickets.reduce(
    (gross, ticket) =>
      gross + sellableGrossPotential(ticket.capacity, ticket.complimentary, ticket.kills, ticket.price)
    , 0
  );
}

/**
 * Determine the total number of tickets that can be sold for a deal.
 * @param {object[]} tickets - The list of ticket types with the associated
 *   ticket count, kills, price, etc.
 * @return {number} The number of tickets available to sell.
 */
export function dealSellableTickets(tickets = []) {
  return tickets.reduce(
    (count, ticket) => count + sellableTickets(ticket.capacity, ticket.complimentary, ticket.kills)
    , 0
  );
}
