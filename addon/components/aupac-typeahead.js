import Ember from 'ember';

const {computed, observer, isNone, Handlebars, run, debug, Component} = Ember;

const Key = {
  BACKSPACE : 8,
  DELETE : 46
};

export default Component.extend({
  //input tag attributes
  tagName : 'input',
  classNames: ['aupac-typeahead'],
  attributeBindings : ['disabled','placeholder'],
  disabled : false,
  placeholder : 'Search',

  //Actions
  action: Ember.K, // action to fire on change
  selection : null,
  source : Ember.K,

  //typeahead.js Customizations
  highlight: true,
  hint: true,
  minLength: 2,
  typeaheadClassNames: {},
  autoFocus: false,
  limit : 15,
  async : false,
  name : '',
  display : function(model) {
    return model;
  },
  setValue : function(selection) {
    if(selection) {
      this.get('_typeahead').typeahead('val', selection);
    } else {
      this.get('_typeahead').typeahead('val', '');
    }
  },

  //HtmlBars Templates
  suggestionTemplate : null,
  notFoundTemplate : null,
  pendingTemplate :  null,
  headerTemplate : null,
  footerTemplate : null,

  //Private
  _typeahead: null,

  // shadow the passed-in `selection` to avoid
  // leaking changes to it via a 2-way binding
  _selection: computed.reads('selection'),

  didInsertElement: function () {
    this._super(...arguments);
    this.initializeTypeahead();
    if (this.get('autoFocus') === true) {
      this.get('_typeahead').focus();
    }
  },

  initializeTypeahead: function() {
    const self = this;
    //Setup the typeahead
    const t = this.$().typeahead({
      highlight: this.get('highlight'),
      hint: this.get('hint'),
      minLength: this.get('minLength'),
      classNames: this.get('typeaheadClassNames')
      }, {
        component : this,
        name: this.get('name') || 'default',
        display: this.get('display'),
        async: this.get('async'),
        limit: this.get('limit'),
        source: this.get('source'),
        templates: {
          suggestion: function (model) {
            const item = Component.create({
              model: model,
              layout: self.get('compiledSuggestionTemplate')
            }).createElement();
            return item.element;
          },
          notFound: function (query) {
            const item = Component.create({
              query: query,
              layout: self.get('compiledNotFoundTemplate')
            }).createElement();
            return item.element;
          },
          pending: function (query) {
            const item = Component.create({
              query: query,
              layout: self.get('compiledPendingTemplate')
            }).createElement();
            return item.element;
          },
          header: function (query, suggestions) {
            const item = Component.create({
              query: query,
              suggestions: suggestions,
              layout: self.get('compiledHeaderTemplate')
            }).createElement();
            return item.element;
          },
          footer: function (query, suggestions) {
            const item = Component.create({
              query: query,
              suggestions: suggestions,
              layout: self.get('compiledFooterTemplate')
            }).createElement();
            return item.element;
          }
        }
    });
    this.set('_typeahead', t);

    // Set selected object
    t.on('typeahead:autocompleted', run.bind(this, (jqEvent, suggestionObject /*, nameOfDatasetSuggestionBelongsTo*/) => {
      this.set('_selection', suggestionObject);
      this.sendAction('action', suggestionObject);
    }));

    t.on('typeahead:selected', run.bind(this, (jqEvent, suggestionObject /*, nameOfDatasetSuggestionBelongsTo*/) => {
      this.set('_selection', suggestionObject);
      this.sendAction('action', suggestionObject);
    }));

    t.on('keyup', run.bind(this, (jqEvent) => {
      //Handle the case whereby the user presses the delete or backspace key, in either case
      //the selection is no longer valid.
      if (jqEvent.which === Key.BACKSPACE || jqEvent.which === Key.DELETE) {
        debug("Removing model");
        const value = this.get('_typeahead').typeahead('val'); //cache value
        this.set('_selection', null);
        this.sendAction('action', null);
        this.$().typeahead('val', value); //restore the text, thus allowing the user to make corrections
      }
    }));

    t.on('focusout', run.bind(this, (/*jqEvent*/) => {
      //the user has now left the control, update display with current binding or reset to blank
      const model = this.get('_selection');
      if (model) {
        this.setValue(model);
      } else {
        this.setValue(null);
      }
    }));

  },

  selectionUpdated : observer('_selection', '_typeahead',function() {
    const selection = this.get('_selection');
    if(isNone(selection)) {
      this.setValue(null);
    } else {
      this.setValue(selection);
    }
  }),

  compiledSuggestionTemplate : computed(function() {
    return Handlebars.compile(this.get('suggestionTemplate') || `<div class='typeahead-suggestion'>{{model}}</div>`);
  }),

  compiledNotFoundTemplate : computed(function() {
    return Handlebars.compile(this.get('notFoundTemplate') || `<div class='typeahead-not-found'>No results found.</div>`);
  }),

  compiledPendingTemplate : computed(function() {
    return Handlebars.compile(this.get('pendingTemplate') || `<div class='typeahead-pending'>Loading...</div>`);
  }),

  compiledHeaderTemplate : computed(function() {
    return Handlebars.compile(this.get('headerTemplate') || `<div class='typeahead-header'></div>`);
  }),

  compiledFooterTemplate : computed(function() {
    return Handlebars.compile(this.get('footerTemplate') || `<div class='typeahead-footer'></div>`);
  }),

  willDestroyElement : function() {
    this._super(...arguments);
    this.get('_typeahead').typeahead('destroy');
  }

});
