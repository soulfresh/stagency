export * from './helpers';
export * from './fake';
export * from './render';
export * from './testing-library';
export * from './page-object-helpers';
export * from './interactors';
export * from './jest';
export * from './wait';

// Export these for ease of use
export {default as ResizeObserver} from 'resize-observer-polyfill';

export {
  queryHelpers,
  act,
  render,
  screen,
  waitFor,
  prettyDOM,
  logRoles,
} from '@testing-library/react';
