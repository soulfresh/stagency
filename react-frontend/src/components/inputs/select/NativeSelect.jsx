import React from 'react';
import PropTypes from 'prop-types';

import { useInput } from '~/utils';

import styles from './NativeSelect.module.scss';


/**
 * @typedef {object} NativeSelectProps
 */
/**
 * `<NativeSelect>` provides a standard select element with our
 * custom styles. You can use it exactly the same way as the
 * native Select element.
 *
 * @type React.FC<NativeSelectProps>
 */
export const NativeSelect = React.forwardRef((props, ref) => {
  const {
    // Dereference so it's not passed along
    hasValue,
    ...nextProps
  } = useInput(props, styles.NativeSelect);

  return (
    <select
      data-testid="NativeSelect"
      {...nextProps}
      ref={ref}
    />
  );
});

NativeSelect.propTypes = {
  /**
   * Whether or not to use the more condensed visual style.
   */
  narrow: PropTypes.bool,
  /**
   * `NativeSelect` accepts all of the same properties as the
   * native Select element.
   */
  'other props...': PropTypes.any,
};

