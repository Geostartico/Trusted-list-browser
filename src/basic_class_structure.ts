class Service{
    private static idCount = 0;
    private readonly _id: number;
    readonly provider: Provider;
    readonly type: string;
    readonly name: string;
    readonly status: string;
    readonly description: string;

    constructor(name: string, description: string, type: string, status: string, provider: Provider){
        this._id = Service.idCount++;
        this.provider = provider;
        this.type = type;
        this.name = name;
        this.description = description;

        provider._services.add(this);
        provider._possibleStatus.add(status);
        provider._possibleTypes.add(type);
        provider.country._possibleStatus.add(status);
        provider.country._possibleTypes.add(type);
    }
}


class Provider{
    private static idCount = 0;
    private readonly _id: number;
    readonly country: Country;
    readonly trustMark: string;
    readonly name: string;
    _possibleTypes: Set<string>;
    _possibleStatus: Set<string>;
    _services: Set<Service>;

    constructor(name: string, trustMark: string, country: Country){
        this._id = Provider.idCount++;
        this.country = country;
        this.name = name;
        this.trustMark = trustMark;
        this._services = new Set<Service>();
        this._possibleStatus = new Set<string>();
        this._possibleTypes = new Set<string>();

        country._providers.add(this);
    }
}


class Country{
    private static idCount = 0;
    static codeToName: Record<string, string>;
    static codeToCountry: Record<string, Country>;
    private readonly _id: number;
    readonly name: string;
    readonly countryCode: string;
    _possibleTypes: Set<string>;
    _possibleStatus: Set<string>;
    _providers: Set<Provider>;

    constructor(name: string, countryCode: string){
        this._id = Country.idCount++;
        this.name = name;
        this.countryCode = countryCode;
        this._possibleStatus = new Set<string>();
        this._possibleTypes = new Set<string>();
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

