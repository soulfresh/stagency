import React from 'react';
import { screen } from '@testing-library/react';
import ResizeObserver from "resize-observer-polyfill";

import {
  listOf,
  render,
  TICKET_TYPES,
} from '~/test';
import { generateGraphQL as mock } from '~/services/mocks';

import { TicketScaling } from './TicketScaling.jsx';

describe('TicketScaling', function() {
  let data;

  beforeEach(() => {
    // @ts-ignore
    window.matchMedia = jest.fn(() => ({matches: false}));
  });

  afterEach(() => {
    delete window.matchMedia;
  });

  beforeEach((done) => {
    data = listOf(3, () => mock.app_ticket_scaling({randomize: true, allowEmpty: false}))
    render(
      <TicketScaling
        data={data}
        config={TICKET_TYPES}
        onReady={done}
        ResizeObserver={ResizeObserver}
      />
    );
  });

  it('should render', () => {
    expect(screen.getByTestId('TicketScaling')).toBeInTheDocument();
  });

  describe('with an empty deal', () => {
    xit('should set the ticket scaling table values.', () => {});
    describe('after changing a field', () => {
      xit('should convert currency fields into pennies.', () => {});
    });
  });

  describe('with an existing deail', () => {
    xit('should set the ticket scaling table values.', () => {});
  });
});
