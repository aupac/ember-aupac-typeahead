# Master

# 2.1.1
* #35 (breaking) - add support for ember@2.10.0 when model is a string

All templates `footerTemplate`, `headerTemplate`, `notFoundTemplate`, `pendingTemplate` and `suggestionTemplate` are now supplied an object.

`suggestionTemplate`: is now always using displayName event when the returned result is a String.
{{model.diplayName}} whereas before it would have just been {{model}}

All other templates were previously passed a `query` or `suggestions` or both directly.
Now these are all prefixed with "model".

So `{{model.query}}` instead of `{{query}}` directly.

* If you are not using custom templates you will not be affected.
* If you were using aupac-ember-data-typeahead and customised the suggestion template you will not be affected. 

# 2.1.0
* #31 (enhancement) - Make compatible with ember@2.10.0, fixes submit issue
* #28 (bug) - Fix test helper

# 2.0.8
* #25 (enhancement) - Add tabIndex property
* #23 (enhancement) - Update for compatibility with ember 2.8.0
* #22 (enhancement) - Fixed test helper and added tests.
* #17 (enhancement) - transformSelection is now a computed property.

# 2.0.7
* #17 (bug) properly cleanup event handlers

# 2.0.6
* #15 (enhancement) - Use Ember.$ instead of $

# 2.0.5
* #13 (enhancement) pressing the enter key now behaves the same and focusout.
                    overriding the setValue(selection) function is now deprecated in favour of returning a value from transformSelection(selection)

# 2.0.4
* #11 (enhancement) new allowFreeInput option that will not clear the text on focus out.

# 2.0.3
* #6 (enhancement) added CHANGELOG.md
* #9 **BREAKING** "Maximum call stack size exceeded" due to computed.reads('selection') in ember 2.2.  This addon now requires the `readonly` helper on the selection `selection=(readonly model)` which is a simple mechanical refactor.

# 2.0.2
* #3 (regression) setting selection to null not working

# 2.0.1
* #5 (bug) toggling disabled property breaks css 

# 2.0.0
* **BREAKING** #4 (enhancement) Removed ember-template-compiler dependency and reduced payload size from 80kb to 19kb. This is a breaking change for people using custom templates as they now need to be compiled .hbs files instead of strings.  See "Using your own custom template" in README.md for a simple upgrade path.

# 1.0.0
*  First Official Release
