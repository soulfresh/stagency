// Looks like I'm getting fired 😬
import ReactPropTypesSecret from 'prop-types/lib/ReactPropTypesSecret';
// file specific import to avoid circular deps
import {
  DatePropType,
  DealStatusPropType,
  ImagePropType,
  ArtistPropType,
  PersonPropType,
  VenuePropType,
  TicketScalingPropType,
  TicketTypePropType,
  ShowSchedulePropType,
  PerformanceSchedulePropType,
  ExpenseTypePropType,
  ExpensePropType,
  DealSummaryPropType,
  DealEventPropType,
  DealEventTypePropType,
  DealEventBillingTypePropType,
  DealPropType,
} from '~/model';

/**
 * Validate a PropType definition.
 */
const toEqualType = (value: any, propType: Function) => {
  if (!propType || typeof(propType) !== 'function') {
    throw new Error(`propType passed to "toEqualType" is not a function: ${propType}`)
  }
  const error = propType(
    { value },
    'value',
    'toEqualType',
    value.toString ? value.toString() : value,
    null,
    ReactPropTypesSecret
  );
  if (error) {
    return { pass: false, message: () => error.message };
  } else {
    return { pass: true };
  }
};

/**
 * Validate a PropType.shape parameter (ie. an object with
 * PropType definitions for each key).
 */
const toHaveShape = (values: any, propTypes: any) => {
  if (!propTypes || typeof(propTypes) !== 'function') {
    throw new Error(`propType passed to "toHaveShape" should be a PropType shape definition: ${propTypes}`)
  }
  for(let valueName in values) {
    if (propTypes.hasOwnProperty(valueName)) {
      const error = propTypes[valueName](
        values,
        valueName,
        'toHaveShape',
        values[valueName],
        null,
        ReactPropTypesSecret
      );
      if (error) {
        return { pass: false, message: () => error.message };
      }
    }
  }
  return { pass: true };
};

// TODO Find a better way to make this recursive.
const toEqualTypeWithoutEmptyArrays = (value: any, propType: Function) => {
  const result = toEqualType(value, propType);
  if (!result.pass) return result;

  const emptyListName = Object.keys(value).find(key => {
    // Check that Array properties have at least one item.
    if (Array.isArray(value[key])) {
      return value[key].length === 0
    }
    return false
  })
  if (emptyListName) {
    return {
      pass: false,
      message: () => `expected deal "${emptyListName}" to have items but it was empty.`
    }
  } else {
    return {pass: true}
  }
}

export const PropTypeMatchers = {
  toEqualType,
  toHaveShape,
  toBeADate                 : (value : any) => toEqualType(value, DatePropType),
  toBeADealStatus           : (value : any) => toEqualType(value, DealStatusPropType),
  toBeAnImage               : (value : any) => toEqualType(value, ImagePropType),
  toBeAnArtist              : (value : any) => toEqualType(value, ArtistPropType),
  toBeAPerson               : (value : any) => toEqualType(value, PersonPropType),
  toBeAVenue                : (value : any) => toEqualType(value, VenuePropType),
  toBeADealEvent            : (value : any) => toEqualType(value, DealEventPropType),
  toBeATicketScaling        : (value : any) => toEqualType(value, TicketScalingPropType),
  toBeATicketType           : (value : any) => toEqualType(value, TicketTypePropType),
  toBeAShowSchedule         : (value : any) => toEqualType(value, ShowSchedulePropType),
  toBeAPerformanceSchedule  : (value : any) => toEqualType(value, PerformanceSchedulePropType),
  toBeAnExpenseType         : (value : any) => toEqualType(value, ExpenseTypePropType),
  toBeAnExpense             : (value : any) => toEqualType(value, ExpensePropType),
  toBeADealSummary          : (value : any) => toEqualType(value, DealSummaryPropType),
  toBeADealEventType        : (value : any) => toEqualType(value, DealEventTypePropType),
  toBeADealEventBillingType : (value : any) => toEqualType(value, DealEventBillingTypePropType),
  toBeADeal                 : (value : any) => toEqualTypeWithoutEmptyArrays(value, DealPropType),
};

