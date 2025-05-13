import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';
import { useMaybeControlled } from '@thesoulfresh/react-tools';

import { ProgressBar } from '../progress-bar';
import { TitleL } from '../../text';
import { PreviousAction, NextAction } from '../../buttons';
import { clamp, maybeClamp } from '~/utils';

import styles from './MultistepFlow.module.scss';

function RenderPrevious({
  index,
  onPrevious,
  children = 'Previous',
}) {
  const previous = index > 0;
  return (
    <PreviousAction
      disabled={!previous}
      style={{visibility: !previous ? 'hidden' : 'visible'}}
      display="link"
      feel="primary"
      onClick={() => onPrevious()}
    >
      {children}
    </PreviousAction>
  );
}

function RenderNext({
  index,
  last,
  onNext,
  children = 'Next',
}) {
  const next = index < last;
  return (
    <NextAction
      disabled={!next}
      style={{visibility: !next ? 'hidden' : 'visible'}}
      display="link"
      feel="primary"
      direction="left"
      onClick={() => onNext()}
    >
      {children}
    </NextAction>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 * @param {number} [props.index]
 * @param {number} [props.last]
 * @param {function} [props.onNext]
 * @param {function} [props.onPrevious]
 * @param {function} [props.renderNext]
 * @param {function} [props.renderPrevious]
 * @param {*} [props.step]
 * @param {*[]} [props.steps]
 */
export function Header({
  className,
  children,
  index,
  last,
  step,
  steps,
  onPrevious,
  onNext,
  renderPrevious = RenderPrevious,
  renderNext = RenderNext,
  ...rest
}) {
  return (
    <div className={combineClasses(styles.Header, className)} {...rest}>
      { renderPrevious({
        index,
        last,
        onNext,
        onPrevious,
        step,
        steps,
      })}
      <TitleL data-testid="MultistepFlowTitle" className={styles.headerTitle}>{children}</TitleL>
      { renderNext({
        index,
        last,
        onNext,
        onPrevious,
        step,
        steps
      })}
    </div>
  );
}

/**
 * `<MultistepFlow>` allows the user to move through
 * a multistep process/flow such as a multi page form.
 * It receives a list of `steps` indicating the title of
 * each step and a `children` function that should render
 * the content for the current step in the flow. It will
 * track it's own location within the flow unless you pass
 * the index prop, in which case it becomes a controlled
 * component and you are responsible for updating the index.
 *
 * You can also customize the content that is rendered on
 * either side of the title by passing the `renderPrevious`
 * and `renderNext` callbacks.
 *
 * ### Data
 *
 * All render props will receive `onNext` and `onPrevious`
 * callbacks that can be used for navigating through the
 * flow. If you pass any data to these callbacks, it will
 * be collected in an array at the index of the assocated step.
 * This data will then be pass back to your render props
 * for the next view. You can use this to influence the
 * next/previous view or to store data to a server.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {number} [props.index]
 * @param {string[]|object[]} [props.steps]
 * @param {function} [props.children]
 * @param {function} [props.onChange]
 * @param {function} [props.renderNext]
 * @param {function} [props.renderPrevious]
 */
export function MultistepFlow({
  className,
  index: i,
  steps = [],
  children,
  onChange,
  renderPrevious,
  renderNext,
  ...rest
}) {
  const last = steps.length - 1;
  const data = React.useRef(new Array(steps.length).fill(undefined));

  const makeCallbackProps = (newIndex) => ({
    index: newIndex,
    last,
    step: steps[newIndex],
    steps,
    data: data.current,
  })

  const handleChange = newIndex => {
    if (onChange) {
      onChange(makeCallbackProps(newIndex));
    }
  }

  const [index, setIndex] = useMaybeControlled(maybeClamp(i, last), handleChange, 0);

  const progress = index / last;

  const page = steps[index];
  const title = typeof(page) === 'string' ? page : page?.title;

  const handleNext = (d) => {
    const newIndex = clamp(index + 1, last);
    if (newIndex !== index) {
      data.current[index] = d;
      setIndex(newIndex);
    }
  };

  const handlePrevious = (d) => {
    const newIndex = clamp(index - 1, last);
    if (newIndex !== index) {
      data.current[index] = d;
      setIndex(newIndex);
    }
  };

  return (
    <div data-testid="MultistepFlow"
      className={combineClasses(styles.MultistepFlow, className)}
      {...rest}
    >
      <Header
        index={index}
        last={last}
        step={page}
        steps={steps}
        onNext={handleNext}
        onPrevious={handlePrevious}
        renderNext={renderNext}
        renderPrevious={renderPrevious}
      >
      {title}
      </Header>
      <ProgressBar progress={progress} />
      {children &&
        children({
          ...makeCallbackProps(index),
          onNext: handleNext,
          onPrevious: handlePrevious,
        })
      }
    </div>
  );
}

MultistepFlow.propTypes = {
  /**
   * The current index in the list of steps.
   */
  index: PropTypes.number,
  /**
   * The list of step titles in the flow that will be used
   * to determine the number of steps in the flow and the
   * header title of each step.
   */
  steps: PropTypes.arrayOf(PropTypes.string),
  /**
   * A function to render the current step.
   * It will receive props that you can use to determine
   * what content to render.
   *
   * @param {object} props
   * @param {number} props.index - The current index.
   * @param {number} props.last - The index of the last page for easy range comparisons.
   * @param {string|object} props.step - The name of the current step.
   * @param {string[]|object[]} props.steps - The full step list.
   * @param {function} props.onNext - A function you can call to go to the next step.
   *   Anything you pass to this function will be collected and passed to your
   *   render props on the next render.
   * @param {function} props.onPrevious - A function you can call to go to the previous step.
   *   Anything you pass to this function will be collected and passed to your
   *   render props on the next render.
   * @param {*[]} props.data - Any data received by the `onNext` and `onPrevious`
   *   callbacks as the user moved through the flow. Each index in this array
   *   represents the data for the assocated step.
   * @return {React.ReactNode}
   */
  children: PropTypes.func.isRequired,
  /**
   * A function that will be called when the
   * page index changes.
   * @param {object} props
   * @param {number} props.index - The current (new page) index.
   * @param {number} props.last - The index of the last page for easy range comparisons.
   * @param {string|object} props.step - The name of the current step.
   * @param {string[]|object[]} props.steps - The full step list.
   * @param {*[]} props.data - Any data received by the `onNext` and `onPrevious`
   *   callbacks as the user moved through the flow. Each index in this array
   *   represents the data for the assocated step.
   * @param {string[]|object[]} props.steps - The full steps list.
   */
  onChange: PropTypes.func,
  /**
   * A function to render the content to the left of the
   * step title.
   * @param {object} props
   * @param {number} props.index - The current index in steps (not the "next" index)
   * @param {number} props.last - The index of the last page for easy range comparisons.
   * @param {function} props.onNext - A function you can call to go to the next step.
   *   Anything you pass to this function will be collected and passed to your
   *   render props on the next render.
   * @param {function} props.onPrevious - A function you can call to go to the previous step.
   *   Anything you pass to this function will be collected and passed to your
   *   render props on the next render.
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
   * @param {function} props.onNext - A function you can call to go to the next step.
   *   Anything you pass to this function will be collected and passed to your
   *   render props on the next render.
   * @param {function} props.onPrevious - A function you can call to go to the previous step.
   *   Anything you pass to this function will be collected and passed to your
   *   render props on the next render.
   * @param {string|object} props.step - The current step item from the steps list
   * @param {string[]|object[]} props.steps - The full steps list
   * @return {React.ReactNode}
   */
  renderPrevious: PropTypes.func,
  /**
   * Any other props you pass will be applied to the root element.
   */
  'other props...': PropTypes.any,
};

