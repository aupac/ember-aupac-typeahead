import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name : DS.attr('string'),
  employee : DS.belongsTo('employee'),
  subTasks : DS.hasMany('sub-task', {async : true}),
  displayName : Ember.computed('name', function() {
    return this.get('name');
  })
});
