/* global aupacTypeaheadFind, aupacTypeaheadSearch, aupacTypeaheadChoose, aupacTypeaheadSuggestions */
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import registerAupacTypeaheadSearchHelpers from '../../tests/helpers/aupac-typeahead';

const typeaheadSelector = 'input[placeholder="Search for a country"]';


registerAupacTypeaheadSearchHelpers();

moduleForAcceptance('Acceptance | typeahead');

function findTypeahead() {
  return aupacTypeaheadFind(typeaheadSelector);
}

test('finding country input - check is empty', function(assert) {
  let typeahead;
  visit('/');
  andThen(function() {
    typeahead = findTypeahead();
    assert.equal('', typeahead.val());
  });
});

test('check there are 0 not-found elements', function(assert) {
  server.createList('task', 4);      // make get task/3 succeed
  visit('/');
  andThen(function() {
    let notFoundElement = find('.typeahead-not-found');
    assert.equal(notFoundElement.length, 0, 'expected 0 not-found elements');
    assert.equal(notFoundElement.text(), '', 'expected different not-found text');
    let headers = find('.typeahead-header');
    assert.equal(headers.length, 1, 'Expected 1 footer');
    assert.equal(headers.text(), '');
    let footers = find('.typeahead-footer');
    assert.equal(footers.length, 1, 'Expected 1 header');
    assert.equal(footers.text(), '');
  });
});

test('enter a search - check suggestions - dont choose', function(assert) {
  let typeahead;
  visit('/');
  andThen(function() {
    typeahead = findTypeahead();
    aupacTypeaheadSearch(typeahead, 'ne');
  });
  andThen(function() {
    assert.equal(typeahead.val(), 'ne');
    assert.equal(aupacTypeaheadSuggestions(typeahead).length, 15);
  });
});

test('enter a search - choose first suggestion', function(assert) {
  let typeahead;
  visit('/');
  andThen(function() {
    typeahead = findTypeahead();
    aupacTypeaheadSearch(typeahead, 'ne');
  });
  andThen(function() {
    aupacTypeaheadChoose(typeahead, 0);
  });
  andThen(function() {
    assert.equal(typeahead.val(), 'Brunei');
  });
});

test('enter a search - choose last suggestion', function(assert) {
  let typeahead;
  visit('/');
  andThen(function() {
    typeahead = findTypeahead();
    aupacTypeaheadSearch(typeahead, 'az');
  });
  andThen(function() {
    aupacTypeaheadChoose(typeahead, 3);
  });
  andThen(function() {
    assert.equal('Swaziland', typeahead.val());
  });
});
