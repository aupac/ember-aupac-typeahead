# ember-aupac-typeahead

[typeahead.js](https://twitter.github.io/typeahead.js/) autocomplete for ember.
 - Supports ember-data.
 - Very customisable to meet your needs.
 
Demo [HERE](http://aupac.github.io/ember-aupac-typeahead/)

## Installation

Sorry, this addon is not yet ready for consumption!

## aupac-ember-data-typeahead
The `aupac-ember-data-typeahead` component is an extension of `aupac-typeahead` and assumes you are using ember-data to retrieve you data remotely.  This allows ember-data user to streamline the use of this component into a single line in their template.

### Component Attributes
In addition to all the features supported by `aupac-typeahead` (see below), `aupac-ember-data-typeahead` supports the following:

-  `modelClass` : (required) the dasherized form of the ember-data model you are searching for. ie 'customer-address'
-  `suggestionKey` : (default: 'model.displayName') the attribute on the model to display to the user in the suggestion list,
-  `displayKey` : (default: 'model.displayName') the attribute to display to the user when an item is selected,
-  `params` : (default: {}) an object containing various query string parameters to send along with the remote request,

This component has already implemented the `source`, `setValue` and `display` functions to make them compatible with ember-data.  You do not need to do so yourself.

### Example
```javascript
{{aupac-ember-data-typeahead modelClass='task' action=(action (mut selection)) class='form-control'}}
```

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
-  `source` : a function to return an array of items to display to the user with the signature `function(query, syncResults, asyncResults)`.
-  `async` : (default: false) true if the returned data asynchronous.
-  `name` : (default: 'default') the name of the dataset.
-  `limit` : (default: 15) the maximum number of results to display to the user.
-  `display` : (default: will display the returned item as is) function that displays the selected item to the user, signature `function(model)`.
-  `suggestionTemplate` : a handlebars template used for suggestions, attribute bindings should be specified under the model object. ie `{{model.firstName}}`.
-  `notFoundTemplate` : a template that is rendered when no results are found.
-  `pendingTemplate` :  a template that is rendered when loading the result set but not yet resolved.
-  `headerTemplate` : a template displayed at the top of the search results.
-  `footerTemplate` : a template displayed at the bottom of the search results.  
          
See the [typeahead docs](https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#options) for a more complete description of the items below.
-  `highlight`: (default: true) true if matching text be highlighted in the search results.
-  `hint`: (default: true) true if hints be displayed in the input.
-  `minLength`: (default: 2) the minumum number of characters before a search in performed.
-  `classNames`: (default: {}) allows you to customise the class names used in typeahead.

#### Example
```javascript
TODO
```

##Using your own version of [typeahead.js](https://twitter.github.io/typeahead.js/)
You can disable the importing of typeahead.js but adding the following to your `/config/environment.js`

```javascript
'ember-aupac-typeahead' : {
  includeTypeahead: false
}
```

The current compatible version is *v0.11.1*

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
