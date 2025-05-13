import _debounce from 'debounce-promise';

export function debouncePromise(cb: () => void, time: number) {
  return time > 0 ? _debounce(cb, time) : cb;
}
