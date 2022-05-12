# This things are required

1. I have a reference to the lists/sets of countries, types, services, and providers
2. I have some filter criteria
    - Attribute: `countriesToFilter` a set that contains the countries that I have to filter
    - Attribute: `typesToFilter` ...
    - ...
3. The public exposed functions should be:
    - Filter() constructor
    - removeCountry(<string> countryId) function
    - removeType(<string> typeName) function
    - removeProvider(<string> providerId) function
    - removeStatus(<string> statusName) function
    - addProvider(<string> providerId) function
    - addType(<string> typeName) function
    - addCountry(<string> countryId) function
    - addStatus(<string> statusName) function

> Note: The priority is
> 1. Country
> 2. Type
> 3. Service
> 4. Providers
