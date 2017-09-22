/* eslint-env node */
'use strict';
const fs = require('fs');

const Funnel = require('broccoli-funnel');
const path = require('path');
const map = require('broccoli-stew').map;
const mergeTrees = require('broccoli-merge-trees');

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

    if(config.includeTypeahead) {
      app.import('vendor/typeahead.jquery.min.js');
    }
  },
  treeForVendor: function(defaultTree) {
    const app = this._findHost();
    const assetPath = path.join(app.bowerDirectory, 'corejs-typeahead/dist/');

    if (fs.existsSync(assetPath)) {
      let jquerymin = new Funnel(assetPath, {
        files: ['typeahead.jquery.min.js']});
      jquerymin = map(jquerymin,
        (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);
      return new mergeTrees([defaultTree, jquerymin]);
    } else {
      return defaultTree;
    }
  }
};
