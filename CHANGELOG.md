# Master

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
