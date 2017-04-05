# ember-aupac-typeahead

[![NPM package](https://img.shields.io/npm/v/ember-aupac-typeahead.svg)](https://www.npmjs.com/package/ember-aupac-typeahead) [![Build Status](https://img.shields.io/travis/aupac/ember-aupac-typeahead.svg)](https://travis-ci.org/aupac/ember-aupac-typeahead) [![Ember Observer Score](http://emberobserver.com/badges/ember-aupac-typeahead.svg)](http://emberobserver.com/addons/ember-aupac-typeahead)

![alt tag](https://github.com/aupac/ember-aupac-typeahead/blob/master/example.jpg)

A [typeahead.js](https://twitter.github.io/typeahead.js/) autocomplete for ember.
Updated to work with maintained fork [corejs-typeahead](https://github.com/corejavascript/typeahead.js))
 - supports any datasource let it be local or remote.
 - explicit support for ember-data via the `aupac-ember-data-typeahead` component.
 - very customisable to meet your needs.
 
Demo [HERE](http://aupac.github.io/ember-aupac-typeahead/)

## Installation

`ember install ember-aupac-typeahead`

## Prerequisites

 * `ember-data` > 1.13.x if using the `aupac-ember-data-typeahead` component
 * `ember.js` > 1.13.x

## `aupac-ember-data-typeahead` component
The `aupac-ember-data-typeahead` component is an extension of the more generic `aupac-typeahead` and assumes you're using ember-data to retrieve your data remotely. This allows ember-data users to streamline the use of this component into a single line of code in their template.

#### Component Attributes
By default, each ember-data model supplied in `modelClass` is required to have a `displayName` (computed property or attribute) that will return a string representing the name to display in the suggestion template.  If this is not possible you can override the `suggestionTemplate` and supply something else (see below). 

In addition to all the features supported by `aupac-typeahead` (see below), `aupac-ember-data-typeahead` supports the following:

-  `modelClass` : (*required) the dasherized form of the ember-data model you're searching for. ie 'customer-address'
-  `displayKey` : (default: 'displayName') the attribute to display to the user when an item is selected,
-  `params` : (default: {}) an object containing various query string parameters to send along with the remote request,
-  `queryKey`: (default: 'q') the query parameter sent to the server containing the search text.
-  `selection` : (default: null) initial selection - can be an `ember-data` model (in which case the `displayKey` is used as the initial value) or a `string` which will display as is. Wrap selection in `(readonly x)` helper to avoid two-way binding.

This component has already implemented the relevant functions to make them compatible with ember-data.  You do not need to do so yourself.

#### Usage example
```html
<!--In this case the ember-data model "task" needs a displayName attribute-->
{{aupac-ember-data-typeahead modelClass='task' action=(action (mut selection))}}
```

The above is all you need to have a fully functional autocomplete search in your page.  It would create an input that allows you to search for tasks and when selected would update the `selection` property on your controller.

## `aupac-typeahead` component
The `aupac-typeahead` component contains no assumptions about how you're retrieving your data.  Both local and remote suggestions are supported.

#### Component Attributes
-  `disabled` : (deafult: false) true if the control should be disabled.
-  `placeholder` : (default: 'Search') the placeholder text to display in the input.
-  `name` : (default: '') the name of the typeahead input.
-  `action`: (*required) the selected item will be provided as the first argument.
-  `selection` : (default: null) will be set as the initial selection in the component. Wrap selection with helper `(readonly x)` to avoid two-way binding. 
-  `autoFocus`: (default: false) focus the control on render.
-  `transformSelection`: (default: no transform) allows you to transform the selected value before it is set on the typeahead by returning the transformed value, signature `function(selection)`
-  `allowFreeInput`: (default: false) allows the user to input their own values that are not part of the option list.  Only useful if the item being selected is a String.
-  `tabindex`: allows you to define a numeric tab index for the input
    
See the [typeahead docs](https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#datasets) for a more complete description of the items below.
-  `source` : (*required) a function to return an array of items to display to the user with the signature `function(query, syncResults, asyncResults)`. The callback functions `syncResults or asyncResults` should be called with and array of results as a parameter.
-  `async` : (default: false) true if the returned data is asynchronous.
-  `datasetName` : (default: 'default') the name of the dataset.
-  `limit` : (default: 15) the maximum number of results to display to the user.
-  `display` : (default: will display the returned item as is) function that displays the selected item to the user, signature `function(model)`.
-  `suggestionTemplate` : a precompiled HTMLBars template used for suggestions, attribute bindings should be specified under the model object. ie `{{model.firstName}}`. If the returned value is **not** an object, it will be bound under {{model.displayName}}.
-  `notFoundTemplate` : a precompiled HTMLBars template that is rendered when no results are found.
-  `pendingTemplate` :  a precompiled HTMLBars template that is rendered when loading the result set but not yet resolved.
-  `headerTemplate` : a precompiled HTMLBars template displayed at the top of the search results.
-  `footerTemplate` : a precompiled HTMLBars template displayed at the bottom of the search results.  
          
See the [typeahead docs](https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#options) for a more complete description of the items below.
-  `highlight`: (default: true) true if matching text be highlighted in the search results.
-  `hint`: (default: true) true if hints be displayed in the input.
-  `minLength`: (default: 2) the minumum number of characters before a search in performed.
-  `typeaheadClassNames`: (default: {}) allows you to customise the class names used in typeahead.

##### Example
In your template
```javascript
    {{aupac-typeahead action=(action (mut country))
      class='form-control'
      source=countrySource
      placeholder='Search for a country'}}
```

In your controller
```
const countries = Ember.A(["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
  ,"Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands"
  ,"Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica"
  ,"Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea"
  ,"Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana"
  ,"Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India"
  ,"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia"
  ,"Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania"
  ,"Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia"
  ,"New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal"
  ,"Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles"
  ,"Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan"
  ,"Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia"
  ,"Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)"
  ,"Yemen","Zambia","Zimbabwe"]);

export default Ember.Controller.extend({

  country : null,
  countrySource : function(query, syncResults, asyncResults) {
    const regex = new RegExp(`.*${query}.*`, 'i');
    const results = countries.filter((item, index, enumerable) => {
      return regex.test(item);
    })
    syncResults(results);
  }

});
```

## Using your own custom template
You can override the `suggestionTemplate`, `notFoundTemplate`, `pendingTemplate`, `headerTemplate` or `footerTemplate` used by importing a `*.hbs` file and assigning to the appropriate property.

For example
```html
{{!-- app/templates/country-templates/suggestion.hbs --}}
<div class='typeahead-suggestion'><img src="http://www.gravatar.com/avatar/0cf15665a9146ba852bf042b0652780a?s=200" style="width: 10%; height: 10%">{{model.displayName}}</div>
```

Then in your controller
```javascript
import customSuggestionTemplate from '../templates/country-templates/suggestion';

export default Ember.Controller.extend({

  customSuggestionTemplate: customSuggestionTemplate

})
```

And assign it to your template
```html
{{aupac-typeahead action=(action (mut country))
... bind the custom suggestion template to the component
suggestionTemplate=customSuggestionTemplate
}}
````

## Using your own version of [typeahead.js](https://twitter.github.io/typeahead.js/)
You can disable the importing of typeahead.js by adding the following to your `/config/environment.js`

```javascript
'ember-aupac-typeahead' : {
  includeTypeahead: false
}
```

The current compatible typeahead.js version is *v0.11.1*

## CSS Styling
By default, Bootstrap 3 compatible css styles are included with the addon, you can disable this by adding:

```javascript
'ember-aupac-typeahead' : {
  includeCss: false
}
```

See the [typeahead.js docs](https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#class-names) for applying your own custom styling.

## Testing

#### [ember-cli-page-object](https://github.com/san650/ember-cli-page-object) is supported

`test/pages/aupac-typeahead.js`

```javascript
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
```

TODO - show example


## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
