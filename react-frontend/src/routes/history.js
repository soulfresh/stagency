import { createBrowserHistory } from 'history';

/**
 * This is the default history object used during testing.
 * Providing this object explicitly to React Router allows
 * tests to provide their own verion.
 */
export const history = createBrowserHistory();
