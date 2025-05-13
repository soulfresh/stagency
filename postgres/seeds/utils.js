module.exports = {
  listOf: function(count, cb) {
    return new Array(count).fill(undefined).map((...args) => cb(...args))
  },

  toJSON: function(o) {
    return o ? `"${JSON.stringify(o).replaceAll('"', '\\"')}"` : "{}"
  }
}
