/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-aupac-typeahead',
  included : function included(app) {
    this._super.included(app);
    this.app = app;

    //Typeahead.js
    app.import('bower_components/typeahead.js/dist/typeahead.bundle.min.js');
    app.import('bower_components/ember/ember-template-compiler.js');
  },
  afterInstall: function() {
    return this.addBowerPackageToProject('typeahead.js');
  }
};
