import React from 'react';
import PropTypes from 'prop-types';

import { combineClasses } from '@thesoulfresh/utils';
import { useMaybeControlled } from '@thesoulfresh/react-tools';

import {
  AvatarSearch,
  Label,
  Select,
  SelectTrigger,
  SelectOption,
  Fieldset
} from '~/components';

import styles from './Basics.module.scss';

/**
 * The `<Basics>` page is the first page in the Create Deal
 * flow and collects the basic info about the deal like
 * the artists and venues involved.
 *
 * @param {object} props
 *
 * @param {object} [props.artist]
 * @param {function} [props.onArtistChange]
 * @param {function} [props.onArtistSearch]
 *
 * @param {object[]} props.eventTypes
 * @param {object} [props.eventType]
 * @param {function} [props.onEventTypeChange]
 *
 * @param {object[]} props.billingTypes
 * @param {object} [props.billingType]
 * @param {object} [props.onBillingTypeChange]
 *
 * @param {object} [props.events]
 * @param {function} [props.onEventsChange]
 * @param {function} [props.onVenueSearch]
 * @param {function} [props.onBuyerSearch]
 * @param {function} [props.onCopromoterSearch]
 *
 * @param {string} [props.className]
 * @param {function} [props.ResizeObserver]
 * @return {React.ReactElement}
 */
export function Basics({
  className,
  // Artist
  artist,
  onArtistChange,
  onArtistSearch,
  // Event Type
  eventTypes,
  eventType,
  onEventTypeChange,
  // Billing Type
  billingTypes,
  billingType,
  onBillingTypeChange,
  // Events
  events: eventsProp,
  onEventsChange,
  onVenueSearch,
  onBuyerSearch,
  onCopromoterSearch,
  ResizeObserver,
  ...rest
}) {
  if (eventsProp?.length === 0) {
    eventsProp = [{venue: undefined, buyer: undefined, copromoter: undefined}]
  }
  const [events, setEvents] = useMaybeControlled(eventsProp, onEventsChange, [{
    venue: undefined,
    buyer: undefined,
    copromoter: undefined,
  }]);

  const onEventChange = (event, index) => {
    if (event) {
      const newEvents = [...events];
      newEvents.splice(index, 1, event);
      setEvents(newEvents);
    }
  }

  const onDeleteEvent = (event, index) => {
    if (event) {
      const newEvents = [...events];
      newEvents.splice(index, 1);
      setEvents(newEvents);
    }
  }

  return (
    <div data-testid="Basics"
      className={combineClasses(styles.Basics, className)}
      {...rest}
    >
      <Label title="Select an artist">
        <AvatarSearch
            value={artist}
            placeholder="Search for artists"
            modalLabel="Artist Search Dialog"
            onSearch={onArtistSearch}
            onClear={() => onArtistChange(null)}
            onSelect={artist => onArtistChange(artist)}
            getName={a => a.name}
            getImage={a => a.image?.url}
            narrow
            ResizeObserver={ResizeObserver}
          />
      </Label>
      <Label title="Event type" className={styles.Padding}>
        <Select
          value={eventType}
          options={eventTypes}
          optionToString={t => t.comment}
          content={item => <SelectOption>{item.comment}</SelectOption>}
          onChange={event => onEventTypeChange(event)}
          disableTransitions
          ResizeObserver={ResizeObserver}
        >
          {(props, item) =>
            <SelectTrigger {...props}> {item ? item.comment : "Select event type"} </SelectTrigger>
          }
        </Select>
      </Label>
      <Label title="Billing" className={styles.Padding}>
        <Select
          value={billingType}
          options={billingTypes}
          optionToString={t => t.comment}
          content={item => <SelectOption>{item.comment}</SelectOption>}
          onChange={event => onBillingTypeChange(event)}
          disableTransitions
          ResizeObserver={ResizeObserver}
        >
          {(props, item) =>
            <SelectTrigger {...props}> {item ? item.comment : "Select billing"} </SelectTrigger>
          }
        </Select>
      </Label>

      {
        events.map((event, index) => (
          <EventDetails
            onVenueSearch={onVenueSearch}
            venue={event.venue}
            onBuyerSearch={onBuyerSearch}
            buyer={event.buyer}
            onCopromoterSearch={onCopromoterSearch}
            copromoter={event.copromoter}
            onChange={(event) => onEventChange(event, index)}
            onDelete={() => onDeleteEvent(event, index)}
            title={`Show ${events.length > 1 ? index + 1 + ' ' : ''}Details`}
            key={index}
          />
        ))
      }
    {/*
      Bring this back once we implement multiple events on a deal
      <AddAction
        transparent
        display="link"
        feel="primary"
        onClick={() => setEvents(events => [...events, {}])}>Add Another Show
      </AddAction>
    */}
    </div>
  );
}

Basics.propTypes = {
  /**
   * A callback to search for artists to display in the artist search modal
   */
  onArtistSearch: PropTypes.func,

  /**
   * A callback to search for venues to display in the venue search modal
   */
  onVenueSearch: PropTypes.func,

  /**
   * A callback to search for venues to display in the venue search modal
   */
  onBuyerSearch: PropTypes.func,

  /**
   * A callback to search for co-prommoters to display in the co-promoter search modal
   */
  onCopromoterSearch: PropTypes.func,

  /**
   * A callback with the details of this form provided on any change
   */
  onChange: PropTypes.func,

  /**
   * Any other props will be passed to the wrapping div development
   */
  'other props...': PropTypes.any,
};

/**
 * The `<EventDetails>` object is used in the Basics page
 * to present an area to add one or more events and some details
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.title
 * @param {function} [props.onVenueSearch]
 * @param {object} [props.venue]
 * @param {function} [props.onBuyerSearch]
 * @param {object} [props.buyer]
 * @param {function} [props.onCopromoterSearch]
 * @param {object} [props.copromoter]
 * @param {function} [props.onChange]
 * @param {function} [props.onDelete]
 * @return {React.ReactElement}
 * @param {function} [props.ResizeObserver]
 */
export function EventDetails({
  className,
  title,
  onVenueSearch,
  venue,
  onBuyerSearch,
  buyer,
  onCopromoterSearch,
  copromoter,
  onChange,
  onDelete,
  ResizeObserver,
  ...rest
}) {
  return (
    <Fieldset
      data-testid="EventDetails"
      className={combineClasses(styles.EventDetails, className)}
      legend={title}
      tight
      // onDelete={onDelete}
      {...rest}
    >
      <AvatarSearch
        placeholder="Search venue name"
        modalLabel="Artist Search Dialog"
        onSearch={onVenueSearch}
        onSelect={v => onChange({venue: v, buyer, copromoter})}
        onClear={() => onChange({venue: null, buyer, copromoter})}
        getName={a => a.name}
        getImage={a => a.image?.url}
        narrow
        tight
        ResizeObserver={ResizeObserver}
      />
      <AvatarSearch
        placeholder="Search buyer name"
        modalLabel="Buyer Search Dialog"
        onSearch={onBuyerSearch}
        onSelect={b => onChange({venue, buyer: b, copromoter})}
        onClear={() => onChange({venue, buyer: null, copromoter})}
        getName={a => a.name}
        getImage={a => a.image?.url}
        narrow
        tight
        ResizeObserver={ResizeObserver}
      />
      <AvatarSearch
        placeholder="Search co-promoter"
        modalLabel="Co-promoter Search Dialog"
        onSearch={onCopromoterSearch}
        onSelect={c => onChange({venue, buyer, copromoter: c})}
        onClear={() => onChange({venue, buyer, copromoter: null})}
        getName={a => a.name}
        getImage={a => a.image?.url}
        narrow
        tight
        ResizeObserver={ResizeObserver}
      />
    </Fieldset>
  );
}

EventDetails.propTypes = {
  /**
   * A callback to search for venues to display in the venue search modal
   */
  onVenueSearch: PropTypes.func,

  /**
   * A venue object that can be passed in as the selected option in the venue search modal
   */
  venue: PropTypes.object,

  /**
   * A callback to search for buyers to display in the buyer search modal
   */
  onBuyerSearch: PropTypes.func,

  /**
   * A buyer object that can be passed in as the selected option in the buyer search modal
   */
  buyer: PropTypes.object,

  /**
   * A callback to search for copromoters to display in the copromoter search modal
   */
  onCopromoterSearch: PropTypes.func,

  /**
   * A copromoter object that can be passed in as the selected option in the copromoter search modal
   */
  copromoter: PropTypes.object,

  /**
   * Any other props will be passed to the wrapping div development
   */
  'other props...': PropTypes.any,
};
