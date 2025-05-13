module.exports = function() {
  this.plugin("done", function (stats) {
    if (stats.compilation.warnings.length || stats.compilation.errors.length) {
      // Log each of the warnings and errors
      stats.compilation.errors.forEach(function (error) {
        console.log(error.message || error);
      });
      stats.compilation.warnings.forEach(function (warning) {
        console.log(warning.message || warning);
      });

      // Pretend no assets were generated. This prevents the tests
      // from running making it clear that there were warnings.
      stats.stats = [{
        toJson: function () {
          return this;
        },
        assets: []
      }];
    }
  });
}
