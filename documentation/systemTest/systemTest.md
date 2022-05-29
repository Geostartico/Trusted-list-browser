# System Test



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

- Summary: on the filter component the selected items must be selectable, eventually changing the selected services

- Precondition: items are selected

- Postcondition:
  1) the previously selected item is no longer selected
  2) the services shown on the view component are at least one
  3) the services shown are coherent with the currently selected items
  4) filters that would make the selected services list empty are automatically deselected

- Test script:
  1) a selected in the filter list is chosen
  2) the filter is deselected
  3) the selected services are viewed

- execution variables: different initial configurations and different orders of deselection may lead to different results

