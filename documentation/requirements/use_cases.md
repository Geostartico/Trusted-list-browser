# Use cases

## Requirements

### Mandatory

- Presenting a list of:
    -EU **countries**
    -"**types** of trusted services"
- **Selectioning/Deselectioning** from a list one or more:
  - countries
  - **provider**
  - types of services
  - countries of a service
- when a selection is done, the next selections must show a list of only the available selections(alias when i'm done selecting the categories the providers/services shown are only the available ones)
- Creating a query based on the items currently selectioned, returning a list of services

### Suggested

- returning the query of services to a file
- showing a list of selectioned items

## User-stories

1. a user can choose how to sort the services based on type or country

2. a user can choose to select one or more objects from the list

3. a user can deselection an item from the list of items

4. the user is shown the available services based on the objects they previously selected

5. on selection the user is shown only available selctions

6. if there is an error the user must be informed

NOTE: from here on the actors are always assumed to be the user

## USE CASE 1: visualising the list of Countries or types of services

- pre-condition: a user opens the program or returns to the initial page

- postcondition: the program shows the selected list

- actions:
  - the user visualizes the list of possible sorting algorithms (currently by country or by type)
  - the user selects only one of the possible sortings

## USE CASE 2: filtering services by items(generalized for providers, countries, types, state)

- precondition: the user is given a list of items

- postcondition: the user is given a filtered list of sub-items

- actions:

  - the user selects the items on the list (one or more)

  - the user selects to query the list of items selected items (if there aren't any items in the selected list a error is shown)

## USE CASE 3: viewing a service

- precondition: the list shows services

- postcondition: the details of the service are shown

- actions:
  - the user selects a service

## USE CASE 4: Showing only relevant items

- precondition: the user has already filtered the items by a criteria
- postcondition: the user is only shown items relevant to the previous selections
- actions:
  - the user has finalises a selection and the list is updated
side effect: non-relevant items are hidden from the user

![Alt text](./use_cases_diagram.svg)
>chidere a cosa si riferisce per template per gli use-cases
>Aggiungerne altri?
>Aggiungere server come attore