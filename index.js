/* eslint-env node */
'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-aupac-typeahead',

  included(app) {
    this._super.included.apply(this, arguments);

    // FIXME
    //this.import('vendor/shims/typeahead.js');

    let defaults = {
      includeCss: true,
      includeTypeahead: true
    };

    let userConfig = app.options['ember-aupac-typeahead'] || {};
    let config = Object.assign(defaults, userConfig);

    if(config.includeCss) {
      app.import('vendor/aupac-typeahead.css');
    }

    if(config.includeTypeahead) {
      this.import('vendor/typeahead.jquery.js');
    }
  },

  treeForVendor(vendorTree) {
    var momentTree = new Funnel(path.dirname(require.resolve('corejs-typeahead/dist/typeahead.jquery.js')), {
      files: ['typeahead.jquery.js'],
    });

    return new MergeTrees([vendorTree, momentTree]);
  }

};
