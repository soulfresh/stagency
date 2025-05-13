import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import {
  Label,
  PercentInputRHF,
  Textarea,
  HR,
} from '~/components';
import { useAutoSaveForm } from '~/utils';

import styles from './PercentageOfNet.module.scss';

/**
 * @typedef {object} PercentageOfNetProps
 * @property {string} [className]
 * @property {number} [artistPercent]
 * @property {string} [notes]
 * @property {function} [onChange]
 * @property {*} [ref]
 */
/**
 * Form for configuring "Percentage of Net" deals.
 *
 * @type React.FC<PercentageOfNetProps>
 */
export const PercentageOfNet = React.forwardRef(({
  className,
  artistPercent,
  notes,
  onChange,
  ...rest
}, ref) => {
  const { register, control, formState: {errors} } = useAutoSaveForm(onChange);

  return (
    <form data-testid="PercentageOfNet"
      className={combineClasses(styles.PercentageOfNet, className)}
      {...rest}
      ref={ref}
    >
      <Label title="The artist will receive...">
        <PercentInputRHF
          name="artistPercent"
          control={control}
          defaultValue={artistPercent}
          allowNegative={false}
          rules={{
            required: {value: true, message: 'Required'},
            max: {value: 10000, message: 'Must be less or equal to 100%'},
            min: {value: 1, message: 'Must be greater than 0%'},
          }}
          placeholder="% of the Net Box Office Receipts"
          error={errors.artistPercent?.message}
        />
      </Label>
      <HR />
      <Label title="Notes">
        <Textarea
          defaultValue={notes}
          {...register('notes')}
        />
      </Label>
    </form>
  );
});

PercentageOfNet.propTypes = {
  /**
   * Will receive the current form values as they
   * change but only if the form is valid.
   *
   * @callback
   * @param {{}} values
   * @param {number} values.artistPercent
   * @param {string} values.notes
   */
  onChange: PropTypes.func,
  /**
   * The artist percent as a 4 digit integer (ie. 9000 = 90.00%)
   */
  artistPercent: PropTypes.number,
  notes: PropTypes.string
};

