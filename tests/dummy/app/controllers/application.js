import Ember from 'ember';

const {computed} = Ember;

export default Ember.Controller.extend({

  selection : null,
  selection2 : null,
  selection2Initial : computed(function() {
    return this.store.findRecord('task', 3);
  })

});
