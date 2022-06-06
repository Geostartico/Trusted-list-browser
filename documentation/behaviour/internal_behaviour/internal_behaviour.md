# Internal behaviour diagram

## Initialization

- When the program is launched the **GUI facade** creates the **back-end facade**, which retrieves information about the services via the **fetcher**, to decode with the **decoder** (that turns it into objects). The **GUI facade** then gets the initial information from the **back-end facade** in order to initialise the list of **selected items** and **selectable items**

## List behaviour

- When the program is opened the user has the choice to view **Countries**, **Type**, **Provider**, **Status** list or the types of services list. In this case there is a **category listener**, which changes the viewed list.

![Alt text](./internal_behaviour.svg)
