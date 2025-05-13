import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import {
  Label,
  CurrencyInputRHF,
  PercentInputRHF,
  Textarea,
  HR,
} from '~/components';
import { useAutoSaveForm } from '~/utils';

import styles from './PromoterProfit.module.scss';

/**
 * @typedef {object} PromoterProfitProps
 * @property {string} [className]
 * @property {number} [guarantee]
 * @property {number} [artistPercent]
 * @property {number} [promoterPercent]
 * @property {string} [notes]
 * @property {function} [onChange]
 * @property {*} [ref]
 */
/**
 * `<PromoterProfit>` form for configuring deals where artists
 * get a guarantee + % of net after promoter profits.
 *
 * @type React.FC<PromoterProfitProps>
 */
export const PromoterProfit = React.forwardRef(({
  className,
  guarantee,
  artistPercent,
  promoterPercent,
  notes,
  onChange,
  ...rest
}, ref) => {
  const { register, control, formState: {errors} } = useAutoSaveForm(onChange);

  return (
    <form data-testid="PercentageOfNet"
      className={combineClasses(styles.PercentageOfNet, className)}
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
      <Label title="plus...">
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
      <Label title="after deducting adjustments and ...">
        <PercentInputRHF
          name="promoterPercent"
          control={control}
          defaultValue={promoterPercent}
          allowNegative={false}
          rules={{
            required: {value: true, message: 'Required'},
            max: {value: 10000, message: 'Must be less or equal to 100%'},
            min: {value: 1, message: 'Must be greater than 0%'},
          }}
          placeholder="% Promoter Profit"
          error={errors.promoterPercent?.message}
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

PromoterProfit.propTypes = {
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
   * The artist guarantee in pennies.
   */
  guarantee: PropTypes.number,
  /**
   * The artist percent of net after promoter profit is taken.
   */
  artistPercent: PropTypes.number,
  /**
   * The promoter percent of the deal profit.
   */
  promoterPercent: PropTypes.number,
  notes: PropTypes.string
};

