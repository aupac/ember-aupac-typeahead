/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-aupac-typeahead',
  included : function included(app) {
    this._super.included(app);

    var projectConfig = this.project.config(app.env);
    var config = projectConfig['ember-aupac-typeahead'] ||
      {
//        includeCss: true,
        includeTypeahead: true
      };

    ////Typeahead.js
    //if (config.includeCss) {
    //  app.import(app.vendorDirectory + '/ember/ember-template-compiler.js');
    //}

    if (config.includeTypeahead) {
      app.import(app.bowerDirectory + '/typeahead.js/dist/typeahead.bundle.min.js');
      app.import(app.bowerDirectory + '/ember/ember-template-compiler.js');
    }

  },
  afterInstall: function() {
    return this.addBowerPackageToProject('typeahead.js');
  }
};
