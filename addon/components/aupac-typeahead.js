import Ember from 'ember';
import DS from 'ember-data';

const {computed, observer, isNone, Handlebars} = Ember;

const Key = {
  BACKSPACE : 8,
  DELETE : 46
}

export default Ember.Component.extend({
  //input tag attributes
  tagName : 'input',
  classNames: ['aupac-typeahead'],
  attributeBindings : ['disabled','placeholder','name', 'value'],
  disabled : false,
  placeholder : 'Search',
  name : '',
  value : '',

  //Actions
  action: Ember.K, // action to fire on change

  //typeahead.js Customizations
  highlight: true,
  hint: true,
  minLength: 2,
  classNames: {},
  autoFocus: false,
  queryKey : 'q',
  limit : 100,

  //HtmlBars Templates
  suggestionTemplate : null,
  notFoundTemplate : "<p class='text-center'>No results found.<p>",
  pendingTemplate :  "<p class='text-center'>Please wait...<p>",
  headerTemplate : null,
  footerTemplate : null,

  //Required for ember-data
  store : null, //Required
  modelClass : null, //Required
  suggestionKey : 'displayName',
  displayKey : 'displayName',
  params : {},
  selection : null,

  //Private
  _typeahead: null,

  // shadow the passed-in `selection` to avoid
  // leaking changes to it via a 2-way binding
  _selection: Ember.computed.reads('selection'),

  init : function() {
    this._super(...arguments);

    if(!(this.get('store') instanceof DS.Store)) {
      throw new Error('a DS.Store instance must to supplied to aupac-typeahead');
    }

    if(isNone(this.get('modelClass'))) {
      throw new Error('modelClass must be supplied to aupac-typeahead');
    }

    this.set('_selection', selection);
  },

  didInsertElement: function () {
    this._super.apply(this, arguments);
    this.initializeTypeahead();
    if (this.get('autoFocus') === true) {
      this.get('_typeahead').focus();
    }
  },

  initializeTypeahead: function () {

    //Setup the typeahead
    const t = this.$().typeahead({
      highlight: this.get('highlight'),
      hint: this.get('hint'),
      minLength: this.get('minLength'),
      classNames: this.get('classNames')
    }, this.get('dataset'));
    this.set('_typeahead', t);

    // Set selected object
    t.on('typeahead:autocompleted', Ember.run.bind(this, (jqEvent, suggestionObject, nameOfDatasetSuggestionBelongsTo) => {
      this.set('_selection', suggestionObject);
      this.sendAction('action', suggestionObject);
    }));

    t.on('typeahead:selected', Ember.run.bind(this, (jqEvent, suggestionObject, nameOfDatasetSuggestionBelongsTo) => {
      this.set('_selection', suggestionObject);
      this.sendAction('action', suggestionObject);
    }));

    t.on('keyup', Ember.run.bind(this, (jqEvent) => {
      //Handle the case whereby the user presses the delete or backspace key, in either case
      //the selection is no longer valid.
      if (jqEvent.which === Key.BACKSPACE || jqEvent.which === Key.DELETE) {
        Ember.debug("Removing model");
        this.set('_selection', null);
        this.sendAction('action', null);
      }
    }));

    t.on('focusout', Ember.run.bind(this, (jqEvent) => {
      //the user has now left the control, update display with current binding or reset to blank
      var model = this.get('_selection');
      if(model) {
        var displayKey = this.get('displayKey');
        this.$().typeahead('val', model.get(displayKey));
      } else {
        this.$().typeahead('val', '');
      }
    }));

    //set initial value
    this.setupInitialValue();
  },

  setupInitialValue : function() {
    const selection = this.get('_selection');
    const displayKey = this.get('displayKey');
    const store = this.get('store');
    const modelClass = this.get('modelClass');
    if(selection && selection.get('id')) {
      store.findRecord(modelClass, selection.get('id')).then((model) => {
        this.$().typeahead('val', model.get(displayKey));
      });
    } else {
      this.get('_typeahead').typeahead('val', '');
    }
  },

  selectionUpdated : observer('_selection',function() {
    if(Ember.isNone(this.get('_selection'))) {
      this.get('_typeahead').typeahead('val', '');
    }
  }),

  dataset: computed(function () {
    const content = this.get('content');
    if (jQuery.isFunction(content)) {
      content.then((data) => {
        return this.loadDataset(data);
      });
    } else {
      return this.loadDataset(content);
    }
  }),

  loadDataset: function (content) {
    const self = this;
    const modelClass = this.get('modelClass');
    const name = this.get('name') || 'default';
    const key = this.get('displayKey');
    const params = this.get('params');
    const suggestionKey = this.get('suggestionKey');
    const compiledSuggestionTemplate = Handlebars.compile(this.get('suggestionTemplate') || `{{${suggestionKey}}}`);

    return {
      name: name,
      display: function(model) {
        return model.get(key);
      },
      async : true,
      limit : self.get('limit'),
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
