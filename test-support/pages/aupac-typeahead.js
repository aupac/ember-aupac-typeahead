import PageObject from '../../tests/page-object';

const {
  value,
  customHelper,
  collection,
  clickable
  } = PageObject;

export default function typeahead(selector, options) {
  return {
    search(search) {
      $(selector).val(search).trigger('input');
    },
    suggestions : collection({
      scope: '', //Reset to global scope
      itemScope: '.tt-suggestion',
      item: {
        select: clickable()
      }
    }),
    value : value(selector)
  };
}
