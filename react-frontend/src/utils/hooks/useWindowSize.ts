import React from 'react';

/**
 * Respond to window resize events.
 */
export function useWindowSize(): [number, number] {
  const [size, setSize] = React.useState<[number, number]>([0, 0]);

  React.useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    updateSize();

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}
