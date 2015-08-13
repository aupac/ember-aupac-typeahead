function mergeConfig(obj1,obj2){
  var obj3 = {};
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
  for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
  return obj3;
}

module.exports = {
  normalizeEntityName: function() {},
  description: 'add typeahead.js to project',

  afterInstall: function(app) {

    var defaults = {
      includeTypeahead: true
    };

    var projectConfig = this.project.config(app.env);
    var userConfig = projectConfig['ember-aupac-typeahead'] || deafults;

    var config = mergeConfig(defaults, userConfig);

    if (config.includeTypeahead) {
      return this.addBowerPackageToProject('typeahead.js', '~0.11.1');
    }
  }
};
