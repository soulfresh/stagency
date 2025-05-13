// Import any global styling
import './index.scss';

// Provide the Jest interfaces required by our tests
// that are not provided by Jasmine. This allows us to run tests
// in a real browser for debugging.
import * as jest from 'jest-mock';
import JasmineDOM from '@testing-library/jasmine-dom';
import { seed } from '@ngneat/falso';

// Set the random seed for Falso to ensure random values
// are reproducable.
seed('abc123')

// Add missing Jest functions
window.test = window.it;
window.test.each = inputs => (testName, test) =>
  inputs.forEach(args => window.it(testName, () => test(...args)));
window.test.todo = function () {
  return undefined;
};
window.jest = jest;
window.jest.useRealTimers = function() {
  return undefined;
}

// Add the HTML equivalent of jest-dom
beforeAll(() => {
  // eslint-disable-next-line no-undef
  jasmine.getEnv().addMatchers(JasmineDOM);
});
