import React from 'react';

import {
  LoaderServiceContext,
  TitleXL,
  PageLayout,
} from '~/components';
import {
  env,
} from '../env';

import styles from './BundleLoadError.module.scss';

/*
 * This component is intended to be used as an ErrorBoundary to catch any issues
 * with loading the top level app bundles.
 */
export class BundleLoadError extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: props.error != null ? props.error : false,
    };
  }

  static contextType = LoaderServiceContext;

  get error() {
    return this.state.error;
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Bundle failed to load!');
    console.error(error);
    console.error(errorInfo);
  }

  render() {
    if (this.error || !this.props.children) {
      // Stop the page loader if it's running.
      const loader = this.context;
      loader.stop('BundleLoadError', true);

      const message = this.props.message || `An error occurred loading ${env.appName}`;
      const directions = this.props.directions || `Please try again in a bit. If this issue persists, please contact the development team with the steps you used to reproduce this issue.`;

      return (
        <PageLayout className={styles.BundleLoadError} data-test="error">
          <TitleXL>{ message }</TitleXL>
          <p>{ directions }</p>
        </PageLayout>
      );
    } else {
      return this.props.children;
    }
  }
}
