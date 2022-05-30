# Implemetation - Filter

This section of the implementation details is about the filter module, that contains the following **classes**:
- Selection
- Rule
- Filter

It also contains the following **helper functions**:
- setToMap() (Self explainatory, it will not be documented in this file, for any doubt, see the source code)

## Selection
This is a data class whose objects store the iformation about a set of entries of the types: Country, Provider, Status, Type and Service.
There is a different set for each type, each set is of type UnorderedSet (see [UnorderedSet]("Items/UnorderedSet")).

## Rule
This class represents a criteria for the filter. It enforces the type of the filtered item to be of type Provider, Status, Type or Country.

## Filter
This class represents the filter and contains all the logic for the filtering.
A service list is passed to the constructor, and it will internally keep track of all their associated properties.
The method addRule() can be used to add a criteria to the filter.
After the addition of 0 or more rules, the filter can return a Selection object containing a set of the filtered services, and a set for each item type (Provider, Status, Type, Country) containing the selectable items. An item cannot be selected if its selection makes the set of filtered services to be empty.
With the getSelected() method, the filter can return also the selcted items (correspondent to the added rules).

### Filtering algorithm
The filter operates on sets of items. Each item type is managed separately and then all the resulting services are merged.
For each item type, the filter loops through all the selected items if that type, gets all the services that have that property, and adds them to an UnorderedMap that stores the number of times a service has been referenced (this map is used to speed up updates made through addRule() by just updating the indexes without re-calculating all the other ones). If no selection is made for an item type, all items are considered selected. After each item type map is calculated, the filter makes an intersection between them, to get all the services that satisfy all the conditions.
The selectable items are all the selected items plus the items that when selected, does not make the filtered item set to be empty, and to calculate that, the filter checks the intersection of the candidate item's services with the other maps containing that store the number of the references to a service.






