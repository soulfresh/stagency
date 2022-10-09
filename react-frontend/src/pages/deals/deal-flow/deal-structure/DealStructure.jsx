import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';

import { DEAL_STRUCTURES } from '~/model';
import {
  Label,
  Select,
  SelectTrigger,
  SelectOption,
} from '~/components';
import {
  PercentageOfNet,
  PromoterProfit,
  FlatGuarantee,
} from './forms'

import styles from './DealStructure.module.scss';

// TODO These should come from app config
// Associate a component with each deal structure.
export const TYPES = [
  {component: PercentageOfNet, ...DEAL_STRUCTURES[0]},
  {component: FlatGuarantee  , ...DEAL_STRUCTURES[1]},
  {component: PromoterProfit , ...DEAL_STRUCTURES[2]},
]

/**
 * The `<DealStructure>` page allows the user to select
 * the structure to use for the current deal (such as a
 * Percentage of Net where the artist makes a percentage
 * of the net revenue from the event).
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {DealStructure} [props.dealStructure]
 * @param {function} [props.onChange]
 * @param {boolean} [props.disableAnimations]
 * @param {function} [props.ResizeObserver]
 * @return {React.ReactElement}
 */
export function DealStructure({
  className,
  dealStructure,
  onChange,
  disableAnimations,
  ResizeObserver,
  ...rest
}) {
  const [type, setType] = React.useState(
    dealStructure?.structureTypeId != null
      ? TYPES.find(i => i.id === dealStructure?.structureTypeId)
      : null
  );
  const Component = type?.component;

  const handleFormChange = values => {
    if (onChange) {
      onChange({...values, structureTypeId: type.id})
    }
  }

  return (
    <div data-testid="DealStructure"
      className={combineClasses(styles.DealStructure, className)}
      {...rest}
    >
      <Label title="Deal Structure" className={styles.dealStructureLabel}>
        <Select
          className={styles.select}
          value={type}
          options={TYPES}
          optionToString={item => item.name}
          onChange={(item) => setType(item)}
          content={item => (
            <SelectOption className={styles.option}>
              <span className={styles.optionName}>{item.name}</span>
              <span className={styles.optionDescription}>{item.description}</span>
            </SelectOption>
          )}
          disableTransitions={disableAnimations}
          layerOptions={{ResizeObserver}}
        >
          {({className, ...props}, item) =>
            <SelectTrigger
              className={combineClasses(styles.trigger, className)}
              {...props}
            >
              {item ? item.name : "Select a deal structure"}
            </SelectTrigger>
          }
        </Select>
      </Label>
      {Component &&
        <Component
          className={combineClasses(styles.form)}
          onChange={handleFormChange}
        />
      }
    </div>
  );
}

DealStructure.propTypes = {
  /**
   * The current deal structure object. It should include
   * the id of this deal structure, the id of the deal structure type,
   * and the details of the selected deal structure.
   */
  dealStructure: PropTypes.object,
  /**
   * Handle changes to the deal structure once the form is valid.
   */
  onChange: PropTypes.func,
  /**
   * Turn off animations during testing.
   */
  disableAnimations: PropTypes.bool,
  /**
   * Provide a ResizeObserver polyfill during testing.
   */
  ResizeObserver: PropTypes.func,
  /**
   * Any other props will be passed to the root HTML element.
   */
  'other props...': PropTypes.any,
};

