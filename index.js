/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-aupac-typeahead',
  included : function included(app) {
    this._super.included(app);
    this.app = app;

    //Typeahead
    app.import('vendor/typeahead.js/dist/bloodhound.js');
    app.import('vendor/typeahead.js/dist/typeahead.bundle.js');
  },
  afterInstall: function() {
    return this.addBowerPackageToProject('typeahead.js');
  }
};
