import React from 'react';
import PropTypes from 'prop-types';

import {
  combineClasses,
} from '@thesoulfresh/utils';

import styles from './Loader.module.scss';

import { ReactComponent as LoaderIcon } from './icon/loader.svg';

/**
 * `<Loader>` provides a generic loader component
 * you can use on any page. The loader will size itself
 * to fill it's parent container and center the loader
 * animation within that.
 *
 * Additional styling can be applied to the inner loader SVG
 * icon by using the `.loader` class.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @return {React.ReactElement}
 */
export function Loader({
  className,
  // @ts-ignore
  'aria-describedby': describedBy,
  // @ts-ignore
  'aria-label': ariaLabel,
  ...rest
}) {
  return (
    <span
      className={combineClasses(styles.Loader, className)}
      {...rest}
    >
      <LoaderIcon
        // Reset the id to an empty string so it doesn't
        // conflict with the page loader.
        id=""
        data-testid="loaderComponent"
        className="stagency-loader"
        role="progressbar"
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        // Size the icon to fill it's parent.
        // We use the style property so we don't override
        // the default styling applied through the global loader CSS.
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </span>
  );
}

Loader.propTypes = {
  /**
   * If there is visible text on the page that describes the
   * loading status (ex. "loading search results..."), you
   * should pass a id reference to that element.
   */
  'aria-describedby': PropTypes.element,
  /**
   * Any props applied to this component will be passed
   * to the root container HTMLElement.
   */
  'other props...': PropTypes.any,
};

