/* global server, aupacTypeaheadFind, aupacTypeaheadSearch, aupacTypeaheadChoose, aupacTypeaheadSuggestions */
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

import registerAupacTypeaheadSearchHelpers from '../../tests/helpers/aupac-typeahead';
registerAupacTypeaheadSearchHelpers();

moduleForAcceptance('Acceptance | typeahead-data');

test('no employees - no suggestions', function(assert) {
  let typeahead;
  server.createList('task', 4);      // make get task/3 succeed
  const selector = 'input[placeholder="Type employee..."]';
  visit('/');
  andThen(function() {
    typeahead = aupacTypeaheadFind(selector);
    aupacTypeaheadSearch(typeahead, 'em');
  });
  andThen(function() {
    assert.equal(aupacTypeaheadSuggestions(typeahead).length, 0, 'expected 0 suggestions');
    let notFoundElement = find('.typeahead-not-found'); 
    assert.equal(notFoundElement.length, 1, 'expected 1 not-found element');
    assert.equal(notFoundElement.text(), 'No results found.', 'expected different not-found text');
  });
});

test('5 employees - search - check suggestions - choose', function(assert) {
  let typeahead;
  const selector = 'input[placeholder="Type employee..."]';
  // let request return 5 employees
  server.createList('employee', 5);
  visit('/');
  andThen(function() {
    typeahead = aupacTypeaheadFind(selector);
    aupacTypeaheadSearch(typeahead, 'em');
  });
  andThen(function() {
    assert.equal(aupacTypeaheadSuggestions(typeahead).length, 5, 'expected 5 suggestions');
    aupacTypeaheadChoose(typeahead, 3);
  });
  andThen(function() {
    assert.equal(typeahead.val(), 'Employee 3');
  });
});

test('20 tasks - search - check suggestions - choose 1', function(assert) {
  let typeahead;
  server.createList('task', 20);
  visit('/');
  andThen(function() {
    typeahead = aupacTypeaheadFind('input[placeholder="Type task..."]');
    aupacTypeaheadSearch(typeahead, 'task 1');
  });
  andThen(function() {
    aupacTypeaheadChoose(typeahead, 2);
  });
  andThen(function() {
    assert.equal(typeahead.val(), 'Task 11');
  });
});
