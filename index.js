/* eslint-env node */
'use strict';

function mergeConfig(obj1,obj2){
  var obj3 = {};
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
  for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
  return obj3;
}

module.exports = {
  name: 'ember-aupac-typeahead',
  included : function included(app) {
    this._super.included.apply(this, arguments);

    var defaults = {
      includeCss: true,
      includeTypeahead: true
    };

    var projectConfig = this.project.config(app.env);
    var userConfig = projectConfig['ember-aupac-typeahead'] || defaults;

    var config = mergeConfig(defaults, userConfig);

    if(config.includeCss) {
      app.import('vendor/aupac-typeahead.css');
    }

    if (config.includeTypeahead) {
      app.import(app.bowerDirectory + '/typeahead.js/dist/typeahead.jquery.min.js');
    }

  }
};
