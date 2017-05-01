/* eslint-env node */
'use strict';

module.exports = {
  normalizeEntityName: function() {},
  description: 'add corejs-typeahead to project',

  include: function(app) {
    this._super.included.apply(this, arguments);

    let defaults = {
      includeTypeahead: true
    };

    let userConfig = app.options['ember-aupac-typeahead'] || {};
    let config = Object.assign(defaults, userConfig);

    if (config.includeTypeahead && !process.env.EMBER_CLI_FASTBOOT) {
      return this.addBowerPackageToProject('corejs-typeahead', '~1.1.1');
    }
  }
};
