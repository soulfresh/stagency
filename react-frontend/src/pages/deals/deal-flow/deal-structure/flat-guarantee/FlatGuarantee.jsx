import React from 'react';
// import { DevTool } from '@hookform/devtools';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import {
  Label,
  CurrencyInputRHF,
  Textarea,
  HR,
} from '~/components';
import { useAutoSaveForm } from '~/utils';

import styles from './FlatGuarantee.module.scss';

/**
 * @typedef {object} FlatGuaranteeProps
 * @property {string} [className]
 * @property {number} [guarantee]
 * @property {string} [notes]
 * @property {function} [onChange]
 * @property {*} [ref]
 */
/**
 * Form for configuring "FlatGuarantee" deals.
 *
 * @type React.FC<FlatGuaranteeProps>
 */
export const FlatGuarantee = React.forwardRef(({
  className,
  guarantee,
  notes,
  onChange = (...args) => console.log('watch', ...args),
  ...rest
}, ref) => {
  const { register, control, formState: {errors} } = useAutoSaveForm(onChange);

  return (
    <form data-testid="FlatGuarantee"
      className={combineClasses(styles.FlatGuarantee, className)}
      {...rest}
    >
      <Label title="The artist will receive...">
        <CurrencyInputRHF
          name="guarantee"
          control={control}
          defaultValue={guarantee}
          allowNegative={false}
          rules={{
            required: {value: true, message: 'Required'},
            min: {value: 1, message: 'Guarantee is required'},
          }}
          placeholder="Guaranteed Amount"
          error={errors.guarantee?.message}
        />
      </Label>
      <HR />
      <Label title="Notes">
        <Textarea
          defaultValue={notes}
          {...register('notes')}
        />
      </Label>
      {/* <DevTool control={control} /> */}
    </form>
  );
});

FlatGuarantee.propTypes = {
  /**
   * Will receive the current form values as they
   * change but only if the form is valid.
   *
   * @callback
   * @param {{}} values
   * @param {number} values.guarantee
   * @param {string} values.notes
   */
  onChange: PropTypes.func,
  /**
   * The guaranteed amount the artist will receive in pennies.
   */
  guarantee: PropTypes.number,
  notes: PropTypes.string
};

