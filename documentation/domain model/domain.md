# Domain Model

## Objects

- Providers
- Countries
- Types
- statuses
- Services
- Selected
- Selectable
- GUI application

## Description

- the GUI application shows the current selectable items, and logs the selected items
- the filter gives the selectable items given the selected items
- the filter contains the previously selected items and the currently selectable items based on previous choices
- Provider contains its services, country (the types and statuses are inherited from the services)
- Country contains providers (types and statuses are inherited from the providers
- Service contains the state, type and country, and provider
- Status and Type contain the services in which they are contained
![Alt text](./Domain_diagram.svg)
