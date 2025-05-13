export function silenceLogs(level = 'log') {
  // @ts-ignore
  jest.spyOn(console, level).mockImplementation(() => {});
}

export function silenceAllLogs() {
  ['error', 'warn', 'info', 'log', 'debug'].forEach(silenceLogs);
}

export function mostRecentCall(mockFunc) {
  return mockFunc.mock.calls.slice(-1)[0];
}

/**
 * Silence error logs stating that a React can't perform a state update on
 * an unmounted component.
 *
 * **Note**: Avoid using this as much as possible. Start by seeing if you
 * can track down the state update and prevent it from happening. You should
 * only resort to using this solution when you just can't track down the
 * problematic state update.
 *
 * If you do end up using this function, please add a comment with notes around
 * anything you've discovered or tried while debugging the issue.
 */
export function silenceUnmountedStateUpdateWarning() {
  silenceWarning("Warning: Can't perform a React state update on an unmounted component");
}

export function silenceActWarning() {
  silenceWarning("Warning: An update to %s inside a test was not wrapped");
}

function silenceWarning(startingWith = "") {
  // If console error is already mocked, leave that mock in place so we
  // don't break something else.
  if (console.error.mockRestore) return;

  const orig = console.error;
  jest.spyOn(console, 'error').mockImplementation((message, ...rest) => {
    if (
      typeof(message) === 'string' && message.startsWith(startingWith)
    ) {
      return;
    } else {
      return orig(message, ...rest);
    }
  });
}
