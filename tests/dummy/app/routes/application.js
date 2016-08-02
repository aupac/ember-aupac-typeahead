import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model) {
    // Call _super for default behavior
    this._super(controller, model);
    // Implement your custom setup after
    this.store.findRecord('task', 3).then((task) => {
      this.controllerFor('application').set('task', task);
    });
  }
});