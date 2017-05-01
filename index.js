/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-aupac-typeahead',
  included: function(app) {
    this._super.included.apply(this, arguments);

    let defaults = {
      includeCss: true,
      includeTypeahead: true
    };

    let userConfig = app.options['ember-aupac-typeahead'] || {};
    let config = Object.assign(defaults, userConfig);

    if(config.includeCss) {
      app.import('vendor/aupac-typeahead.css');
    }

    if(config.includeTypeahead && !process.env.EMBER_CLI_FASTBOOT) {
      app.import(app.bowerDirectory + '/corejs-typeahead/dist/typeahead.jquery.min.js');
    }
  }
};
