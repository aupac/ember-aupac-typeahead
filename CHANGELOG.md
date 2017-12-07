# Master

# 3.0.0
* (enhancement) Updated to support ember@2.17.0
* (breaking) Now using npm instead of bower for corejs-typeahead

# 2.3.3
* (bug) #63 Action not called when value cleared out

# 2.3.2
* (enhancement) - send event name to action

# 2.3.1

* (bug) #59 Fix called method

# 2.3.0

* #58 Fix assetPath in treeForVendor
* #57 Remove unnecessary calls to action when focusing out
* #54 Fix minor typo and remove extra whitespace in README
* #53 (breaking) Prepare for ember-cli-fastboot 1.0 build format

  Please update to ember-fastboot > 1.0

* #49 Add syntax highlighting to README
* #48 Fix binding of includeCss and includeTypeahead, add Fastboot support

# 2.2.0

* #46 updates unmaintained typeahead.js dependency to use maintained fork core-typeahead
* #44 upgrade dependencies

# 2.1.2

* #37 (improvement) - Remove deprecated Ember.K

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
