import React from 'react';

/**
 * Console log changes to a component's props.
 * @param {object} props
 */
export function useLogPropChanges(props, prefix = '') {
  const count = React.useRef(0);
  const prev = React.useRef(props);
  React.useEffect(() => {
    ++count.current;

    if (count.current === 1) {
      console.log(`${prefix + ' '}Initial props:`, props);
    }

    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log(`${prefix + ' '}Changed props (${count.current}):`, changedProps);
    }

    prev.current = props;
  });
}

