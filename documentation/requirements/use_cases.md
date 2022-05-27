# Use cases

## Requirements

### Mandatory

- Presenting a list of:
  - EU **countries**
  - "**types** of trusted services"
- **Selectioning/Deselectioning** from a list one or more:
  - countries
  - **provider**
  - types of services
  - status of a service
- when a selection is done, the next selections must show a list of only the available selections so that the list of selected services isn't empty
- Creating a query based on the items currently selectioned, returning a list of services

## User-stories

1. a user can choose how to sort the services based on type country, status and provider

2. a user can choose to select one or more objects from the list

3. a user can deselection an item from the list of items

4. the user is shown the available services based on the items they previously selected

5. on selection the user is shown only available further selections

6. if there is an error the user must be informed

## USE CASES

![Alt text](./use_cases_diagram.svg)

### USE CASE 1: visualising a list of a certain category of items

- description: the user is able to change to choose which category of items to visualise via the interface, thus making able to select items from different categories. In particular, if no selections were made, no filtering was done, therefore all the elements in the provider list must be shown.

- actors:user, trusted-list server

- pre-condition: no selections were made

- acceptance criteria: the program shows the selected list of all the elements of a specific criteria

- Possible errors: unable to connect to the trusted service
actors: user, trusted list server

- actions:
  - the user selects a category

### USE CASE 2: selecting an item(generalized for providers, countries, types, state)

- description: In order to view only specific items the user must have the possibility to filter the items by selecting an item using the given criteria. The items available afterwards must be coherent with the current selections, with rules defined by the filtering algorithm

- precondition: there are items available to be selected

- acceptance criteria: the interface shows only the available selectables given the previous selections and in particular doesn't show an empty list of services

- actors:user, trusted-list server

- actions:

  - the user selects the items on the list

  - items non-related to the selection are removed

### USE CASE 3: Remove selection from selected items

- description: the user must be able to remove a filtering item a in order to show the items that do not fit the specific criteria, therefore changing the set of selectable items

- actors:user, trusted-list server

- precondition: the user has already filtered the items by a criteria

- acceptance criteria: the item is no longer selected and the selectable items and selected services are coherent with currently selected items(given the rules defined by the filtering algorithm)

- actions:
  - via the interface the user is able to remove the selection from a specific item

### USE CASE 4: viewing the services

- description: the user is able to visualize the services given the filtered criteria they have chosen, therefore getting the infrmation relating to the item.

- actors:user, trusted-list server

- precondition: none

- acceptance criteria: the services (eventually filtered given the criteria) are shown

- actions:

  - either none (the interface always shows the services) or the interface is given a listener to show only the services