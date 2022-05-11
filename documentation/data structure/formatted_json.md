# Formatted json map structure

```js
Country{
    static unordered_map<string, string> codeToString;
    string countryCode;
    static unordered_map<string, Country> codeToObject;
    static getCountry(string code);
    set<Type> possibleTypes;
    set<Status> possibleStatus;
    set<Provider> providers[];
    initdict(List<countryCode, countryName>);
    Country(string);
    getCountryName(){
        ...
    }
    //getters...
    addType(type);
    addStatus(status);
    addprovider(provider);
    removeType(type);
    removeStatus(status);
    removeprovider(provider);
}
```

```js
Status{
    string link;
    string code;
}
```

```js
Service{
    string name;
    number serviceId;
    Country country;
    Provider provider;
    string type;
}
```

```js
Provider{
    string name;
    string trustMark;
    number serviceId;
    Country country;
    set<Service> services;
    set<string> types;
}
```
