import React from 'react';
import PropTypes from 'prop-types';

import { env } from '~/env';
import { useLoaderService } from './loader.service';

/*
 * Start/Stop the global page loader embedded in the HTML page.
 *
 * If not in "immediate" mode (the default), then the PageLoader
 * will remain active for "delay" milliseconds in case another
 * component needs to quickly restart the page loader.
 *
 * @See `loader.service.js`
 *
 * @param {object} props
 * @param {boolean} [props.immediate] - Whether to show and hide the loader
 *   without a delay.
 * @param {number} [props.delay] - A delay before the loader is turned off.
 * @param {boolean} [props.verbose] - Whether to log loader start and stop events.
 */
export function PageLoader({
  immediate = env.test,
  delay,
  id = "Unknown",
  autoStop = true,
}) {
  const service = useLoaderService();

  React.useEffect(() => {
    service.start(id);
    if (autoStop) {
      return () => service.stop(id, immediate, delay);
    }
  });

  return null;
}

PageLoader.propTypes = {
  /**
   * True = immediately remove the PageLoader on destroy.
   * False = delay removal of the PageLoader in case it
   * is quickly re-added by another component.
   *
   * False by default unless running in a test environment.
   */
  immediate: PropTypes.bool,
  /**
   * The number of milliseconds to delay stopping the PageLoader
   * when not in immediate mode.
   */
  delay: PropTypes.number,
  /**
   * Whether to enable logging of loader start/stop events.
   */
  verbose: PropTypes.bool,
}

