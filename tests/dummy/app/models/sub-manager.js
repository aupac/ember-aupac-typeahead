import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name : DS.attr('string'),
  manager : DS.belongsTo('manager'),
  employees : DS.hasMany('employee', {async : true}),
  displayName : Ember.computed('name', function() {
    return this.get('name');
  })
});
