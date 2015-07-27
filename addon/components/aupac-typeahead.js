import Ember from 'ember';
import DS from 'ember-data';

const {computed, observer, isNone, Handlebars} = Ember;

const Key = {
  BACKSPACE : 8,
  DELETE : 46
}

export default Ember.Component.extend({
  tagName : 'input',
  classNames: ['aupac-typeahead'],
  attributeBindings : ['disabled','placeholder','name', 'value'],
  disabled : false,
  placeholder : 'Search',
  name : '',
  value : '',
  store : null, //Required
  modelClass : null, //Required

  //customizations
  highlight: true,
  hint: true,
  minLength: 2,
  classNames: {},
  autoFocus: false,
  suggestionKey : 'displayName',
  displayKey : 'displayName',
  params : {},
  queryKey : 'q',

  //Templates
  suggestionTemplate : null,
  notFoundTemplate : "<p class='text-center'>No results found.<p>",
  pendingTemplate :  "<p class='text-center'>Please wait...<p>",
  headerTemplate : null,
  footerTemplate : null,

  //Private
  _typeahead: null,
  _selection: null,

  init : function() {
    this._super.apply(this, arguments);
    if(!(this.get('store') instanceof DS.Store)) {
      throw new Error('a DS.Store instance must to supplied to aupac-typeahead');
    }

    if(isNone(this.get('modelClass'))) {
      throw new Error('modelClass must be supplied to aupac-typeahead');
    }
  },

  didInsertElement: function () {
    this._super.apply(this, arguments);
    this.initializeTypeahead();
    if (this.get('autoFocus') === true) {
      this.get('_typeahead').focus();
    }
  },

  selectionUpdated : observer('_selection',function() {
    if(Ember.isNone(this.get('_selection'))) {
      this.get('_typeahead').typeahead('val', '');
    }
  }),

  dataset: computed(function () {
    var self = this, content = this.get('content');
    if (jQuery.isFunction(content)) {
      content.then(function (data) {
        return self.loadDataset(data);
      });
    } else {
      return this.loadDataset(content);
    }
  }),

  initializeTypeahead: function () {
    const self = this;

    //Setup the typeahead
    const t = this.$().typeahead({
      highlight: this.get('highlight'),
      hint: this.get('hint'),
      minLength: this.get('minLength'),
      classNames: this.get('classNames')
    }, this.get('dataset'));
    this.set('_typeahead', t);

    // Set selected object
    t.on('typeahead:autocompleted', Ember.run.bind(this, function(jqEvent, suggestionObject, nameOfDatasetSuggestionBelongsTo){
      Ember.debug("Setting suggestion");
      self.set('_selection', suggestionObject);
      self.sendAction('action', suggestionObject);
    }));

    t.on('typeahead:selected', Ember.run.bind(this, function(jqEvent, suggestionObject, nameOfDatasetSuggestionBelongsTo){
      Ember.debug("Setting suggestion");
      self.set('_selection', suggestionObject);
      self.sendAction('action', suggestionObject);
    }));

    t.on('keyup', Ember.run.bind(this, function(jqEvent){
      //Handle the case whereby the user presses the delete or backspace key, in either case
      //the selection is no longer valid.
      if (jqEvent.which === Key.BACKSPACE || jqEvent.which === Key.DELETE) {
        Ember.debug("Removing model");
        self.set('_selection', null);
        self.sendAction('action', null);
      }
    }));

    t.on('focusout', Ember.run.bind(this, function(jqEvent){
      //the user has now left the control, update display with current binding or reset to blank
      var model = self.get('_selection');
      if(model) {
        var displayKey = self.get('displayKey');
        self.$().typeahead('val', model.get(displayKey));
      } else {
        self.$().typeahead('val', '');
      }
    }));

    //set initial value
    this.setupInitialValue();
  },

  setupInitialValue : function() {
    var self = this;

    var selection = this.get('_selection');
    var displayKey = this.get('displayKey');
    var store = this.get('store');
    var modelClass = this.get('modelClass');
    if(selection && selection.get('id')) {
      store.findRecord(modelClass, selection.get('id')).then(function(model) {
        self.$().typeahead('val', model.get(displayKey));
      });
    } else {
      this.get('_typeahead').typeahead('val', '');
    }
  },



  loadDataset: function (content) {
    var self = this;
    var modelClass = this.get('modelClass');
    var name = this.get('name') || 'default';
    var key = this.get('displayKey');
    var params = this.get('params');

    var suggestionKey = this.get('suggestionKey');
    var compiledSuggestionTemplate = Handlebars.compile(this.get('suggestionTemplate') || `{{${suggestionKey}}}`);

    return {
      name: name,
      display: function(model) {
        return model.get(key);
        //return model.getRecord().get(key); //Ember-data 1.13.0 FIX
      },
      async : true,
      limit : 100,
      source : function (q, syncResults, asyncResults) { //query, syncResults, asyncResults
          var query = {}
          query[self.get('queryKey')] = q;
          var queryObj = $.extend(true, {}, query , self.get('params'));

          self.get('store').query(self.get('modelClass'), queryObj).then(function(models) {
            let emberDataModels = [];
            models.get('content').forEach(function(model, i) {
              emberDataModels[i] = model.getRecord();
            });
            asyncResults(emberDataModels);
          });
      },
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
        notFound : self.get('notFoundTemplate'),
        pending : self.get('pendingTemplate'),
        header :  self.get('headerTemplate'),
        footer :  self.get('footerTemplate')
      }
    };
  },

  willDestroyElement : function() {
    this._super();
    this.get('_typeahead').typeahead('destroy');
  }

});
