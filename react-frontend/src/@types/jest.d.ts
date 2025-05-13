declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualType(v: any): R
      toHaveShape(v: any): R
      toBeADate(v: any): R
      toBeADealStatus(v: any): R
      toBeAnImage(v: any): R
      toBeAnArtist(v: any): R
      toBeAVenue(v: any): R
      toBeATicketScaling(v: any): R
      toBeATicketType(v: any): R
      toBeAShowSchedule(v: any): R
      toBeAPerformanceSchedule(v: any): R
      toBeADealSummary(v: any): R
      toBeADeal(v: any): R
    }
  }
}

// export interface ICustomMatchers<R = unknown> {
//   nullOrAny(): R
//   optionalType(): R
//   arrayOf(): R
//   arrayOfType(): R
//   optionalArrayOfType(): R
//   toBeAUser(): R
//   toBeAPropertyRollup(): R
//   toBeAProperty(): R
//   toBeAMetric(): R
//   toBeASnapshotProperty(): R
//   toBeASnapshotLeaderboard(): R
//   toBeAUserMessage(): R
// }
//
// declare global {
//   namespace jest {
//     type Expect = ICustomMatchers
//     type Matchers<R> = ICustomMatchers<R>
//     type InverseAsymmetricMatchers = ICustomMatchers
//   }
// }

