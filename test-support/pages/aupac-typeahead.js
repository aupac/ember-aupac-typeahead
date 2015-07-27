import PageObject from 'callcentre2/tests/page-object';

const {
  visitable,
  selectable,
  text,
  value,
  count,
  fillable,
  clickOnText,
  customHelper,
  collection,
  clickable
  } = PageObject;

export function typeahead(selector, options) {
  return {
    search : function(search) {
      $(selector).val(search).trigger('input');
    },
    suggestions : collection({
      scope: '', //Reset to global scope
      itemScope: '.tt-suggestion',
      item: {
        select: clickable()
      }
    })
  };
}
