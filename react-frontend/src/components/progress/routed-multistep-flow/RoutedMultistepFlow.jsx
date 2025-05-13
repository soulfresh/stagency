import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, useRouteMatch, useLocation, useHistory } from 'react-router';

import { PreviousAction, NextAction } from '../../buttons';
import { MultistepFlow } from '../multistep-flow';
import { clamp } from '~/utils';

/**
 * Find the index of the route in the steps parameter
 * that most closely matches the path. If no matches
 * are found, then the first step index is used as the default.
 * If multiple steps can be found in the path, then the
 * path match in the deepest folder is used.
 */
export function findRouteIndex(path, steps) {
  let index = 0;

  const matches = steps.reduce((acc, step, i) => {
    if (step.path && path.includes(step.path)) acc.push(i);
    return acc;
  }, []);

  if (matches.length > 1) {
    // TODO It would be better to use the deepest match
    // rather than the first match in the last folder.
    // Keeping this for now so I don't have to build that logic yet.
    const parts = path.split('/');
    const last = parts[parts.length - 1];
    index = steps.findIndex(step => step.path && last.includes(step.path));
  } else if (matches.length === 1) {
    index = matches[0];
  }

  return clamp(index, steps.length - 1);
}

function trimFront(value) {
  // https://stackoverflow.com/a/64982184
  return value.replace(/\//gy, '');
}

function trimBack(value) {
  return value.replace(/\/$/, '');
}

function trim(value) {
  return trimFront(trimBack(value));
}

function makeRelativeURL(base, path) {
  base = trimBack(base);
  if (path) return base + '/' + trim(path);
  else return base;
}

function makeStepRelativeURL(base, steps, index) {
  index = Math.min(index, steps.length - 1);
  const result = makeRelativeURL(base, steps[index]?.path);
  return '/' + trimFront(result);
}

/**
 * `<RoutedMultistepFlow>` provides a version of the `MultistepFlow`
 * that integrates with React Router. Instead of passing a list
 * of page titles as the step props, you need to pass a list of
 * route props that will be spread across
 * [React Router `Route`](https://reactrouter.com/web/api/Route)
 * components + a `title` key to use as the title.
 *
 * ```js
 * // Example step definition:
 * const steps = [{
 *   // This will be used as the title in the header.
 *   title: 'Page Title',
 *   // This is the `path` prop passed to the `Router` element for this step.
 *   path: 'first-page',
 *   // This is the React Router `render` prop used to render the content of this step.
 *   // The `render` prop will receive the state/data from RoutedMultistepFlow when
 *   // it is called. Alternatively, you could pass `children` or `component` prop
 *   // depending on your needs but they will not receive the flow state/data.
 *   render: () => <div>First Page</div>,
 * }];
 * ```
 *
 * The `render` function in your steps array will receive the
 * the following params:
 *
 * - index - The current index in steps (not the "previous" index)
 * - last - The index of the last page for easy range comparisons.
 * - nextURL - The URL to go to the next step.
 * - previousURL - The URL to go to the previous step.
 * - onNext - A function you can call to go to the next step.
 * - onPrevious - A function you can call to go to the previous step.
 * - step - The current step item from the steps list
 * - steps - The full steps list
 * - location - The React Router location object
 * - match - The React Router match object for the current URL
 * - history - The React Router history object
 *
 * ### MultistepFlow differences
 *
 * Since the `RoutedMultistepFlow` state is determined by the
 * page URL, you cannot pass the `index` property to control
 * the current step (unlike `MultistepFlow`). Instead you should
 * set the current page URL and the flow step will sync itself to the URL.
 *
 * @param {object} props
 * @param {object[]} props.steps
 * @param {(options: any) => void} [props.renderPrevious]
 * @param {function} [props.renderNext]
 * @param {function} [props.onChange]
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export function RoutedMultistepFlow({
  steps = [],
  renderPrevious,
  renderNext,
  onChange,
  ...rest
}) {
  // @ts-ignore
  const { url, path } = useRouteMatch();
  const { pathname } = useLocation();
  const history = useHistory();

  // Use pathname because the url and path don't include our
  // step route paths.
  const index = findRouteIndex(pathname, steps);
  const previousIndex = React.useRef(index);
  const previousURL = makeStepRelativeURL(url, steps, index - 1);
  const nextURL = makeStepRelativeURL(url, steps, index + 1);

  React.useEffect(() => {
    if (previousIndex.current !== index) {
      if (onChange) {
        onChange({
          index: index,
          last: steps.length - 1,
          step: steps[index],
          steps,
        });
      }

      previousIndex.current = index;
    }
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = (params) => {
    if (index < steps.length - 1) {
      history.push(nextURL);
    }
  }

  const handlePrevious = (params) => {
    if (index > 0) {
      history.push(previousURL);
    }
  }

  const navProps = {
    nextURL,
    previousURL,
    onNext: handleNext,
    onPrevious: handlePrevious,
  }

  if (!renderPrevious) {
    renderPrevious = ({index, previousURL}) => (
      <PreviousAction
        link
        href={previousURL}
        style={{visibility: index > 0 ? 'visible' : 'hidden'}}
      >
        Previous
      </PreviousAction>
    );
  }

  if (!renderNext) {
    renderNext = ({index, last, nextURL}) => (
      <NextAction
        link
        href={nextURL}
        direction="left"
        style={{visibility: index < last ? 'visible' : 'hidden'}}
      >
        Next
      </NextAction>
    );
  }

  return (
    <MultistepFlow
      index={index}
      steps={steps.map(s => s.title)}
      renderPrevious={(props) => renderPrevious({...props, ...navProps})}
      renderNext={(props) => renderNext({...props, ...navProps})}
      {...rest}
    >
      {(childProps) => {
        const getStepProps = (step) => {
          const out = {...step};
          const nextURL     = makeStepRelativeURL(url, steps, childProps.index + 1);
          const previousURL = makeStepRelativeURL(url, steps, childProps.index - 1);

          if (out.render)
            out.render = (routeProps) => step.render({
              // Pass the router props (history, location, match but not staticContext)
              history: routeProps.history,
              location: routeProps.location,
              match: routeProps.match,
              // Pass the state data from MultistepFlow
              ...childProps,
              // Override these MultistepFlow props
              onNext: () => routeProps.history.push(nextURL),
              onPrevious: () => routeProps.history.push(previousURL),
              // Pass RoutedMultistepFlow props
              nextURL,
              previousURL,
            })
          return out;
        }

        return (
          <Switch>
            {steps.map(({path: stepPath, ...step}, i) =>
              <Route
                {...getStepProps(step)}
                path={makeRelativeURL(path, stepPath)}
                key={step.name + step.index}
              />
            ).concat([
              <Route
                {...getStepProps(steps[0])}
                // Override the path so this route is used as the fallback.
                path={undefined}
                key="fallback-route"
              />
            ])}
          </Switch>
        );
      }}
    </MultistepFlow>
  );
}

RoutedMultistepFlow.propTypes = {
  /**
   * The list of steps in the flow. Each item should be
   * an object with a `title` to display in the header
   * and any props you want to pass to the `Route` object
   * for that step.
   *
   * See [React Router `Route`](https://reactrouter.com/web/api/Route)
   * for details on the props it takes.
   */
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      render: PropTypes.func,
      children: PropTypes.node,
      component: PropTypes.func,
    })
  ).isRequired,
  /**
   * A function to render the content to the left of the
   * step title.
   * @param {object} props
   * @param {number} props.index - The current index in steps (not the "next" index)
   * @param {number} props.last - The index of the last page for easy range comparisons.
   * @param {string} props.nextURL - The URL to go to the next step.
   * @param {string} props.previousURL - The URL to go to the previous step.
   * @param {function} props.onNext - A function you can call to go to the next step.
   * @param {function} props.onPrevious - A function you can call to go to the previous step.
   * @param {string|object} props.step - The current step item from the steps list
   * @param {string[]|object[]} props.steps - The full steps list
   * @return {React.ReactNode}
   */
  renderNext: PropTypes.func,
  /**
   * A function to render the content to the right of the
   * step title.
   * @param {object} props
   * @param {number} props.index - The current index in steps (not the "previous" index)
   * @param {number} props.last - The index of the last page for easy range comparisons.
   * @param {string} props.nextURL - The URL to go to the next step.
   * @param {string} props.previousURL - The URL to go to the previous step.
   * @param {function} props.onNext - A function you can call to go to the next step.
   * @param {function} props.onPrevious - A function you can call to go to the previous step.
   * @param {string|object} props.step - The current step item from the steps list
   * @param {string[]|object[]} props.steps - The full steps list
   * @return {React.ReactNode}
   */
  renderPrevious: PropTypes.func,
  /**
   * A function that will be called when the
   * page index changes.
   * @param {object} props
   * @param {number} props.index - The current (new page) index.
   * @param {number} props.last - The index of the last page for easy range comparisons.
   * @param {string|object} props.step - The name of the current step.
   * @param {string[]|object[]} props.steps - The full step list.
   * @param {string[]|object[]} props.steps - The full steps list.
   */
  onChange: PropTypes.func,
  /**
   * Any other props you pass will be applied to the root element.
   */
  'other props...': PropTypes.any,
};

