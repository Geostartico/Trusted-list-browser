
# Test

## System test

## Test case 1

- Summary: when the application is executed, it must call the api and consequentially initialise the objects, to then show them on the view component of the GUI. Since no filter is chosen at the beginning, all services can be viewed

- Precondition: the application was opened and the set-up was finalised correctly

- Postcondition: on the view component all the services are shown

- Test script:
  1) yarn start is run in the application directory
  2) wait for the objects to be initialised

- excution variables: none

## Test case 2

- Summary: on the filter component the filter category must be able to be changed and to visualise the different selectable items

- Precondition: the set-up was completed

- Postcondition:
  1) the items from the selected category are shown
  2) the previously selected items from the selected category are shown
  3) the items that aren't selectable from in the category aren't selectable

- Test script:
  1) select a category
  2) view the selectable items

- execution variables: none

## Test case 3

- Summary: on the filter component the available selectable items are shown, and on selection the the services shown (generally) change

- Precondition: there are selectable items on the filter component

- Postcondition:
  1) the filter results as selected
  2) the services shown on the view component are at least one
  3) the services shown are coherent with the selection

- Test script:
  0) select the category of filter
  1) select an item from the list
  2) view the items

- execution variables: different sequences of selected filters may lead to different selectable items and therefore it must be tested if there are combinations which break the filtering process

## Test case 4

- Summary: on the filter component the selected items must be selectable, eventually giving an error if the deselection returns would make the list of selected services empty

- Precondition: items are selected

- Postcondition:
  1) the previously selected item is no longer selected
  2) the services shown on the view component are at least one
  3) the services shown are coherent with the currently selected items

  or

  1) the item isn't deselected
  2) an error is shown  

- Test script:
  1) a selected in the filter list is chosen
  2) the filter is deselected
  3) the selected services are viewed

- execution variables: different initial configurations and different orders of deselection may lead to different results

## Unit tests

- unit tests are contained in directories named "\_\_tests\_\_" under the following directories in src:
  - decoder
  - facade
  - fetch
  - filter
- no unit tests are made on the gui as they would be rather difficult to define in a testing framework
- tests are written using the react test framework
- most of the tests don't test the possibility of passing a undefined or null variable. This is because typescript won't let the user pass a undefined or null reference unless explicitly specified in the function definition or if it has a parameter with "any" type. note: javascript lets you pass undefined or null values because it doesn't have typechecking, thus in the test is perfectly valid to pass undefined or null values. This doesn't happen in the actual code as it is entirely written in typescript
- To run tests one must run yarn test on the main repository directory and press "a" if needed.
