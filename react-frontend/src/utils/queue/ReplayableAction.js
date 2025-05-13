/**
 * A structure for holding metadata about mutation
 * to a remote object. It indicates the type of object
 * being mutated on the remote API, whether or not it
 * is being deleted and the object's data (if it's being
 * added or updated).
 *
 * @property {'array'|'object'|'property'} type - The type of property being
 *  modified on by this action.
 * @property {string} property - The name of the object being manipulated in GraphQL.
 * @property {*} data - The item to update in GraphQL.
 * @property {boolean} remove - Whether or not the item is being removed.
 * @property {(a:any, b:any) => boolean} compare - A function to match this
 *   action to the data being modified. This callback is only necessary when
 *   updating an array relationship and allows the queue to determine which item
 *   in the list will be affected by the action.
 */
export class ReplayableAction {
  /**
   * @param {'array'|'object'|'property'} type
   * @param {string} property
   * @param {*} data
   * @param {boolean} remove
   */
  constructor(type, property, data, remove, compare) {
    this.type = type;
    this.property = property;
    this.data = data;
    this.remove = remove;
    this.compare = compare;
  }
}
