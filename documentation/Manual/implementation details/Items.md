# Items

In order for the filering to be easier we decided to implement an object oriented way to organise the items to be filtered

## classes

- Provider
- Service
- Status
- Type
- Country

## Status and Type

- Status and Type should have been strictly attributes of other objects as strings, however we decided to make them classes in order to facilitate the filtering process.
- they contain the services which provide them, so that the filter can know in O(1) which services to filter out, instead of having to check every service

## Country

- collection of Providers
- it contains two maps:
  - Statuses : the collection of the statuses of the services of the providers, with the value being the number of services having the attribute in the country
  - Types : the collection of the types of the services of the providers, with the value being the number of services having the attribute in the country
- having a map instead of a set facilitates the filtering

## Provider

- Collection of Services
- like the country it contains two maps with the same purpose as above

## Services

- Collection of Types with a status

### the Containers issue

- The typescript standard library does contain the Map and Set classes, however they aren't implement for OOP, as there is no way for these containers to consider two identical objects the same object if the two don't point to the same memeory area.
- This could have created issues along the way and made it difficult to debug the code
- We therefore decided to implement an ***UnorderedMap** and an **UnorderedSet**
- The items that are to be contained must implement the interface **Settable**, which provide methods(**hashCode** and **isEqualTo**) to get the hashcode and check if two items are identical.

### support for frontEnd

- in order for the frontEnd to have a univocal way to print these objects it was decided to add the **Item** interface
- **getText**: returns the string description of the item
- **getChildren**: to keep the visualizasion of the items tidy, every item returns the items immediately below them hierarchically

### High coupling betweeen these classes

- the classes are densely connected between each other
- this was decided so that it was possible to easily retrieve information about an object without having to check all the other objects
- this way the filtering and printing of an object is easier
- the high coupling is also a relative problem as the objects are mostly static throughout their lifetime

### objectify function

- function to convert from the dictionary of provider objects returned from the query to actual item objects
- even though the objects provide modifying methods we made sure to only use them on creation of these so that the debugging is easier and the behaviour of the objects consistent.
