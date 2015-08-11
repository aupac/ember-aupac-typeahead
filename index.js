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
        includeTypeahead: true,
        includeTemplateCompiler: true
      };

    if (config.includeTemplateCompiler) {
      app.import(app.bowerDirectory + '/ember/ember-template-compiler.js');
    }

    if (config.includeTypeahead) {
      app.import(app.bowerDirectory + '/typeahead.js/dist/typeahead.jquery.min.js');
    }

  },
  afterInstall: function() {
    return this.addBowerPackageToProject('typeahead.js', '~0.11.1');
  }
};
