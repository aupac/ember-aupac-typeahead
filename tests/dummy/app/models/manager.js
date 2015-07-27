import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name : DS.attr('string'),
  subManagers : DS.hasMany('sub-manager', {async : true}),
  displayName : Ember.computed('name', function() {
    return this.get('name');
  })
});
