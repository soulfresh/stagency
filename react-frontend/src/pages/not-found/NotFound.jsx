import React from 'react';

import { ErrorView } from '~/components';

import styles from './NotFound.module.scss';

/**
 * The 404 error page displayed for unknow routes.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @return {ReactElement}
 */
export function NotFound({
  className,
}) {
  return (
    <ErrorView
      className={styles.NotFound}
      title="Not Found"
    >
      Sorry, we couldn't find that page 🥺
    </ErrorView>
  );
}

/**
 * @param {object} props
 * @return {ReactElement}
 */
export function NotFoundConnected() {
  return <NotFound />
}
