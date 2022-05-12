# Formatted json map structure

```js
Country{
    static unordered_map<string, string> codeToString;
    string countryCode;
    static unordered_map<string, Country> codeToObject;
    static getCountry(string code);
    set<string> possibleTypes;
    set<string> possibleStatus;
    Provider providers[];
    initdict(List<countryCode, countryName>);
    Country(string);
    getCountryName(){
        ...
    }
    //getters...
    addType(string);
    addStatus(string);
    addprovider(provider);
    removeType(string);
    removeStatus(string);
    removeprovider(provider);
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
