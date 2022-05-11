# structure parsing dictionary

>the maps referred are Typescript records

1. from country list create **Country** objects and **Country** to code dictionary and code to country name dictionary(maybe more efficient with just one fetch)

2. from providerList create **Provider** objects and associate with corresponding **Country** and to this it associates the provider **Type**s
   1. from serviceList(inside provider item) create **Service** object and associate with corresponding **Provider** and **Country**.

