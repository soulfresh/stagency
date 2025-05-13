import PropTypes from 'prop-types';

// file specific import to avoid circular deps
import { isValidDateParam } from '~/utils/format';

/**
 * The list of Deal Structures the app can present.
 *
 * **IMPORTANT**: The `id` property in this list MUST
 * match the associated deal structure id in the database.
 *
 * This map needs to be hardcoded in the UI code because each deal structure
 * form must be associated with a form in the UI. However, when the deal
 * structure data is saved to the backend, it will need to be associated with a
 * database id. As a result, this list maps the database ids for each deal
 * structure to their associated form and description.
 */
// TODO Let's actually get the id/name/description from the DB and use a key
// to associate the deals with their UI components
export const DEAL_STRUCTURES = [
  {id: 0 , name: 'Percentage of Net'                    , description: 'Artist receives % of Net Box Office Receipts.'}                                                                ,
  {id: 1 , name: 'Flat Guarantee'                       , description: 'Artist receives set guarantee.'}                                                                               ,
  {id: 2 , name: 'Guarantee Plus Bonus'                 , description: 'Artist receives set guarantee plus bonus if parameters are met.'}                                              ,
  {id: 3 , name: 'Guarantee Versus Percentage of Gross' , description: 'Artist receives set guarantee or a set percentage of the Gross Box Office Receipts - whichever is greater. '}  ,
  {id: 4 , name: 'Promoter Profit'                      , description: 'Artist receives set guarantee plus a % of the Net Box Office Receipts after adjustments and promoter profit.'} ,
]

export const DatePropType = (props, propName, componentName) => {
  const value = props[propName];
  const prefix = `Invalid prop "${propName}" supplied to "${componentName}".`;
  if (!isValidDateParam(value)) {
    return new Error(`${prefix} Value must be a Date, String or Number: ${value}`);
  }
  const date = new Date(value);
  if (isNaN(date)) {
    return new Error(`${prefix} Value is an Invalid Date: ${value}`);
  }
}

export const IdPropType = PropTypes.oneOfType([PropTypes.number, PropTypes.string])

export const DealStatusPropType = PropTypes.shape({
  value   : PropTypes.string.isRequired,
  comment : PropTypes.string.isRequired,
});

export const ImagePropType = PropTypes.shape({
  url    : PropTypes.string.isRequired,
  width  : PropTypes.number,
  height : PropTypes.number,
});

export const ArtistPropType = PropTypes.shape({
  id    : IdPropType.isRequired,
  name  : PropTypes.string.isRequired,
  image : ImagePropType.isRequired,
});

export const PersonPropType = PropTypes.shape({
  id    : IdPropType.isRequired,
  name  : PropTypes.string.isRequired,
  image : ImagePropType.isRequired,
});

export const VenuePropType = PropTypes.shape({
  id    : IdPropType.isRequired,
  name  : PropTypes.string.isRequired,
  image : ImagePropType.isRequired,
});

export const DealEventPropType = PropTypes.shape({
  id         : IdPropType.isRequired,
  date       : PropTypes.string,
  buyer      : PersonPropType,
  copromoter : PersonPropType,
  venue      : VenuePropType,
})

export const TicketTypePropType = PropTypes.shape({
  comment : PropTypes.string.isRequired,
  value   : PropTypes.string.isRequired,
});

export const TicketScalingPropType = PropTypes.shape({
  id            : IdPropType.isRequired,
  type          : TicketTypePropType,
  capacity      : PropTypes.number,
  complimentary : PropTypes.number,
  kills         : PropTypes.number,
  price         : PropTypes.number,
  facility      : PropTypes.number,
  charity       : PropTypes.number,
  secondary     : PropTypes.number,
  other         : PropTypes.number,
  notes         : PropTypes.string,
});

export const ShowSchedulePropType = PropTypes.shape({
  id        : IdPropType.isRequired,
  startTime : PropTypes.string.isRequired,
  type      : PropTypes.string.isRequired,
  notes     : PropTypes.string.isRequired,
});

export const PerformanceSchedulePropType = PropTypes.shape({
  id        : IdPropType.isRequired,
  startTime : PropTypes.string.isRequired,
  setLength : PropTypes.string.isRequired,
  notes     : PropTypes.string.isRequired,
  artist    : PropTypes.string.isRequired,
});

export const DealEventTypePropType = PropTypes.shape({
  value: PropTypes.string,
  comment: PropTypes.string,
});

export const DealEventBillingTypePropType = PropTypes.shape({
  value: PropTypes.string,
  comment: PropTypes.string,
});

export const ExpenseTypePropType = PropTypes.shape({
  value: PropTypes.string,
  comment: PropTypes.string,
});

export const ExpensePropType = PropTypes.shape({
  id: IdPropType.isRequired,
  name: PropTypes.string,
  type: ExpenseTypePropType,
  cost: PropTypes.number,
  maximum: PropTypes.number,
  notes: PropTypes.string,
});

export const DealSummaryPropType = PropTypes.shape({
  id                  : IdPropType.isRequired,
  artist              : ArtistPropType.isRequired,
  status              : DealStatusPropType.isRequired,
  lastUpdated         : DatePropType,
});

export const DealPropType = PropTypes.shape({
  id                  : IdPropType.isRequired,
  artist              : ArtistPropType,
  tickets             : PropTypes.arrayOf(TicketScalingPropType),
  showSchedule        : PropTypes.arrayOf(ShowSchedulePropType),
  performanceSchedule : PropTypes.arrayOf(PerformanceSchedulePropType),
  expenses            : PropTypes.arrayOf(ExpensePropType),
  status              : DealStatusPropType,
  lastUpdated         : DatePropType,
});

