function mapCheckAndSet<T>(value: T, map: Map<T, number>){
    if(map.has(value)){
        map.set(value, map.get(value)+1);
    }
    else{
        map.set(value, 1);
    }
}

class Service{
    readonly provider: Provider;
    readonly type: string;
    readonly name: string;
    readonly status: string;
    readonly description: string;

    constructor(name: string, description: string, type: string, status: string, provider: Provider){
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


class Provider{
    readonly country: Country;
    readonly trustMark: string;
    readonly name: string;
    _possibleTypes: Map<string, number>;
    _possibleStatus: Map<string, number>;
    _services: Set<Service>;

    constructor(name: string, trustMark: string, country: Country){
        this.country = country;
        this.name = name;
        this.trustMark = trustMark;
        this._services = new Set<Service>();
        this._possibleStatus = new Map<string, number>();
        this._possibleTypes = new Map<string, number>();

        country._providers.add(this);
    }
}


class Country{
    static codeToName: Record<string, string>;
    static codeToCountry: Record<string, Country>;
    readonly name: string;
    readonly countryCode: string;
    _possibleTypes: Map<string, number>;
    _possibleStatus: Map<string, number>;
    _providers: Set<Provider>;

    constructor(name: string, countryCode: string){
        this.name = name;
        this.countryCode = countryCode;
        this._possibleStatus = new Map<string, number>();
        this._possibleTypes = new Map<string, number>();
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
]

let services = [
    new Service("aName", "aDescription", "type1", "status1", providers[1]),
    new Service("aName2", "aDescription", "type2", "status1", providers[0]),
    new Service("aName3", "aDescription", "type1", "status1", providers[1]),
]

