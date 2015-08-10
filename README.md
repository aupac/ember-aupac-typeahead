# ember-aupac-typeahead

A [typeahead.js](https://twitter.github.io/typeahead.js/) autocomplete for ember.
 - supports any datasource let it be local or remote.
 - explicit support for ember-data via the `aupac-ember-data-typeahead` component.
 - very customisable to meet your needs.
 
Demo [HERE](http://aupac.github.io/ember-aupac-typeahead/)

## Installation

`ember install ember-aupac-typeahead`

## aupac-ember-data-typeahead
The `aupac-ember-data-typeahead` component is an extension of the more generic `aupac-typeahead` and assumes you are using ember-data to retrieve you data remotely. This allows ember-data users to streamline the use of this component into a single line of code in their template.

### Component Attributes
In addition to all the features supported by `aupac-typeahead` (see below), `aupac-ember-data-typeahead` supports the following:

-  `modelClass` : (*required) the dasherized form of the ember-data model you are searching for. ie 'customer-address'
-  `suggestionKey` : (default: 'displayName') the attribute on the model to display to the user in the suggestion list,
-  `displayKey` : (default: 'displayName') the attribute to display to the user when an item is selected,
-  `params` : (default: {}) an object containing various query string parameters to send along with the remote request,

This component has already implemented the `source`, `setValue` and `display` functions to make them compatible with ember-data.  You do not need to do so yourself.

### Usage example
```javascript
{{aupac-ember-data-typeahead modelClass='task' action=(action (mut selection))}}
```

The above is all you need to have a fully functional autocomplete search in your page.  It would create an input that allows you to search for tasks and when selected would update the `selection` property on your controller.

## aupac-typeahead
The `aupac-typeahead` component contains no assumptions about how you are retrieving your data.  Both local and remote suggestions are supported.

### Component Attributes
-  `disabled` : (deafult: false) true if the control should be disabled.
-  `placeholder` : (default: 'Search') the placeholder text to display in the input.
-  `action`: the selected item will be provided as the first argument.
-  `selection` : will be set as the initial selection in the component.
-  `autoFocus`: (default: false) should thtroe control get focus on render.
-  `queryKey`: (default: 'q') the query parameter sent to the server containing the search text.
-  `setValue`: a function to set the initial value based on `selection`, signature `function(selection)`.
    
See the [typeahead docs](https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#datasets) for a more complete description of the items below.
-  `source` : (*required) a function to return an array of items to display to the user with the signature `function(query, syncResults, asyncResults)`. The callback functions `syncResults or asyncResults` should be called with and array of results as a parameter.
-  `async` : (default: false) true if the returned data is asynchronous.
-  `name` : (default: 'default') the name of the dataset.
-  `limit` : (default: 15) the maximum number of results to display to the user.
-  `display` : (default: will display the returned item as is) function that displays the selected item to the user, signature `function(model)`.
-  `suggestionTemplate` : an HTMLBars template used for suggestions, attribute bindings should be specified under the model object. ie `{{model.firstName}}`.
-  `notFoundTemplate` : an HTMLBars template that is rendered when no results are found.
-  `pendingTemplate` :  an HTMLBars template that is rendered when loading the result set but not yet resolved.
-  `headerTemplate` : an HTMLBars template displayed at the top of the search results.
-  `footerTemplate` : an HTMLBars template displayed at the bottom of the search results.  
          
See the [typeahead docs](https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#options) for a more complete description of the items below.
-  `highlight`: (default: true) true if matching text be highlighted in the search results.
-  `hint`: (default: true) true if hints be displayed in the input.
-  `minLength`: (default: 2) the minumum number of characters before a search in performed.
-  `classNames`: (default: {}) allows you to customise the class names used in typeahead.

#### Example
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
    const results = countries.filter(function(item, index, enumerable) {
      return regex.test(item);
    })
    syncResults(results);
  }

});
```

##Using your own version of [typeahead.js](https://twitter.github.io/typeahead.js/)
You can disable the importing of typeahead.js by adding the following to your `/config/environment.js`

```javascript
'ember-aupac-typeahead' : {
  includeTypeahead: false
}
```

The current compatible typeahead.js version is *v0.11.1*

##CSS Styling
See the [typeahead.js docs](https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#class-names) for applying your own custom styling.

##Testing

###[ember-cli-page-object](https://github.com/san650/ember-cli-page-object) is supported

TODO - better description of how to use this

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


## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
