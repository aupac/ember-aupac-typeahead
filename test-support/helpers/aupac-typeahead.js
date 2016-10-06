import Ember from 'ember';

function quoted(s) {
    return "'" + s + "'";
}

function typeaheadFind(f, selector) {
    let result = find(selector);
    if(!result || result.length !== 1) {
        throw new Error(f + ' $(' + quoted(selector) + ') should find 1 element but found ' + (result.length || 0));
    }
    return result.eq(0);
}

function typeaheadSuggestions(element) {
    return element.parent().parent().find('.typeahead-suggestion');
}

/**
 * Add extra test helper here, these will be shared among all projects
 */
export default function() {

	/**
	 * Will return the single typeahead element uniquely identified by the selector.
	 *
	 * @param selector : jquery selector of the typeahead input element
	 */
    Ember.Test.registerHelper('aupacTypeaheadFind', function(app, selector) {
        return typeaheadFind('aupacTypeaheadFind', selector);
    });

	/**
	 * Will populate the dropdown using the provided searchstring.
	 *
	 * @param element : the typeahead element
	 * @param searchString : The search text
	 */
    Ember.Test.registerAsyncHelper('aupacTypeaheadSearch', function(app, element, searchString) {
        element.val(searchString).trigger("input");
    });

	/**
	 * Allows you to retrieve the collection of suggestions used to populate the dropdown.
	 *
	 * @param element : the typeahead element
	 */
    Ember.Test.registerHelper('aupacTypeaheadSuggestions', function(app, element) {
        return typeaheadSuggestions(element);
    });

	/**
	 * Will pick the indexed item from the dropdown (retrieved by aupacTypeaheadSearch).
	 *
	 * @param element : the typeahead element
	 * @param index : The index of the element to pick (0 based)
	 */
    Ember.Test.registerAsyncHelper('aupacTypeaheadChoose', function(app, element, index) {
        let suggestions = typeaheadSuggestions(element);

        if(!suggestions.length || index >= suggestions.length) {
            throw new Error('aupacTypeaheadChoose index (' + index + ') out of bounds(' + (suggestions.length || 0) + ')');
        }

        suggestions[index].click();
    });
}
