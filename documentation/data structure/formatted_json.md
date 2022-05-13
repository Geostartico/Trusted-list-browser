# Formatted json map structure

```ts
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

```ts
Service{
    string name;
    number serviceId;
    string tob;
    Country country;
    Provider provider;
    string status;
    string[] sericeTypes;
    string type
}
```

```ts
Provider{
    string name;
    string trustMark;
    number tspId;
    Country country;
    string trustMark;
    Service[] services;
    Set<string> possibleStatus;
    set<string> types;
}
```
