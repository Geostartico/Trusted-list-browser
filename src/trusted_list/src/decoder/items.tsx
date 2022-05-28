import{UnorderedSet} from "./UnorderedSet"
import{Settable} from "./settable";
import{UnorderedMap} from "./UnorderedMap"
import{Item} from "./itemInterface"
/**
 * calculates the hash of a function
 * @param str a string
 * @returns the hash(with ciclyc shift) of str
 */
function stringHash(str : string): number {
    let hash = 0, i: number, chr: number;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
}


/**
 * Represents the type of the filtering item
 */
export enum ItemType {
    Country,
    Provider,
    Status,
    Type,
    Service
}

/**
 * Represents a service type
 */
export class Type implements Settable<Type>, Item{

    /**
     * @readonly
     */
    readonly name: string;

    readonly services: UnorderedSet<Service>;

    readonly item_type = ItemType.Type;

    /**
     * hashcode of the type
     * @returns the hashcode of the type name
     * @see Settable
     */
    public hashCode(): number{
        return stringHash(this.name);
    }

    /**
     * checks if two types are the same
     * @param el the second type
     * @returns if the two names are the same
     * @see Settable
     */
    public isEqual(el: Type): boolean{
        return this.name === el.name;
    }
    /**
     * @param name name of the Type
     */
    constructor(name: string){
        this.name = name;
        this.services = new UnorderedSet<Service>(10);
    }
    /**
     * 
     * @returns name of the serviceType
     */
    getText(): string {
        return this.name;
    }
    /**
     * 
     * @returns empty object, there's no object hierarchically lower than the ServiceTypes
     */
    getChildren(): any[] {
        return [];
    }
}

/**
 * Represents a service status
 */
export class Status implements Settable<Status>, Item{

    /**
     * @readonly
     */
    readonly name: string;

    readonly item_type = ItemType.Status;

    /**
     * @readonly
     */
    readonly services: UnorderedSet<Service>;

    /**
     * hashcode of the status
     * @returns the hashcode of the status name
     * @see Settable
     */
    public hashCode(): number{
        return stringHash(this.name);
    }

    /**
     * checks if two statuses are the same
     * @param el the second status
     * @returns if the two names are the same
     * @see Settable
     */
    public isEqual(el: Status): boolean{
        return this.name === el.name;
    }
    /**
     * @param aName name of the status
     */
    constructor(aName: string){
        this.name = aName;
        this.services = new UnorderedSet<Service>(10);
    }
    /**
     * @returns the name of the status
     */
    getText(): string {
        let i = this.name.length - 1;
        let n : string = "";
        while(i >= 0 && this.name.charAt(i) !== '/'){
            n = this.name.charAt(i) + n;
            i --;
        }
        return n;
    }
    /**
     * 
     * @returns an empty array, there's no object lower hierarchically than the Status
     */
    getChildren(): any[] {
        return [];
    }
}

/**
 * Represents a service
 */
export class Service implements Settable<Service>, Item{
    /**
     * name of the Service
     * @readonly
     */
    readonly name : string;

    readonly item_type = ItemType.Service;

    /**
     * Id of the service
     * @readonly
     */
    readonly serviceId : number;
    /**
     * set of the service types given by the service
     * @private
     */
    private serviceTypes : UnorderedSet<Type>;
    /**
     * provider of the service
     * @private
     */
    private provider : Provider;
    /**
     * status of the service
     * @readonly
     */
    readonly status : Status;
    /**
     * url of the type of service
     * @readonly
     */
    readonly type : string;
    /**
     * tspId of the service
     * @readonly
     */
    readonly tspId : number;
     /**
     * tob of the server
     * @readonly
     */
    readonly tob : string | null;
    /**
     * Country of the server, not defined on construction of the service
     * @private
     */
    private country? : Country;
    /**
     * Constructs a service Object
     * @param aName name of the service
     * @param aServiceId id of the server
     * @param aServiceTypes list of serviceTypes
     * @param pr provider of the server
     * @param aStatus url of the status
     * @param aType type of the service
     * @param aTspId tspId of the server
     * @param aTob tob of the server
     */
    constructor(aName: string, aServiceId: number, aServiceTypes: Type[], pr : Provider, aStatus : Status, aType : string, aTspId : number, aTob : string){
        this.name = aName;
        this.serviceId = aServiceId;
        this.serviceTypes = new UnorderedSet<Type>(10);
        aServiceTypes.forEach((type) => {this.serviceTypes.add(type)});
        this.provider = pr;
        this.status = aStatus;
        this.type = aType;
        this.tspId = aTspId;
        this.tob = aTob;
    }
    /**
     * 
     * @returns the name of the service followed by the status
     */
    getText(): string {
        return this.name + " {status: " + this.status.getText() + " }";
    }
    /**
     * 
     * @returns the serviceTypes of the service
     */
    getChildren(): any[] {
        return this.serviceTypes.values();
    }
    /**
     * hashcode of the service
     * @returns the hashcode of the service name
     * @see Settable
     */
    hashCode() : number{
        return stringHash(this.name);
    }
    /**
     * checks if two services are the same
     * @param el the second server
     * @returns if the two names , ids and providers are the same
     * @see Settable
     */
    isEqual(el: Service) : boolean{
        return this.name === el.name && this.serviceId === el.serviceId && this.provider.isEqual(el.provider);
    }
    /**
     * get the provider
     * @returns the provider object
     */
    getProvider() : Provider{
        return this.provider;
    }
    /**
     * get the service types
     * @returns the set of service types
     */
    getServiceTypes() : UnorderedSet<Type>{
        return this.serviceTypes;
    }
    /**
     * get the Country
     * @returns the Country Object
     */
    getCountry() : Country | null{
        return this.country ?? null;
    }
    /**
     * sets the Country of the Service to the service
     * @param aCountry the Country to set
     */
    addCountry(aCountry : Country) : void{
        this.country = aCountry;
    }
}
/**
 * Represents a provider
 */
export class Provider implements Settable<Provider>, Item{
    /**
     * name of the provider
     * @readonly
     */
    readonly name: string;

    readonly item_type = ItemType.Provider;

    /**
     * tspId of the provider
     * @readonly
     */
    readonly tspId: number;
    /**
     * the country of the provider, not  defined on construction
     * @private
     */
    private country? : Country;
    /**
     * trustMark of the provider
     * @readonly
     */
    readonly trustMark : string;
    /**
     * the map of the serviceTypes and the number of service instances providing it
     * @private
     */
    private serviceTypes: UnorderedMap<Type, number>;
    /**
     * the map of the possible status and the number of service instances having it
     * @private
     */
    private possibleStatus : UnorderedMap<Status, number>;
    /**
     * the set of services
     * @see UnorderedSet
     * @private
     */
    private services: UnorderedSet<Service>;
    /**
     * constructor
     * @param aName name of Provider
     * @param aTspId tspId of the provider
     * @param aTrustMark trustmark of the provider
     * @param aServiceTypes servicetypes given by the provider's services
     */
    constructor(aName: string, aTspId: number, aTrustMark : string, aServiceTypes : Type[]){
        this.name = aName;
        this.tspId = aTspId;
        this.trustMark = aTrustMark;
        this.serviceTypes = new UnorderedMap<Type, number>(10);
        aServiceTypes.forEach((str) => this.serviceTypes.set(str, 0));
        this.services = new UnorderedSet<Service>(10);
        this.possibleStatus = new UnorderedMap<Status, number>(10);
    }
    /**
     * 
     * @returns the name of the provider
     */
    getText(): string {
        return this.name;
    }
    /**
     * 
     * @returns the services provided
     */
    getChildren(): any[] {
        return this.services.values();
    }
    /**
     * returns the hashcode of the provider
     * @see Settable
     * @returns the hash of the provider name
     */
    hashCode() : number {
        return stringHash(this.name);
    }
    /**
     * checks if the two providers correspond
     * @see Settable
     * @param el Provider to compare
     * @returns if the two names of the providers are the same
     */
    isEqual(el: Provider) : boolean{
        return this.name === el.name && this.tspId === el.tspId;
    }
    /**
     * get service type map
     * @returns he map of service types
     */
    getServiceTypes() : UnorderedMap<Type, number>{
        return this.serviceTypes;
    }
    /**
     * get the service list
     * @returns a @see UnorderedSet of services
     */
    getServices() : UnorderedSet<Service>{
        return this.services;
    }
    /**
     * get the possible status
     * @returns the map of possible status
     */
    getPossibleStatus() : UnorderedMap<Status, number>{
        return this.possibleStatus;
    }
    /**
     * get the Country Object
     * @returns the Country object
     */
    getCountry() : Country | null{
        return this.country ?? null;
    }
    /**
     * updates the map adding the number of type instances of the provider
     * @param type type to add
     * @private
     */
    private addType(type : Type){
        let elem : number | null = this.serviceTypes.get(type);
        if(elem !== null){
            this.serviceTypes.set(type, elem + 1);
        }
        else{
            this.serviceTypes.set(type, 1);
        }    }
    /**
     * updates the number of the status instances given by the provider
     * @param status status to add
     * @private
     */
    private addStatus(status : Status){
        let elem : number | null = this.possibleStatus.get(status);
        //the status was already contained in the map
        if(elem !== null){
            this.possibleStatus.set(status, elem + 1);
        }
        //the status wasn't already defined in the map
        else{
            this.possibleStatus.set(status, 1);
        }
    }
    /**
     * adds a service updating the instances of service tyes and status
     * @param aService service to add
     */
    addService(aService : Service){
        this.services.add(aService);
        aService.getServiceTypes().forEach((str : Type) => this.addType(str));
        this.addStatus(aService.status);
    }
    /**
     * adds country to the provider udating the services Country
     * @param aCountry the country to add
     */
    addCountry(aCountry : Country){
        this.country = aCountry;
        //updates the country of the services of the provider
        this.services.forEach((service: Service) => service.addCountry(aCountry));
    }

}
/**
 * describes a Country
 */
export class Country implements Settable<Country>, Item{
    /**
     * the map of the country code to country name
     * @static
     */
    static codeToString : Map<string, string>;
    /**
     * initialises the codeToString map
     * @param arr an array with elements in the form {countryCode : "string", countryName : "string"}
     * @static
     */
    static initCodeToStringMap(arr : Array<any>){
        Country.codeToString = new Map<string, string>();
        arr.forEach((el : any) => Country.codeToString.set(el["countryCode"], el["countryName"]))
    }
    /**
     * initialises the codeToObject map
     * @param arr an array with elements in the form {countryCode : "string", countryName : "string"}
     * @static
     * @returns codeToObject, map containing entries code -> Country
     */
    static initCodeToObjectMap(arr : Array<any>){
        let codeToObject = new Map<string, Country>();
        arr.forEach((el) => codeToObject.set(el.countryCode, new Country(el.countryCode)));
        return codeToObject
    }
    /**
     * country code
     * @readonly
     */
    readonly countryCode : string;

    readonly item_type = ItemType.Country;

    /**
     * service types given by the services given by the coutnry providers,
     * with the number of instances
     * @private
     */
    private possibleServiceTypes : UnorderedMap<Type, number>;
    /**
     * status of the services given by the coutnry providers,
     * with the number of instances
     * @private
     */
    private possibleStatus : UnorderedMap<Status, number>;
    /**
     * set of providers given by the country
     * @private
     */
    private providers : UnorderedSet<Provider>;
    /**
     * constructor of Country
     * @param code country code string
     */
    constructor(code: string){
        this.countryCode = code;
        this.possibleStatus = new UnorderedMap<Status, number>(10);
        this.possibleServiceTypes = new UnorderedMap<Type, number>(10);
        this.providers = new UnorderedSet<Provider>(10);
    }
    /**
     * 
     * @returns the CountryCode
     */
    getText(): string {
        let n = Country.codeToString.get(this.countryCode);
        if(n !== undefined){
            return emojiFlag(this.countryCode) + " " + n
        }
        return this.countryCode;
    }
    /**
     * 
     * @returns the providers given by the service
     */
    getChildren(): any[] {
        return this.providers.values();
    }
    /**
     * get the hashcode for the Country
     * @returns the hashcode of the CountryCode
     * @see Settable
     */
    hashCode() : number{
        return stringHash(this.countryCode);
    }
    /**
     * check if the two object correspond
     * @param el country to compare
     * @returns if the two country codes correspond
     */
    isEqual(el: Country) : boolean {
        return this.countryCode === el.countryCode;
    }
    /**
     * get the possible service Types
     * @returns the map of the possibleTypes
     */
    getPossibleServiceTypes() : UnorderedMap<Type, number>{
        return this.possibleServiceTypes;
    }
    /**
     * get the possible status
     * @returns return the map of possible status
     */
    getPossibleStatus() : UnorderedMap<Status, number>{
        return this.possibleStatus;
    }
    /**
     * get the set of providers
     * @returns the @see UnorderedSet of providers
     */
    getProviders() : UnorderedSet<Provider>{
        return this.providers;
    }
    /**
     * updates the status map
     * @param status the status string to add
     * @param num the number of the given instances
     * @private
     */
    private addStatus(status : Status, num : number){
        let stat : number | null = this.possibleStatus.get(status);
        //the status was contained in the map
        if(stat !== null){
            this.possibleStatus.set(status, stat + num);
        }
        //the status wasn't contained in the map
        else{
            this.possibleStatus.set(status, num);
        };
    }
    /**
     * updates the services map
     * @param serviceType the status string to add
     * @param num the number of the given instances
     * @private
     */
    private addServiceType(serviceType : Type, num : number){
        let ser : number | null = this.possibleServiceTypes.get(serviceType);
        //the serviceType was contained in the map
        if(ser !== null){
            this.possibleServiceTypes.set(serviceType, ser + num);
        }
        //the serviceType wasn't contained in the map
        else{
            this.possibleServiceTypes.set(serviceType, num);
        };
    }
    /**
     * updates the Provider set adding it to the Country and updating the service and status map
     * @param provider provider to add
     */
    addProvider(provider : Provider) : void{
        //the provider was already created
        if(this.providers.has(provider)){
            return;
        }
        //update provider country(recursively the provider's services too)
        provider.addCountry(this);
        //add to the list of providers
        this.providers.add(provider);
        //add the types
        provider.getServiceTypes().forEach((num: number, type : Type) => {
            this.addServiceType(type, num);
        });
        //add the status
        provider.getPossibleStatus().forEach((num: number, status: Status) => {
            this.addStatus(status, num);
        });
    }
}
/*
let prov = new Provider("tu", 22, "fidati", ["no", "si", "forse"]);
let ser = new Service("IO", 40, ["tante", "persone", "in", "in"], prov, "gone", "ww.google.com", 69, "nonono");
console.log(ser.name);
console.log(ser.serviceId);
ser.getServiceTypes().forEach(element => {
    console.log(element);
});
prov.addService(ser);
prov.addService(new Service("VOI", 40, ["tante", "cani", "in", "in"], prov, "here", "ww.ebay.com", 70, "nono"));
console.log(prov.name);
console.log(prov.tspId);
prov.getServiceTypes().forEach((num :number, str : string) => console.log(str));
prov.getServices().forEach((sr) => {console.log(sr.name); console.log(sr.status)});
let count = new Country("IT");
count.addProvider(prov);*/

function emojiFlag(countryCode: string, fallback: string = '🏳', countryFlagData: {[key: string]: string} = {
    AD: '🇦🇩', AE: '🇦🇪', AF: '🇦🇫', AG: '🇦🇬', AI: '🇦🇮', AL: '🇦🇱', AM: '🇦🇲', AO: '🇦🇴', AQ: '🇦🇶', AR: '🇦🇷',
    AS: '🇦🇸', AT: '🇦🇹', AU: '🇦🇺', AW: '🇦🇼', AX: '🇦🇽', AZ: '🇦🇿', BA: '🇧🇦', BB: '🇧🇧', BD: '🇧🇩', BE: '🇧🇪',
    BF: '🇧🇫', BG: '🇧🇬', BH: '🇧🇭', BI: '🇧🇮', BJ: '🇧🇯', BL: '🇧🇱', BM: '🇧🇲', BN: '🇧🇳', BO: '🇧🇴', BQ: '🇧🇶',
    BR: '🇧🇷', BS: '🇧🇸', BT: '🇧🇹', BV: '🇧🇻', BW: '🇧🇼', BY: '🇧🇾', BZ: '🇧🇿', CA: '🇨🇦', CC: '🇨🇨', CD: '🇨🇩',
    CF: '🇨🇫', CG: '🇨🇬', CH: '🇨🇭', CI: '🇨🇮', CK: '🇨🇰', CL: '🇨🇱', CM: '🇨🇲', CN: '🇨🇳', CO: '🇨🇴', CR: '🇨🇷',
    CU: '🇨🇺', CV: '🇨🇻', CW: '🇨🇼', CX: '🇨🇽', CY: '🇨🇾', CZ: '🇨🇿', DE: '🇩🇪', DJ: '🇩🇯', DK: '🇩🇰', DM: '🇩🇲',
    DO: '🇩🇴', DZ: '🇩🇿', EC: '🇪🇨', EE: '🇪🇪', EG: '🇪🇬', EH: '🇪🇭', ER: '🇪🇷', ES: '🇪🇸', ET: '🇪🇹', FI: '🇫🇮',
    FJ: '🇫🇯', FK: '🇫🇰', FM: '🇫🇲', FO: '🇫🇴', FR: '🇫🇷', GA: '🇬🇦', UK: '🇬🇧', GD: '🇬🇩', GE: '🇬🇪', GF: '🇬🇫',
    GG: '🇬🇬', GH: '🇬🇭', GI: '🇬🇮', GL: '🇬🇱', GM: '🇬🇲', GN: '🇬🇳', GP: '🇬🇵', GQ: '🇬🇶', EL: '🇬🇷', GS: '🇬🇸',
    GT: '🇬🇹', GU: '🇬🇺', GW: '🇬🇼', GY: '🇬🇾', HK: '🇭🇰', HM: '🇭🇲', HN: '🇭🇳', HR: '🇭🇷', HT: '🇭🇹', HU: '🇭🇺',
    ID: '🇮🇩', IE: '🇮🇪', IL: '🇮🇱', IM: '🇮🇲', IN: '🇮🇳', IO: '🇮🇴', IQ: '🇮🇶', IR: '🇮🇷', IS: '🇮🇸', IT: '🇮🇹',
    JE: '🇯🇪', JM: '🇯🇲', JO: '🇯🇴', JP: '🇯🇵', KE: '🇰🇪', KG: '🇰🇬', KH: '🇰🇭', KI: '🇰🇮', KM: '🇰🇲', KN: '🇰🇳',
    KP: '🇰🇵', KR: '🇰🇷', KW: '🇰🇼', KY: '🇰🇾', KZ: '🇰🇿', LA: '🇱🇦', LB: '🇱🇧', LC: '🇱🇨', LI: '🇱🇮', LK: '🇱🇰',
    LR: '🇱🇷', LS: '🇱🇸', LT: '🇱🇹', LU: '🇱🇺', LV: '🇱🇻', LY: '🇱🇾', MA: '🇲🇦', MC: '🇲🇨', MD: '🇲🇩', ME: '🇲🇪',
    MF: '🇲🇫', MG: '🇲🇬', MH: '🇲🇭', MK: '🇲🇰', ML: '🇲🇱', MM: '🇲🇲', MN: '🇲🇳', MO: '🇲🇴', MP: '🇲🇵', MQ: '🇲🇶',
    MR: '🇲🇷', MS: '🇲🇸', MT: '🇲🇹', MU: '🇲🇺', MV: '🇲🇻', MW: '🇲🇼', MX: '🇲🇽', MY: '🇲🇾', MZ: '🇲🇿', NA: '🇳🇦',
    NC: '🇳🇨', NE: '🇳🇪', NF: '🇳🇫', NG: '🇳🇬', NI: '🇳🇮', NL: '🇳🇱', NO: '🇳🇴', NP: '🇳🇵', NR: '🇳🇷', NU: '🇳🇺',
    NZ: '🇳🇿', OM: '🇴🇲', PA: '🇵🇦', PE: '🇵🇪', PF: '🇵🇫', PG: '🇵🇬', PH: '🇵🇭', PK: '🇵🇰', PL: '🇵🇱', PM: '🇵🇲',
    PN: '🇵🇳', PR: '🇵🇷', PS: '🇵🇸', PT: '🇵🇹', PW: '🇵🇼', PY: '🇵🇾', QA: '🇶🇦', RE: '🇷🇪', RO: '🇷🇴', RS: '🇷🇸',
    RU: '🇷🇺', RW: '🇷🇼', SA: '🇸🇦', SB: '🇸🇧', SC: '🇸🇨', SD: '🇸🇩', SE: '🇸🇪', SG: '🇸🇬', SH: '🇸🇭', SI: '🇸🇮',
    SJ: '🇸🇯', SK: '🇸🇰', SL: '🇸🇱', SM: '🇸🇲', SN: '🇸🇳', SO: '🇸🇴', SR: '🇸🇷', SS: '🇸🇸', ST: '🇸🇹', SV: '🇸🇻',
    SX: '🇸🇽', SY: '🇸🇾', SZ: '🇸🇿', TC: '🇹🇨', TD: '🇹🇩', TF: '🇹🇫', TG: '🇹🇬', TH: '🇹🇭', TJ: '🇹🇯', TK: '🇹🇰',
    TL: '🇹🇱', TM: '🇹🇲', TN: '🇹🇳', TO: '🇹🇴', TR: '🇹🇷', TT: '🇹🇹', TV: '🇹🇻', TW: '🇹🇼', TZ: '🇹🇿', UA: '🇺🇦',
    UG: '🇺🇬', UM: '🇺🇲', US: '🇺🇸', UY: '🇺🇾', UZ: '🇺🇿', VA: '🇻🇦', VC: '🇻🇨', VE: '🇻🇪', VG: '🇻🇬', VI: '🇻🇮',
    VN: '🇻🇳', VU: '🇻🇺', WF: '🇼🇫', WS: '🇼🇸', XK: '🇽🇰', YE: '🇾🇪', YT: '🇾🇹', ZA: '🇿🇦', ZM: '🇿🇲'
}){
    const arr = countryCode.split('-');
    return countryFlagData[(arr[1] || arr[0]).toUpperCase()] || fallback;
}
