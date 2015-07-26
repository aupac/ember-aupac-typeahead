import Ember from 'ember';
import layout from '../templates/components/aupac-typeahead';

//KEYBOARD
var Key = {
  BACKSPACE : 8,
  DELETE : 46
}

//Get remote data
var getDynamicData = function (component, key) {
  return function findMatches(q, cb) {
    var params = component.get('params');
    var modelClass = component.get('modelClass');
    var store = component.get('store');

    var queryObj = $.extend(true, {}, {q : q} , params);

    store.query(modelClass, queryObj).then(function(models) {

      //Ember-data 1.13.0 FIX --------------
      var emberDataModels = [];
      models.get('content').forEach(function(mod) {
        emberDataModels.pushObject(mod.getRecord());
      });
      cb(emberDataModels);
      //------------------

      //cb(models.get('content'));

    });
  }
}

export default Ember.Component.extend({
  layout: layout,

  //Public
  highlight: true,
  hint: true,
  minLength: 2,
  autofocus: false,
  selection: null,
  icon : 'search',
  suggestionKey : 'displayName',
  suggestionTemplate : null,
  displayKey : 'displayName',
  placeholder : 'Search',
  onSelected : undefined,
  disabled : false,
  params : null,

  //Private
  _typeahead: null,

  isIconEmpty : Ember.computed.empty('icon'),
  isIconSupplied : Ember.computed.not('isIconEmpty'),

  selectionUpdated : function() {
    if(Ember.isNone(this.get('selection'))) {
      this.$('input[type="text"]').typeahead('val', '');
    }
  }.observes('selection'),

  didInsertElement: function () {
    this._super();
    this.initializeTypeahead();
    if (this.get('autofocus') === true) {
      this.$('input[type="text"]').focus();
    }
  },

  selectionCleared : function() {
    if(Ember.isEmpty(this.get('selection'))) {
      this.$('input[type="text"]').typeahead('val', '');
    }
  }.observes('selection'),

  initializeTypeahead: function () {
    var self = this, t = null,
      options = {
        highlight: this.get('highlight'),
        hint: this.get('hint'),
        minLength: this.get('minLength')
      },
      dataset = this.get('dataset');
    t = this.$('input[type="text"]').typeahead(options, dataset);
    this.set('_typeahead', t);

    // Set selected object
    t.on('typeahead:autocompleted', Ember.run.bind(this, function(jqEvent, suggestionObject, nameOfDatasetSuggestionBelongsTo){
      Ember.debug("Setting suggestion");
      self.set('selection', suggestionObject);
      self.sendAction('onSelected', suggestionObject);
    }));

    t.on('typeahead:selected', Ember.run.bind(this, function(jqEvent, suggestionObject, nameOfDatasetSuggestionBelongsTo){
      Ember.debug("Setting suggestion");
      self.set('selection', suggestionObject);
      self.sendAction('onSelected', suggestionObject);
    }));

    t.on('keyup', Ember.run.bind(this, function(jqEvent){
      //Handle the case whereby the user presses the delete or backspace key, in either case
      //the selection is no longer valid.
      if (jqEvent.which === Key.BACKSPACE || jqEvent.which === Key.DELETE) {
        Ember.debug("Removing model");
        self.set('selection', null);
      }
    }));

    t.on('focusout', Ember.run.bind(this, function(jqEvent){
      //the user has now left the control, update display with current binding or reset to blank
      var model = self.get('selection');
      if(model) {
        var displayKey = self.get('displayKey');
        self.$('input[type="text"]').typeahead('val', model.get(displayKey));
      } else {
        self.$('input[type="text"]').typeahead('val', '');
      }
    }));

    if(Ember.isNone(this.get('params'))) {
      this.set('params', {});
    }

    //set initial value
    this.setupInitialValue();
  },

  setupInitialValue : function() {
    var self = this;

    var selection = this.get('selection');
    var displayKey = this.get('displayKey');
    var store = this.get('store');
    var modelClass = this.get('modelClass');
    if(selection && selection.get('id')) {
      store.find(modelClass, selection.get('id')).then(function(model) {
        self.$('input[type="text"]').typeahead('val', model.get(displayKey));
      });
    } else {
      this.$('input[type="text"]').typeahead('val', '');
    }
  }, //.observes('selection.content'),

  dataset: function () {
    var self = this, content = this.get('content');
    if (jQuery.isFunction(content)) {
      content.then(function (data) {
        return self.loadDataset(data);
      });
    } else {
      return this.loadDataset(content);
    }
  }.property(),

  loadDataset: function (content) {
    var self = this;

    var store = this.get('store');
    var modelClass = this.get('modelClass');
    var name = this.get('name') || 'default';
    var key = this.get('displayKey');
    var params = this.get('params');

    var suggestionKey = this.get('suggestionKey');
    var compiledSuggestionTemplate =
      Ember.isNone(this.get('suggestionTemplate')) ?
        Ember.Handlebars.compile('{{'+ suggestionKey + '}}') :
        Ember.Handlebars.compile(this.get('suggestionTemplate'));

    return {
      name: name,
      displayKey: function(model) {
        return model.get(key);
        //return model.getRecord().get(key); //Ember-data 1.13.0 FIX
      },
      source: getDynamicData(self, key),
      templates: {
        suggestion: function(model){
          var view = Ember.View.create({
            tagName : 'p',
            controller : model,
            template: compiledSuggestionTemplate
          }).createElement();

          return view.element;
        },
        //suggestion: suggestionTemplate,
        empty : "<p class='text-center'>No results found.<p>"
      }
    };
  },

  willDestroyElement : function() {
    this._super();
    this.$('input[type="text"]').typeahead('destroy');
  }

});
