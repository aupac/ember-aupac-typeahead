import Ember from 'ember';
import footerTemplate from '../templates/components/aupac-typeahead/footer';
import headerTemplate from '../templates/components/aupac-typeahead/header';
import notFoundTemplate from '../templates/components/aupac-typeahead/not-found';
import pendingTemplate from '../templates/components/aupac-typeahead/pending';
import suggestionTemplate from '../templates/components/aupac-typeahead/suggestion';

const {observer, isNone, run, debug, getOwner, Component} = Ember;

const Key = {
  BACKSPACE : 8,
  DELETE : 46,
  ENTER : 13
};

export default Component.extend({
  init() {
    this._super(...arguments);
    let owner = getOwner(this);
    let lookup = owner.lookup('component:-typeahead-suggestion');
    if(isNone(lookup)){
      owner.register('component:-typeahead-suggestion', Component);
    }
  },

  //input tag attributes
  tagName : 'input',
  classNames: ['aupac-typeahead'],
  attributeBindings : ['disabled','placeholder', 'name', 'tabindex'],
  disabled : false, //@public
  placeholder : 'Search', //@public
  name : '', //@public

  //Actions
  action() {}, //@public
  selection : null, //@public
  source() {}, //@public

  //typeahead.js Customizations
  highlight: true, //@public
  hint: true, //@public
  minLength: 2, //@public
  typeaheadClassNames: {}, //@public
  autoFocus: false, //@public
  limit : 15, //@public
  async : false, //@public
  datasetName : '', //@public
  allowFreeInput: false, //@public

  //HtmlBars Templates
  suggestionTemplate,  //@public
  notFoundTemplate,  //@public
  pendingTemplate,  //@public
  headerTemplate,  //@public
  footerTemplate,  //@public

  //Private
  _typeahead: null,
  oldValue: null,


  /**
   * @public
   * @param selection - the item selected by the user
   * @returns {*}
   */
  display : function(selection) {
    return selection;
  },

  /**
   * @public
   * @param selection the item selected by the user
   */
  transformSelection(selection){
    return selection;
  },

  /**
   * @public
   * @param selection the item selected by the user
   */
  setValue : function(selection) {
    if (this.get('_typeahead')) { // Was failing in tests with this probably due to a stray observer
      selection = this.get('transformSelection')(selection);
      if(selection) {
        this.get('_typeahead').typeahead('val', selection);
      } else {
        this.get('_typeahead').typeahead('val', '');
      }
    }
  },

  didInsertElement: function () {
    this._super(...arguments);
    this.initializeTypeahead();
    if (this.get('autoFocus') === true) {
      this.get('_typeahead').focus();
    }
    this.addObserver('disabled', this.disabledStateChanged);
  },

  disabledStateChanged() {
    // Toggling the disabled attribute on the controller does not update the hint, need to do this manually.
    this.$().parent().find('input.tt-hint').prop('disabled', this.get('disabled'));
  },

  initializeTypeahead: function() {
    const self = this;
    //Setup the typeahead
    const t = this.$(this.element).typeahead({
      highlight: this.get('highlight'),
      hint: this.get('hint'),
      minLength: this.get('minLength'),
      classNames: this.get('typeaheadClassNames')
      }, {
        component : this,
        name: this.get('datasetName') || 'default',
        display: this.get('display'),
        async: this.get('async'),
        limit: this.get('limit'),
        source: this.get('source'),
        templates: {
          suggestion: function (model) {
            const el = document.createElement('div');
            if (typeof model !== 'object') {
              model = Ember.Object.create({
                displayName: model
              });
            }
            let owner = getOwner(self);
            let ComponentFactory = owner.factoryFor('component:-typeahead-suggestion');
            ComponentFactory.create({
              model,
              layout: self.get('suggestionTemplate'),
            }).appendTo(el);
            return el;
          },
          notFound: function (query) {
            const el = document.createElement('div');
            const model = Ember.Object.create({
              query
            });
            let owner = getOwner(self);
            let ComponentFactory = owner.factoryFor('component:-typeahead-suggestion');
            ComponentFactory.create({
              model,
              layout: self.get('notFoundTemplate'),
            }).appendTo(el);
            return el;
          },
          pending: function (query) {
            const el = document.createElement('div');
            const model = Ember.Object.create({
              query
            });
            let owner = getOwner(self);
            let ComponentFactory = owner.factoryFor('component:-typeahead-suggestion');
            ComponentFactory.create({
              model,
              layout: self.get('pendingTemplate')
            }).appendTo(el);
            return el;
          },
          header: function (query, suggestions) {
            const el = document.createElement('div');
            const model = Ember.Object.create({
              query,
              suggestions
            });
            let owner = getOwner(self);
            let ComponentFactory = owner.factoryFor('component:-typeahead-suggestion');
            ComponentFactory.create({
              model,
              layout: self.get('headerTemplate')
            }).appendTo(el);
            return el;
          },
          footer: function (query, suggestions) {
            const el = document.createElement('div');
            const model = Ember.Object.create({
              query,
              suggestions
            });
            let owner = getOwner(self);
            let ComponentFactory = owner.factoryFor('component:-typeahead-suggestion');
            ComponentFactory.create({
              model,
              layout: self.get('footerTemplate')
            }).appendTo(el);
            return el;
          }
        }
    });
    this.set('_typeahead', t);

    // Set selected object
    t.on('typeahead:autocompleted', run.bind(this, (jqEvent, suggestionObject /*, nameOfDatasetSuggestionBelongsTo*/) => {
        this.updateSelectionWhenChanged(suggestionObject, 'typeahead:autocompleted');
    }));

    t.on('typeahead:selected', run.bind(this, (jqEvent, suggestionObject /*, nameOfDatasetSuggestionBelongsTo*/) => {
      this.updateSelectionWhenChanged(suggestionObject, 'typeahead:selected');
    }));

    t.on('keyup', run.bind(this, (jqEvent) => {
      //Handle the case whereby the user presses the delete or backspace key, in either case
      //the selection is no longer valid.
      if (jqEvent.which === Key.BACKSPACE || jqEvent.which === Key.DELETE) {
        if (!this.get('allowFreeInput')) {
          debug("Removing model");
          const value = this.get('_typeahead').typeahead('val'); //cache value
          this.updateSelectionWhenChanged(null, 'keyup');
          this.setValue(value); // restore the text, thus allowing the user to make corrections
        }
      }
    }));

    t.on('keydown', run.bind(this, (jqEvent) => {
      if (jqEvent.which === Key.ENTER) {
        this._commitSelection('keydown');
      }
    }));

    t.on('focusout', run.bind(this, (/*jqEvent*/) => {
      //the user has now left the control, update display with current binding or reset to blank
      this._commitSelection('focusout');
    }));

  },

  _commitSelection: function(evt_name) {
    const model = this.get('selection');
    if (this.get('allowFreeInput')) {
      const value = this.get('_typeahead').typeahead('val');
      this.updateSelectionWhenChanged(value, evt_name);
    } else if (model) {
      this.setValue(model);
    } else {
      this.setValue(null);
    }
  },

  selectionUpdated: observer('selection', '_typeahead',function() {
    const selection = this.get('selection');
    if(isNone(selection)) {
      this.setValue(null);
    } else {
      this.setValue(selection);
    }
  }),

  updateSelectionWhenChanged: function(value, evt_name){
    const oldValue = this.get('oldValue');
    if (oldValue !== value) {
      this.set('oldValue', value);
      this.set('selection', value);
      this.sendAction('action', value, evt_name);
    }
  },

  willDestroyElement : function() {
    this._super(...arguments);
    let t = this.get('_typeahead');

    //Remove custom event handlers before destroying
    t.off('typeahead:autocompleted');
    t.off('typeahead:selected');
    t.off('keyup');
    t.off('keydown');
    t.off('focusout');

    t.typeahead('destroy');

    //Dereference the element
    this.set('_typeahead', null);
  }

});
