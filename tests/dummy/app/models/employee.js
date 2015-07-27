import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    name : DS.attr('string'),
    subManager : DS.belongsTo('sub-manager'),
    tasks : DS.hasMany('task', {async : true}),
    displayName : Ember.computed('name', function() {
      return this.get('name');
    })
});
