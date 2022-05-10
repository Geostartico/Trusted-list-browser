# Internal behaviour diagram

## List behaviour

- When the program is opened the user has the choice to view either the countries list or the types of services list. In this case there is a **country/types listener** sending the event that the list is switched, therefore calling the **back-end** which, via the **filter**, filters only the relevant attributes from the **API-fecther**

## Filtering behaviour

- When the **start filtering event** the **country/types listener** is no longer shown, nor is the list of countries or types
- When the filtering is started the **back-end** calls via the **filter** the **API-fetcher**, which filters the first batch of selectable items, which are sent to the **item selection listener**
- when an item is deselected or selected the **item selection listener** logs it to the selected list
- when the current selection is completed the **send option listener** notificates the **GUI facade** which send the selected list to the **filter** which filters based on the items type and returns the next batch of selectables, iterating until the services are shown

![Alt text](./internal_behaviour.svg)

## TODO

- add filter interaction diagram