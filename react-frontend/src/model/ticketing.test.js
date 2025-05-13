import {
  sellableTickets,
  sellableGrossPotential,
  dealSellableGrossPotential,
  dealSellableTickets,
} from './ticketing';

describe('model/ticketing', () => {
  describe('sellableTickets', () => {
    it('should be able to determine the number of tickets that can be sold.', () => {
      expect(sellableTickets()).toEqual(0);
      expect(sellableTickets(0, 0, 0)).toEqual(0);
      expect(sellableTickets(100)).toEqual(100);
      expect(sellableTickets(100, 10)).toEqual(90);
      expect(sellableTickets(100, 10, 30)).toEqual(60);
    });
  });

  describe('sellableGrossPotential', () => {
    it('should be able to determine the gross potential revenue for a single ticket price.', () => {
      expect(sellableGrossPotential()).toEqual(0);
      expect(sellableGrossPotential(0, 0, 0, 0)).toEqual(0);
      expect(sellableGrossPotential(100, 0, 0, 2)).toEqual(200);
      expect(sellableGrossPotential(100, 10, 0, 2)).toEqual(180);
      expect(sellableGrossPotential(100, 10, 2, 2)).toEqual(176);
    });
  });

  describe('dealSellableGrossPotential', () => {
    it('should be able to determine the gross potential revenue from an array of ticket types on a deal.', () => {
      expect(dealSellableTickets()).toEqual(0);
      expect(dealSellableTickets([])).toEqual(0);
      expect(dealSellableTickets([{capacity: 100}])).toEqual(100);
      expect(dealSellableTickets([{capacity: 100, complimentary: 10}])).toEqual(90);
      expect(dealSellableTickets([{capacity: 100, complimentary: 10, kills: 7}])).toEqual(83);
      expect(dealSellableTickets([
        {capacity: 100, complimentary: 10, kills: 7}, //  83
        {capacity:  50, complimentary:  3, kills: 1}, //  46
        {capacity: 200, complimentary:  8, kills: 0}, // 192
      ])).toEqual(321);
    });
  });

  describe('dealSellableTickets', () => {
    it('should be able to determine the number of tickets that can be sold from an array of ticket types on a deal.', () => {
      expect(dealSellableGrossPotential()).toEqual(0);
      expect(dealSellableGrossPotential([])).toEqual(0);
      expect(dealSellableGrossPotential([{capacity: 100}])).toEqual(0);
      expect(dealSellableGrossPotential([{price: 2, capacity: 100}])).toEqual(200);
      expect(dealSellableGrossPotential([{price: 2, capacity: 100, complimentary: 5}])).toEqual(190);
      expect(dealSellableGrossPotential([{price: 2, capacity: 100, complimentary: 5, kills: 7}])).toEqual(176);
      expect(dealSellableGrossPotential([
        {price: 2, capacity: 100, complimentary: 5, kills:  7}, // 176
        {price: 1, capacity: 250, complimentary: 0, kills: 10}, // 240
        {price: 3, capacity:  50, complimentary: 3, kills:  1}, // 138
      ])).toEqual(554);
    });
  });
});
