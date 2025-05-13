// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { PropTypeMatchers } from './test/jest-matchers';
import { seed } from '@ngneat/falso';
// TODO Replace faker
import Faker from 'faker';

// Set the random seed for Falso to ensure random values
// are reproducable.
seed('abc123')

// Ensure tests always run with the same data.
Faker.seed(123);

// Polyfills for JsDom
window.matchMedia = () => ({matches: false});

// Add PropType matchers
expect.extend(PropTypeMatchers);

// I feel like I spend a lot of time trying to fix "not wrapped in act(...)"
// warnings from React during testing but they have never helped me prevent
// bugs. For that reason I'm disabling them here.
const originalError = console.error
beforeAll(() => {
  // this is here to silence a warning temporarily
  // we'll fix it in the next exercise
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    if (typeof args[0] === 'string' && args[0].includes('inside a test was not wrapped in act(...)')) {
      return
    }
    return originalError.call(console, args)
  })
})

afterAll(() => {
  console.error.mockRestore()
})
