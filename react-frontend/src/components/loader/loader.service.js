import React from 'react';
import { ServiceBase } from '@thesoulfresh/utils';

import { env } from '~/env';

export const selectors = {
  id: 'page-loader',
  stop: 'stop',
}

/*
 * This loader service will start/stop the global
 * loader element by adding/removing the stop class
 * on the loader element.
 *
 * This component expects a loader element to exist on the page
 * (should be embedded in the index.html template so it loads
 * before the app is bootstraped).
 *
 * @see `public/index.html` for more info.
 */
export class LoaderService extends ServiceBase {
  constructor(verbose = env.verbose) {
    super(null, verbose);
    this.selectors = selectors;
  }

  getLoader() {
    return document.getElementById(this.selectors.id);
  }

  start(id) {
    if (this.timer) {
      this.debug(id, 'Stopping previous timer');
      clearTimeout(this.timer);
    }

    const l = this.getLoader();

    if (l && l.classList.contains(this.selectors.stop)) {
      this.debug(id, 'START', Date.now());
      l.classList.remove(this.selectors.stop);
    }
  }

  /**
   * Stop the global loader. Passing false for the immediate flag
   * will delay stopping the loader for `delay` milliseconds in case
   * another component needs to quickly restart it. This prevents
   * the loader animation from jumping between page transitions
   * and other loading events.
   * @param {boolean} [immediate]
   * @param {number} [delay]
   */
  stop(id, immediate = true, delay = 120) {
    const l = this.getLoader();

    if (l && !l.classList.contains(this.selectors.stop)) {
      const stop = () => {
        this.debug(id, 'STOP', delay, Date.now());
        l.classList.add(this.selectors.stop);
        this.timer = null;
      }

      if (immediate) stop()
      else {
        if (this.timer) this.timer = clearTimeout(this.timer);
        this.timer = setTimeout(stop, delay);
      }
    }
  }
}

export const LoaderServiceContext = React.createContext(new LoaderService());
export const LoaderServiceProvider = LoaderServiceContext.Provider;

export function useLoaderService() {
  return React.useContext(LoaderServiceContext);
}
