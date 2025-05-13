import {
  rand,
  randBetweenDate,
  randNumber,
  randText,
} from '@ngneat/falso';
import { DEFAULT_EXPENSES } from '~/model';
import {formatDuration} from '~/utils';

// User Profiles
import cat from '~/docs/assets/Grumpy Cat 1.jpg';

// Artists
import abba from '~/test/assets/artists/abba.jpg';
import arethaFranklin from '~/test/assets/artists/aretha franklin.jpg';
import davidBowie from '~/test/assets/artists/david bowie.jpg';
import donnaSummer from '~/test/assets/artists/donna summer.jpg';
import eltonJohn from '~/test/assets/artists/elton john.jpg';
import jamesBrown from '~/test/assets/artists/james brown.jpg';
import jimiHendrix from '~/test/assets/artists/jimi hendrix.jpg';
import ledZepplin from '~/test/assets/artists/led zepplin.jpg';
import marvinGaye from '~/test/assets/artists/marvin gaye.jpg';
import ninaSimone from '~/test/assets/artists/nina simone.jpg';
import stevieWonder from '~/test/assets/artists/stevie wonder.jpg';
import theRollingStones from '~/test/assets/artists/the rolling stones.jpg';
import theSupremes from '~/test/assets/artists/the supremes.jpg';
import willieNelson from '~/test/assets/artists/willie nelson.jpg';

// Venues
import bluebirdTheater from '~/test/assets/venues/bluebird theater.png';
import gothicTheater from '~/test/assets/venues/gothic theater.jpg';
import hiDive from '~/test/assets/venues/hi dive.png';
import larimerLounge from '~/test/assets/venues/larimer lounge.jpg';
import meadowlark from '~/test/assets/venues/meadowlark.png';
import ogdenTheater from '~/test/assets/venues/ogden theater.png';
import paramountTheater from '~/test/assets/venues/paramount theater.png';
import redRocks from '~/test/assets/venues/red rocks.png';

// Buyers and Copromoters
import dominicStein from '~/test/assets/users/user1.jpg';
import rexSingleton from '~/test/assets/users/user2.jpg';
import hillaryGraves from '~/test/assets/users/user3.jpg';
import summerSchwartz from '~/test/assets/users/user4.jpg';
import dominickDuffy from '~/test/assets/users/user5.jpg';
import abigailDean from '~/test/assets/users/user6.jpg';
import randyHodges from '~/test/assets/users/user7.jpg';
import teresaZamora from '~/test/assets/users/user8.jpg';
import raymondManning from '~/test/assets/users/user9.jpg';
import felipeGalvan from '~/test/assets/users/user10.jpg';

function minutes(count) {
  return count * 1000 * 60;
}

export const EVENT_TYPES = [
  {value: 'FESTIVAL'        , comment: 'Festival' } ,
  {value: 'PRIVATE_EVENT'   , comment: 'Private Event' } ,
  {value: 'FREE_APPEARANCE' , comment: 'Free Appearance' } ,
];

export const EVENT_BILLING_TYPES = [
  { value: "100%_HEADLINE"       , comment: '100% Headline' } ,
  { value: "CO-HEADLINE"         , comment: 'Co-Headline' } ,
  { value: "75%_SUPPORT_BILLING" , comment: '75% Support Billing' } ,
  { value: "50%_SUPPORT_BILLING" , comment: '50% Support Billing' } ,
  { value: "FESTIVAL_BILLING"    , comment: 'Festival Billing' } ,
  { value: "OTHER-OPENS"         , comment: 'Other-Opens' } ,
  { value: "NOT_APPLICABLE"      , comment: 'N/A' } ,
];


export const TICKET_TYPES = [
  { value: "GA_STANDING", comment: "GA Standing" },
  { value: "GA_SEATED", comment: "GA Seated" },
  { value: "UPPER_LEVEL", comment: "Upper Level" },
  { value: "VIP_SEATED", comment: "VIP Seated" },
  { value: "AUCTION", comment: "Auction" },
  { value: "BALCONY", comment: "Balcony" },
  { value: "BUNDLE", comment: "Bundle" },
  { value: "FAN_CLUB", comment: "Fan Club" },
  { value: "LAWN", comment: "Lawn" },
  { value: "LOGE", comment: "Loge" },
  { value: "LOWER_LEVEL", comment: "Lower Level" },
  { value: "MEZZANINE", comment: "Mezzanine" },
  { value: "ORCHESTRA", comment: "Orchestra" },
  { value: "OTHER", comment: "Other" },
  { value: "PIT", comment: "Pit" },
  { value: "RESERVED", comment: "Reserved" },
  { value: "UNKNOWN", comment: "Unknown" },
  { value: "VIP_STANDING", comment: "VIP Standing" },
  { value: "VIP_GOLD_CIRCLE", comment: "VIP Gold Circle" }
]

export const SHOW_SCHEDULE_TYPES = [
  'Load In',
  'Sound Check',
  'Rehersal',
  'Door',
  'Show Start',
  'Load Out',
];

export const EXPENSE_TYPES = [
  {value: 'FLAT_COST', comment: 'Flat Cost'},
  {value: 'PER_TICKET_COST', comment: 'Per Ticket Cost'},
  {value: 'PERCENTAGE_COST', comment: 'Percentage Cost'},
];

export const artists = [
  { name: 'ABBA', image: { url: abba, width: 300, height: 168 } },
  { name: 'Aretha Franklin', image: { url: arethaFranklin, width: 252, height: 200 } },
  { name: 'David Bowie', image: { url: davidBowie, width: 300, height: 168 } },
  { name: 'Donna Summer', image: { url: donnaSummer, width: 297, height: 170 } },
  { name: 'Elton John', image: { url: eltonJohn, width: 300, height: 168 } },
  { name: 'James Brown', image: { url: jamesBrown, width: 275, height: 183 } },
  { name: 'Jimi Hendrix', image: { url: jimiHendrix, width: 259, height: 194 } },
  { name: 'Led Zepplin', image: { url: ledZepplin, width: 252, height: 200 } },
  { name: 'Marvin Gaye', image: { url: marvinGaye, width: 191, height: 263 } },
  { name: 'Nina Simone', image: { url: ninaSimone, width: 224, height: 224 } },
  { name: 'Stevie Wonder', image: { url: stevieWonder, width: 200, height: 229 } },
  { name: 'The Rolling Stones', image: { url: theRollingStones, width: 276, height: 183 } },
  { name: 'The Supremes', image: { url: theSupremes, width: 634, height: 761 } },
  { name: 'Willie Nelson', image: { url: willieNelson, width: 275, height: 183 } },
];

export const venues = [
  { name: 'Bluebird Theater', image: { url: bluebirdTheater, width: 205, height: 114 } },
  { name: 'Gothic Theater', image: { url: gothicTheater, width: 225, height: 225 } },
  { name: 'Hi Dive', image: { url: hiDive, width: 222, height: 227 } },
  { name: 'Larimer Lounge', image: { url: larimerLounge, width: 225, height: 225 } },
  { name: 'Meadowlark', image: { url: meadowlark, width: 225, height: 225 } },
  { name: 'Ogden Theater', image: { url: ogdenTheater, width: 225, height: 225 } },
  { name: 'Paramount Theater', image: { url: paramountTheater, width: 225, height: 225 } },
  { name: 'Red Rocks', image: { url: redRocks, width: 200, height: 200 } },
]

export const buyers = [
  { name: 'Dominic Stein', image: { url: dominicStein, width: 1500, height: 1500 } },
  { name: 'Rex Singleton', image: { url: rexSingleton, width: 640, height: 640 } },
  { name: 'Hillary Graves', image: { url: hillaryGraves, width: 1000, height: 657 } },
  { name: 'Summer Schwartz', image: { url: summerSchwartz, width: 1200, height: 800 } },
  { name: 'Dominick Duffy', image: { url: dominickDuffy, width: 275, height: 183 } },
  { name: 'Abigail Dean', image: { url: abigailDean, width: 865, height: 865 } },
  { name: 'Randy Hodges', image: { url: randyHodges, width: 853, height: 580 } },
  { name: 'Teresa Zamora', image: { url: teresaZamora, width: 1024, height: 576 } },
  { name: 'Raymond Manning', image: { url: raymondManning, width: 275, height: 183 } },
  { name: 'Felipe Galvan', image: { url: felipeGalvan, width: 800, height: 533 } },
]

export const copromoters = [
  { name: 'Dominic Stein', image: { url: dominicStein, width: 1500, height: 1500 } },
  { name: 'Rex Singleton', image: { url: rexSingleton, width: 640, height: 640 } },
  { name: 'Hillary Graves', image: { url: hillaryGraves, width: 1000, height: 657 } },
  { name: 'Summer Schwartz', image: { url: summerSchwartz, width: 1200, height: 800 } },
  { name: 'Dominick Duffy', image: { url: dominickDuffy, width: 275, height: 183 } },
  { name: 'Abigail Dean', image: { url: abigailDean, width: 865, height: 865 } },
  { name: 'Randy Hodges', image: { url: randyHodges, width: 853, height: 580 } },
  { name: 'Teresa Zamora', image: { url: teresaZamora, width: 1024, height: 576 } },
  { name: 'Raymond Manning', image: { url: raymondManning, width: 275, height: 183 } },
  { name: 'Felipe Galvan', image: { url: felipeGalvan, width: 800, height: 533 } },
]

/**
 * This namespace provides functions that allow you
 * to generate data specific to your domain.
 */
export const fake = {
  profilePicture() {
    return cat;
  },

  /**
   * @param {Date} from
   * @param {Date} to
   */
  startTime(
    from = new Date('2000-01-01T00:00:00'),
    to = new Date('2000-01-01T23:59:59')
  ) {
    const date = randBetweenDate({ from, to });
    date.setSeconds(0);
    return formatDuration(date, true)
  },

  /**
   * A show duration.
   * @param {object} [options]
   * @param {number} [options.min] - in milliseconds
   * @param {number} [options.max] - in milliseconds
   */
  duration({
    min = minutes(1),
    max = minutes(120)
  } = {}) {
    const duration = randNumber({ min, max });
    const d = new Date('2000-01-01T00:00:00');
    d.setMilliseconds(duration);
    return formatDuration(d, true);
  },

  // Return the title cased version so we can easily uppercase it to get the
  // value.
  dealStatus: () => rand(['Pending', 'Confirmed']),

  dealEventType: () => rand(EVENT_TYPES),
  dealEventBillingType: () => rand(EVENT_BILLING_TYPES),

  showScheduleType() {
    return rand(SHOW_SCHEDULE_TYPES);
  },

  venue() {
    return rand(venues);
  },

  artist() {
    return rand(artists);
  },

  artistName() {
    return fake.artist().name;
  },

  artistPicture() {
    return fake.artist().image;
  },

  expenseName() {
    return rand(DEFAULT_EXPENSES);
  },

  ticketType() {
    return rand(TICKET_TYPES);
  },

  sortOrder() {
    return randText({
      charCount: randNumber({min: 1, max: 3})
    })
  },
}

