import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import DS from 'ember-data';

import { assertThat, Mocks, Matchers } from 'ember-aupac-mocks';

const { mock, mockFunction, verify, when} = Mocks;
const { empty, emailAddress, greaterThan, everyItem, hasSize, even, lessThan, either} = Matchers;

moduleForComponent('aupac-ember-data-typeahead', 'Unit | Component | aupac ember data typeahead', {
  // Specify the other units that are required for this test
  //needs: ['model:task'],
  unit: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  const component = this.subject({
    modelClass: 'task'
  });
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

/*
function getAsyncMock1() {

  //model
  const model = mock(DS.Model);
  when(model).get('id').thenReturn(1);
  when(model).get('id').thenReturn(1);
  when(model).get('displayName').thenReturn('hello world');

  //Fake out an {async : true} model using a promise
  const mockResolver = mockFunction();
  const promise = mock({
    then(){},
    get(){}
  });
  when(promise).then().thenReturn(model);
  when(promise).get('id').thenReturn(1);

  //var promise = new Ember.RSVP.Promise(function(resolve, reject){
  //  // succeed
  //  resolve(model);
  //});

  //ember-data store
  const store = mock(DS.Store);
  when(store).query('task',{}).thenReturn(Ember.A([]));
  when(store).findRecord('task', 1).thenReturn(promise);

  return {
    store,
    model : promise
  };
}
test('you can pass an ember-data model as the selection', function(assert) {
  assert.expect(1);

  const mock = getAsyncMock1();

  const component = this.subject({
    modelClass: 'task',
    selection: mock.model,
    store: mock.store
  });
  this.render();
  assert.equal(component.$().val(), 'hello world', 'should set the input value to the displayKey');
});
*/


test('you can pass a string as the selection', function(assert) {
  assert.expect(1);
  const model = 'hello world';
  const mockStore = mock(DS.Store);
  when(mockStore).query().thenReturn({
    then() {
        //Do nothing
    }
  });

  const component = this.subject({
    modelClass: 'task',
    selection: model,
    store: mockStore
  });
  this.render();
  assert.equal(component.$().val(), 'hello world', 'should set the input value to the string');
});

