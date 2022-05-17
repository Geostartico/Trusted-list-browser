function mapCheckAndSet(value, map) {
    if (map.has(value)) {
        map.set(value, map.get(value) + 1);
    }
    else {
        map.set(value, 1);
    }
}
class Service {
    constructor(name, description, type, status, provider) {
        this.provider = provider;
        this.type = type;
        this.name = name;
        this.description = description;
        provider._services.add(this);
        mapCheckAndSet(status, provider._possibleStatus);
        mapCheckAndSet(type, provider._possibleTypes);
        mapCheckAndSet(status, provider.country._possibleStatus);
        mapCheckAndSet(type, provider.country._possibleTypes);
    }
}
class Provider {
    constructor(name, trustMark, country) {
        this.country = country;
        this.name = name;
        this.trustMark = trustMark;
        this._services = new Set();
        this._possibleStatus = new Map();
        this._possibleTypes = new Map();
        country._providers.add(this);
    }
}
class Country {
    constructor(name, countryCode) {
        this.name = name;
        this.countryCode = countryCode;
        this._possibleStatus = new Map();
        this._possibleTypes = new Map();
        this._providers = new Set();
        Country.codeToCountry[countryCode] = this;
        Country.codeToName[countryCode] = name;
    }
}
let italy = new Country("italy", "IT");
let germany = new Country("germany", "DE");
let providers = [
    new Provider("telecom", "trustmark1", italy),
    new Provider("poste", "trustmark2", italy),
    new Provider("shaise", "trustmark2", germany),
];
let services = [
    new Service("aName", "aDescription", "type1", "status1", providers[1]),
    new Service("aName2", "aDescription", "type2", "status1", providers[0]),
    new Service("aName3", "aDescription", "type1", "status1", providers[1]),
];
