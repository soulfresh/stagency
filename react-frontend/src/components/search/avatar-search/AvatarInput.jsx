import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import { InputDecorator } from '../../inputs/InputDecorator.jsx';
import { Action } from '../../buttons';
import { Avatar } from '../../avatar';

import styles from './AvatarInput.module.scss';

/**
 * `<AvatarInput>` is a button that looks like an input
 * and can be used to select an object that can be represented
 * as an avatar (name and image)
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} [props.placeholder]
 * @param {string} [props.name]
 * @param {string} [props.image]
 * @param {function} [props.onClick]
 * @param {function} [props.ResizeObserver]
 * @return {React.ReactElement}
 */
export function AvatarInput({
  placeholder,
  name,
  image,
  onClear,
  ResizeObserver,
  className,
  ...rest
}) {
  return (
    <InputDecorator
      className={combineClasses(className, styles.AvatarInput)}
      onClear={onClear}
      clearable
      value={name}
      {...rest}
    >
      {({
          className: inputClassName,
          // Dereference so it's not passed along to Action
          value,
          ...props
        },
        decoratorRef
      ) =>
        <Action
          className={combineClasses(styles.AvatarAction, inputClassName)}
          placeholder={placeholder}
          {...props}
          ref={decoratorRef}
        >
          {(name || image ) &&
            <Avatar
              className={styles.Avatar}
              name={name}
              image={image}
              labelled
              size="s"
              ResizeObserver={ResizeObserver}
            />
          }
        </Action>
      }
    </InputDecorator>
  )
}

AvatarInput.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  image: PropTypes.string,
  ResizeObserver: PropTypes.func,
  /**
   * Any other props are passed to the InputDecorator and also get
   * passed through to the Action.
   */
  'other props...': PropTypes.any,
};
