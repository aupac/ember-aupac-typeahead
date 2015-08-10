import Ember from 'ember';
import AupacTypeahead from './aupac-typeahead';

const {isNone, inject, computed, observer, Handlebars} = Ember;

export default AupacTypeahead.extend({

  modelClass : null,
  suggestionKey : 'displayName',
  displayKey : 'displayName',
  params : {},
  async : true,
  queryKey : 'q',
  pendingTemplate : `<div class='tt-suggestion'>Loading...</div>`,

  display : computed(function() {
    return (model) => {
      return model.get(this.get('displayKey'));
    };
  }),

  compiledSuggestionTemplate : computed(function() {
    const suggestionKey = this.get('suggestionKey');
    return Handlebars.compile(this.get('suggestionTemplate') || `<div class='typeahead-suggestion'>{{model.${suggestionKey}}}</div>`);
  }),

  setValue : function(selection) {
    const displayKey = this.get('displayKey');
    const modelClass = this.get('modelClass');
    if(selection && selection.get('id')) {
      this.get('store').findRecord(modelClass, selection.get('id')).then((model) => {
        this.get('_typeahead').typeahead('val', model.get(displayKey));
      });
    } else {
      this.get('_typeahead').typeahead('val', '');
    }
  },

  selectionUpdated : observer('_selection.id', '_typeahead', function() {
    const selection = this.get('_selection');
    if(isNone(selection)) {
      this.setValue(null);
    } else {
      this.setValue(selection);
    }
  }),

  //private
  store : inject.service('store'),

  init : function() {
    this._super(...arguments);

    if(isNone(this.get('modelClass'))) {
      throw new Error('modelClass must be supplied to aupac-typeahead');
    }
  },

  source : computed(function() {
    const _this = this;
    return function (query, syncResults, asyncResults) {
      const q = {};
      q[_this.get('queryKey')] = query;
      const queryObj = $.extend(true, {}, q , _this.get('params'));

      _this.get('store').query(_this.get('modelClass'), queryObj).then(function(models) {
        let emberDataModels = [];
        models.get('content').forEach(function(model, i) {
          emberDataModels[i] = model.getRecord();
        });
        asyncResults(emberDataModels);
      });
    };
  })

});
