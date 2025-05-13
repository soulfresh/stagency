import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';
import { useMaybeControlled } from '@thesoulfresh/react-tools';

// import { InputDecorator } from '../InputDecorator.jsx';
import { SelectTrigger, SelectOption } from '../select';
import { localeUses24HourTime, locale0Hour, formatTime, formatDuration } from '~/utils';
import { Dropdown } from '../../dropdown';

import styles from './TimeInput.module.scss';

export const Option = React.forwardRef(({className, ...props}, ref) => (
  <SelectOption
    className={combineClasses(styles.Option, className)}
    {...props}
    ref={ref}
  />
))

/**
 * @typedef {object} TimeColumnProps
 * @property {*} [ref]
 */
/**
 * @type React.FC<TimeColumnProps>
 */
export const TimeColumn = React.forwardRef(({
  'aria-label': ariaLabel,
  length = 12,
  value,
  startFromEnd,
  increment = 1,
  onChange,
  locale,
  className,
  firstRef,
  lastRef,
  children,
  ...rest
}, ref) => {
  const count = Math.round(length/increment);

  return (
    <div
      className={combineClasses(styles.TimeColumn, className)}
      ref={ref}
      aria-label={`${ariaLabel} options`}
      {...rest}
    >
      {Array.from(new Array(count), (_, i) => {
        const v = i * increment;
        return (
          <Option
            className={value === v && 'active'}
            key={i}
            onClick={() => onChange && onChange(i)}
            aria-label={`${ariaLabel} ${v}`}
            // Focus trap first element
            ref={(i === value) ? (firstRef || lastRef) : undefined}
            role="option"
            // TODO This will be required for ARIA
            // aria-selected="false"
          >
            {
              (!startFromEnd
                ? String(v)
                : i === 0
                  // There's probably a clever way to do this with modulo but I
                  // can't figure out.
                  ? String(length)
                  : String(v)
              ).padStart(2, '0')
            }
          </Option>
        )
      }
      )}
    </div>
  )
});

export const AmPm = React.forwardRef(({
  morning,
  onChange,
  ...props
}, ref) => (
  <div className={styles.AmPm} aria-label="AM/PM options" {...props}>
    <Option
      className={morning && 'active'}
      onClick={() => onChange && onChange(true)}
    >
      AM
    </Option>
    <Option
      className={!morning && 'active'}
      onClick={() => onChange && onChange(false)}
      // Focus trap last element
      ref={ref}
    >
      PM
    </Option>
  </div>
));

function timeInputToDate(v) {
  if (v === undefined) {
    return undefined;
  }
  else if (!v) {
    return new Date('1900-01-01T00:00:00.000');
  }
  else if (typeof(v) === 'string') {
    return new Date(`1900-01-01T${v}`);
  } else {
    return new Date(v);
  }
}

/**
 * `<TimeInput>` provides a dropdown menu for selecting a time or duration. It
 * receives an ISO time string value and emits one back through the `onChange`
 * callback. It will display the time in the user's preferred locale
 * so if the user prefers 24 hour time display, they will be able to select from
 * a 24 hour list. Otherwise, they will see a 12 hour list with AM and PM
 * options. You can force display of a 24 hour time cycle by passing the
 * `h24` prop.
 *
 * ### Duration
 *
 * You can also use this component to display a time duration (as opposed to a
 * specific time) by passing the `duration` prop. When you use the `duration`
 * prop, the user will be able to select from a 24 hour time drop down and the
 * time display will never show the AM/PM selector.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} [props.placeholder]
 * @param {string} [props.value]
 * @param {string} [props.onChange]
 * @param {string} [props.withSeconds]
 * @param {string} [props.duration]
 * @param {string} [props.h24]
 * @param {string} [props.minuteIncrement]
 * @param {string} [props.secondIncrement]
 * @param {string} [props.locale]
 * @param {string} [props.ResizeObserver]
 * @return {React.ReactElement}
 */
export const TimeInput = React.forwardRef(({
  'data-testid': testId = 'TimeInput',
  placeholder,
  value,
  onChange,
  withSeconds,
  duration,
  h24 = duration,
  minuteIncrement = 5,
  secondIncrement = 5,
  locale,
  className,

  // Dropdown props
  isOpen,
  onOpen,
  onClose,
  layerOptions,

  disableTransitions,
  ResizeObserver,
  ...rest
}, ref) => {
  const use24HrTime = React.useMemo(() => {
    if (h24 === undefined ) return localeUses24HourTime(locale);
    else return h24;
  }, [h24, locale]);
  const startHour = React.useMemo(() => locale0Hour(locale), [locale]);

  const handleChange = (t) => {
    if (onChange) {
      const e = formatDuration(t, true, 'en-US');
      onChange(e);
    }
  }

  // TODO Full accessibility would mean providing aria attributes and arrow key navigation.
  // - Arrow up/down should navigate inside of the column
  // - Tab/arrow left/arrow right should navigate between columns
  // - Typing a number should select the correct value in a column
  // TODO Should also be able to type a number like 7.55 for 07:55 or maybe in
  // total minutes like 180 for 2:00 when focused on the trigger.
  const [time, setTime] = useMaybeControlled(
    timeInputToDate(value),
    handleChange,
    timeInputToDate(false),
  );

  return (
    <Dropdown
      className={styles.TimeInput}
      // Override the role provided by Dropdown
      role="listbox"
      layerOptions={{ResizeObserver, ...layerOptions}}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      disableTransitions={disableTransitions}
      content={(first, last) => (
        <div
          className={styles.dropdownContent}
        >
          <TimeColumn
            aria-label="hour"
            length={use24HrTime ? 24 : 12}
            value={use24HrTime ? time.getHours() : time.getHours() % 12}
            startFromEnd={startHour === 12 && !use24HrTime}
            onChange={h => {
              const morning = time.getHours() < 12;
              const delta = (use24HrTime || morning) ? 0 : 12;
              const t = (new Date(time)).setHours(h + delta);
              setTime(new Date(t));
            }}
            firstRef={first}
          >
            Hours
          </TimeColumn>
          <TimeColumn
            aria-label="minute"
            length={60}
            value={time.getMinutes()}
            increment={minuteIncrement}
            onChange={m => {
              const t = (new Date(time)).setMinutes(m * minuteIncrement);
              setTime(new Date(t));
            }}
            lastRef={(!withSeconds && use24HrTime) ? last : undefined}
          >
            Minutes
          </TimeColumn>
          {withSeconds &&
            <TimeColumn
              aria-label="second"
              length={60}
              value={time.getSeconds()}
              increment={secondIncrement}
              onChange={s => {
                const t = (new Date(time)).setSeconds(s * secondIncrement);
                setTime(new Date(t));
              }}
              lastRef={use24HrTime ? last : undefined}
            >
                Seconds
            </TimeColumn>
          }
          {!use24HrTime &&
            <AmPm
              morning={time.getHours() < 12}
              onChange={morning => {
                let delta = 0;
                if (morning && time.getHours() >= 12) {
                  delta = -12;
                } else if (!morning && time.getHours() < 12) {
                  delta = 12;
                }
                const t = (new Date(time)).setHours(time.getHours() + delta);
                setTime(new Date(t));
              }}
              ref={last}
            />
          }
        </div>
      )}
    >
      <SelectTrigger
        data-testid={testId}
        className={combineClasses(styles.SelectTrigger, className)}
        role="combobox"
        aria-haspopup="listbox"
        {...rest}
        ref={ref}
      >
        {placeholder &&
          // Force en-US to ensure we get the expected format
          formatDuration(time, true, 'en-US') === '00:00:00'
          ? placeholder
          : duration
            ? formatDuration(time, withSeconds, locale)
            : formatTime(time, withSeconds, locale)
        }
      </SelectTrigger>
    </Dropdown>
  );
});

TimeInput.propTypes = {
  /**
   * A placeholder to use before the user selects a time. If no placeholder is
   * specified, then the initial time value is shown (ex. "12:00 AM" for "en-US"
   * locale).
   */
  placeholder: PropTypes.string,
  /**
   * The time value to show as an ISO time string (ex. 00:00:00). By passing a
   * time value, the component becomes controlled and the `onChange` prop needs
   * to be used to set the `value`.
   */
  value: PropTypes.string,
  /**
   * A callback that receives the updated values selected by the user. If you
   * pass a `value`, then this prop is required and should update the `value`
   * prop. If you don't specify `value`, then you can use this prop as an event
   * handler.
   */
  onChange: PropTypes.func,
  /**
   * Whether to show the seconds column.
   */
  withSeconds: PropTypes.bool,
  /**
   * Whether to treat the time input as a duration input rather than a time
   * input. In display input mode, the "AM/PM" column is hidden and the hour
   * column is always 24 hours long.
   */
  duration: PropTypes.bool,
  /**
   * Force the time input to display time in 24 hour format. If you don't
   * specify this prop (preferred), then the user's locale determines the hour
   * format to show.
   */
  h24: PropTypes.bool,
  /**
   * Determines the increment to use in the minute column. If not specified,
   * then 5 minute increments are used. To allow users to select down to the
   * single minute, pass 1 for this prop.
   */
  minuteIncrement: PropTypes.number,
  /**
   * Determines the increment to use in the seconds column. If not specified,
   * then 5 minute increments are used. To allow users to select down to the
   * single second, pass 1 for this prop.
   */
  secondIncrement: PropTypes.number,
  /**
   * The locale to display numbers in. It is preferred not to pass this prop
   * which will allow this component to determine the locale based on the user's
   * preferences.
   */
  locale: PropTypes.string,
  /**
   * Allows you to control the open/closed state of the menu.
   */
  isOpen: PropTypes.bool,
  /**
   * A callback to handle open events.
   */
  onOpen: PropTypes.func,
  /**
   * A callback to handle close events.
   */
  onClose: PropTypes.func,
  /**
   * Any options accepted by react-laag layer options.
   */
  layerOptions: PropTypes.object,
  /**
   * Provide a ResizeObserver polyfill during testing.
   */
  ResizeObserver: PropTypes.func,
  /**
   * Any other props you pass will be forwarded to the root div
   * element.
   */
  'other props...': PropTypes.any,
};

