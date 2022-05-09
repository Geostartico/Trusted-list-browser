# Domain Model

## Objects

- Providers
- Countries
- Types
- Services
- Selections
- Interface
- States of the services
- items

## Description

- the application shows the current selectable items, when selection is done logs them in the query
- the query gives the selectable items given the previously selected categories of items from the application
- the query contains the previously selected items and the currently selectable items based on previous choices
- Provider contains its services, coyntry and type
- Country contains providers and types
- Service contains the state, type and country, and provider
- State contains a description of itself
- TODO:
  - list of countries: the list containing all possible countries for the services
  - list of types: the list containing all possible countries for the services
  - aggiungere da selectable a application
![Alt text](./Domain_diagram.svg)
