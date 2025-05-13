import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';
import { useTimeout } from '@thesoulfresh/react-tools';

import { Loader } from '../Loader';
import styles from './PageBlocker.module.scss';

/**
 * `<PageBlocker>` can be used to block the current page with a loader message.
 * This is useful if you need to block interactions with a form while the form
 * is being saved or while data is being retrieved for a page.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} [props.message]
 * @param {number} [props.slowDuration]
 * @return {React.ReactElement}
 */
export function PageBlocker({
  className,
  message: messageProp,
  slowDuration = 6000,
  ...rest
}) {
  const wait = useTimeout();
  const [message, setMessage] = React.useState(messageProp);

  React.useEffect(() => {
    wait(() => {
      setMessage('Adding more turbo...')
    }, slowDuration);
  }, [slowDuration, wait])

  return (
    <div data-testid="PageBlocker"
      className={combineClasses(styles.PageBlocker, className)}
      {...rest}
    >
      <div className={styles.content}>
        <Loader className={styles.Loader} />
        {messageProp &&
          <span className={styles.message}>{message}</span>
        }
      </div>
    </div>
  );
}

PageBlocker.propTypes = {
  className: PropTypes.string,
  /**
   * The message to display to the user next to the loader.
   */
  messge: PropTypes.string,
  /**
   * The amount of time that constitues a slow request. After this timeout the
   * message will be updated with a second message to show that we are still
   * trying to load the results.
   */
  slowDuration: PropTypes.number,
  /**
   * Any other props you pass will be forwarded to the root
   * element.
   */
  'other props...': PropTypes.any,
};

