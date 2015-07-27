import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name : DS.attr('string'),
  task : DS.belongsTo('task'),
  displayName : Ember.computed('name', function() {
    return this.get('name');
  })
});
