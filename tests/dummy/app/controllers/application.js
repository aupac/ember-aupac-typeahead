import Ember from 'ember';

export default Ember.Controller.extend({
  disabled : false,
  placeholder : 'Search',

  highlight: true,
  hint: true,
  minLength: 2,
  classNames: {},
  autoFocus: false,
  suggestionKey : 'displayName',
  suggestionTemplate : null, //TODO add the rest of the templates header, footer etc.
  displayKey : 'displayName',
  params : {},
  queryKey : 'q',

});
