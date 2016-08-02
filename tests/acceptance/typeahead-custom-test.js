/* global aupacTypeaheadFind, aupacTypeaheadSearch, aupacTypeaheadSuggestions */
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

import registerAupacTypeaheadSearchHelpers from '../../tests/helpers/aupac-typeahead';
registerAupacTypeaheadSearchHelpers();

moduleForAcceptance('Acceptance | typeahead-custom');

const selector = 'input[placeholder="Search for another country"]';

function findTypeahead() {
  return aupacTypeaheadFind(selector);
}

test('visiting - enter a search - check custom elements', function(assert) {
  let typeahead;
  visit('/');
  andThen(function () {
    typeahead = findTypeahead();    
    aupacTypeaheadSearch(typeahead, 'ne');
  });
  andThen(function() {
    assert.equal(aupacTypeaheadSuggestions(typeahead).length, 15, 'Expected 15 suggestions');
    let headers = find('.typeahead-header');
    assert.equal(headers.length, 1, 'Expected 1 footer');
    assert.equal(headers.text(), 'I am a custom header');
    let footers = find('.typeahead-footer');
    assert.equal(footers.length, 1, 'Expected 1 header');
    assert.equal(footers.text(), 'I am a custom footer');
  });
});

test('visiting - enter a search without results - check custom elements', function(assert) {
  let typeahead;
  server.createList('task', 4);      // make get task/3 succeed
  visit('/');
  andThen(function () {
    typeahead = findTypeahead();
    aupacTypeaheadSearch(typeahead, 'zz');
  });
  andThen(function() {
    assert.equal(aupacTypeaheadSuggestions(typeahead).length, 0, 'Expected no suggestions');
    let notFoundElement = find('.typeahead-not-found'); 
    assert.equal(notFoundElement.length, 1, 'Expected 1 not-found element');
    assert.equal(notFoundElement.text(), 'GRRRR nothing found :(', 'Expected different not-found text');
    let headers = find('.typeahead-header');
    assert.equal(headers.length, 1, 'Expected 1 footer');
    assert.equal(headers.text(), '');
    let footers = find('.typeahead-footer');
    assert.equal(footers.length, 1, 'Expected 1 header');
    assert.equal(footers.text(), '');
  });
});
