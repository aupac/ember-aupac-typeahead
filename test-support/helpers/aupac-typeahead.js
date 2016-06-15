import Ember from 'ember';

/**
 * Add extra test helper here, these will be shared among all projects
 */
export default function() {

	/**
	 * Allows you to easily select an item from an ajax-search component.
	 *
	 * @param selector : jquery selector of the typeahead input element
	 * @param searchString : The search text
	 * @param suggestionIndex : The item to select from the drop down (starting at 1 for the first item)
	 */
    Ember.Test.registerHelper('aupacTypeaheadSearch', function (app, selector, searchString, suggestionIndex) {

        $(selector).eq(0).val(searchString).trigger("input");

        Ember.run(function() {
            click('.typeahead-suggestion:nth-child(' + suggestionIndex + ')');
        });

        return app.testHelpers.wait();
    });

}
