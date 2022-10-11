import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';
import { useId } from '@thesoulfresh/react-tools';

import { Tooltip } from '../tooltip';

import styles from './Avatar.module.scss';

/**
 * `<Avatar>` shows a user profile image with
 * an optional tooltip to see the full user name.
 * If the profile image is not specified, then
 * the user's initials are shown.
 *
 * @param {object} props
 * @param {string|string[]} [props.name]
 * @param {string} [props.image]
 * @param {string} [props.size]
 * @param {boolean} [props.tooltip]
 * @param {string} [props.className]
 * @param {boolean} [props.labelled]
 * @param {React.ReactNode} [props.title]
 * @param {React.ReactNode} [props.subtitle]
 * @param {function} [props.ResizeObserver]
 */
export function Avatar({
  name,
  image,
  size = 'm',
  tooltip = false,
  className,
  labelled,
  title,
  subtitle,
  ResizeObserver,
  ...rest
}) {
  const titleId = useId('avatar-title');
  const subtitleId = useId('avatar-subtitle');

  const [error, setError] = React.useState(false);

  const names = typeof(name) === 'string' ? name.trim().split(' ') : name;

  const firstName = names?.length > 0 ? names[0] : '';
  const lastName = names?.length > 1 ? names[names.length - 1] : '';

  const initials = [firstName, lastName]
    .filter(n => !!n)
    .map(n => n[0])
    .join('');

  const wrap = c => !tooltip
    ? c
    : <Tooltip content={name} layerOptions={{ResizeObserver}}>{ c }</Tooltip>;

  return (
    <span data-testid="Avatar"
      className={combineClasses(
        styles.Avatar,
        className,
        tooltip ? styles.withTooltip : null,
        subtitle ? styles.withSubtitle : null,
      )}
      {...rest}
      role="group"
      aria-labelledby={(labelled || title) ? titleId : undefined}
      aria-describedby={subtitle ? subtitleId : undefined}
    >
      <span
        className={combineClasses(
          styles.icon,
          size ? styles[size] : null,
        )}
      >
        {wrap((!image || error)
          ? <span role="img" aria-label={`${name} Profile`}>{initials}</span>
          : <img
              data-testid="AvatarImage"
              className={styles.image}
              src={image}
              alt={`${name} Profile`}
              onError={() => setError(true)}
            />
        )}
      </span>
      {(labelled || title || subtitle) &&
        <span className={styles.labelContainer}>
          {(labelled || title) &&
            <span id={titleId} className={styles.title}>{title || name}</span>
          }
          {subtitle &&
            <span id={subtitleId} className={styles.subtitle}>{subtitle}</span>
          }
        </span>
      }
    </span>
  );
}

Avatar.propTypes = {
  /**
   * Either a string containing the user's full name
   * or an array of the user's names.
   */
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,
  /**
   * The URL of the profile image to display.
   */
  image: PropTypes.string,
  /**
   * The size of the the avatar icon.
   */
  size: PropTypes.oneOf(['s', 'm', 'l', 'xl']),
  /**
   * Show a tooltip with the user's name.
   */
  tooltip: PropTypes.bool,
  /**
   * Show the name as a label next to the image.
   * If you want to show different text than the user's name,
   * you can use the `title` prop.
   */
  labelled: PropTypes.bool,
  /**
   * Text to show next to the profile picture instead
   * of the avatar name.
   */
  title: PropTypes.node,
  /**
   * Text to use as a subtitle under the label/title.
   */
  subtitle: PropTypes.node,
  /**
   * A ResizeObserver polyfill for use during testing.
   */
  ResizeObserver: PropTypes.func,
};

