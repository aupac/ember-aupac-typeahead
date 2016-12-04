import Ember from 'ember';
import AupacTypeahead from './aupac-typeahead';

const {isNone, inject, computed, observer} = Ember;

export default AupacTypeahead.extend({

  modelClass : null, //@public
  displayKey : 'displayName', //@public
  params : {}, //@public
  async : true, //@public
  queryKey : 'q', //@public

  //private
  store : inject.service('store'),

  /**
   * @Override
   */
  display : computed(function() {
    return (model) => {
      return model.get(this.get('displayKey'));
    };
  }),

  /**
   * @Override
   */
  setValue : function(selection) {
    if (this.get('_typeahead')) { // Was failing in tests with this probably due to a stray observer
      selection = this.transformSelection(selection);
      if (typeof selection === 'string') {
        this.get('_typeahead').typeahead('val', selection);
      } else {
        const displayKey = this.get('displayKey');
        const modelClass = this.get('modelClass');
        if(selection && selection.get('id')) {
          const item = this.get('store').peekRecord(modelClass, selection.get('id'));
          if (isNone(item)) {
            this.get('store').findRecord(modelClass, selection.get('id')).then((model) => {
              this.get('_typeahead').typeahead('val', model.get(displayKey));
            });
          } else {
            this.get('_typeahead').typeahead('val', item.get(displayKey));
          }
        } else {
          this.get('_typeahead').typeahead('val', '');
        }
      }
    }
  },

  /**
   * @Override
   */
  init : function() {
    this._super(...arguments);

    if(isNone(this.get('modelClass'))) {
      throw new Error('modelClass must be supplied to aupac-typeahead');
    }
  },

  /**
   * @Override
   */
  source : computed(function() {
    const _this = this;
    return function (query, syncResults, asyncResults) {
      const q = {};
      q[_this.get('queryKey')] = query;
      const queryObj = Ember.$.extend(true, {}, q , _this.get('params'));

      _this.get('store').query(_this.get('modelClass'), queryObj).then(function(models) {
        let emberDataModels = [];
        models.get('content').forEach(function(model, i) {
          emberDataModels[i] = model.getRecord();
        });
        asyncResults(emberDataModels);
      });
    };
  }),

  /**
   * @Override
   */
  selectionUpdated : observer('selection.id', '_typeahead', function() {
    const selection = this.get('selection');
    if(isNone(selection)) {
      this.setValue(null);
    } else {
      this.setValue(selection);
    }
  })

});
