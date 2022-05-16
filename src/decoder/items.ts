import{Settable, UnorderedSet} from "./UnorderedSet.js"
/**
 * calculates the hash of a function
 * @param str a string
 * @returns the hash(with ciclyc shift) of str
 */
function stringHash(str : string): number {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
/**
 * Represents a service
 *
 */
export class Service implements Settable<Service>{
    /**
     * name of the Service
     * @readonly
     */
    readonly name : string;
    /**
     * Id of the service
     * @readonly
     */
    readonly serviceId : number;
    /**
     * set of the service types given by the service
     * @private
     */
    private serviceTypes : Set<string>;
    /**
     * provider of the service
     * @private
     */
    private provider : Provider;
    /**
     * url of the status
     * @readonly
     */
    readonly status : string;
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
    readonly tob : string;
    /**
     * Country of the server
     * @private
     */
    private country : Country;
    /**
     * Constructs a service Object
     * @param aName name of the service
     * @param aServiceId id of the server
     * @param aServiceTypes list of serviceTypes
     * @param pr provider of the server
     * @param aStatus url of the status
     * @param aType type of the server
     * @param aTspId tspId of the server
     * @param aTob tob of the server
     */
    constructor(aName: string, aServiceId: number, aServiceTypes: string[], pr : Provider, aStatus : string, aType : string, aTspId : number, aTob : string){
        this.name = aName;
        this.serviceId = aServiceId;
        this.serviceTypes = new Set<string>();
        aServiceTypes.forEach((str) => {this.serviceTypes.add(str)});
        this.provider = pr;
        this.status = aStatus;
        this.type = aType;
        this.tspId = aTspId;
        this.tob = aTob;
    }
    /**
     * hashcode of the service
     * @returns the hashcode of the service name
     * @see Settable
     */
    hashCode() {
        return stringHash(this.name);
    }
    /**
     * checks if two services are the same
     * @param el the second server
     * @returns if the two names are the same
     * @see Settable
     */
    isEqual(el: Service) {
        return this.name == el.name;
    }
    /**
     * get the provider
     * @returns the provider object
     */
    getProvider(){
        return this.provider;
    }
    /**
     * get the item list
     * @returns the set of items
     */
    getServiceTypes(){
        return this.serviceTypes;
    }
    /**
     * get the Country
     * @returns the Country Object
     */
    getCountry(){
        return this.country;
    }
    /**
     * sets the Country of the Service to the service
     * @param aCountry the Country to set
     */
    addCountry(aCountry : Country){
        this.country = aCountry;
    }
}
/**
 * Represents a provider
 */
export class Provider implements Settable<Provider>{
    /**
     * name of the provider
     * @readonly
     */
    readonly name: string;
    /**
     * tspId of the provider
     * @readonly
     */
    readonly tspId: number;
    /**
     * the country of the provider
     * @private
     */
    private country : Country;
    /**
     * trustMark of the provider
     * @readonly
     */
    readonly trustMark : string;
    /**
     * the map of the serviceTypes and the number of service instances having it
     * @private
     */
    private serviceTypes: Map<string, number>;
    /**
     * the map of the possible status and the number of service instances having it
     * @private
     */
    private possibleStatus : Map<string, number>;
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
    constructor(aName: string, aTspId: number, aTrustMark : string, aServiceTypes : string[]){
        this.name = aName;
        this.tspId = aTspId;
        this.trustMark = aTrustMark;
        this.serviceTypes = new Map<string, number>();
        aServiceTypes.forEach((str) => this.serviceTypes.set(str, 0));
        this.services = new UnorderedSet<Service>(10);
        this.possibleStatus = new Map<string, number>();
    }
    /**
     * returns the hashcode of the provider
     * @see Settable
     * @returns the hash of the provider name
     */
    hashCode() {
        return stringHash(this.name);
    }
    /**
     * checks if the two providers correspond
     * @see Settable
     * @param el Provider to compare
     * @returns if the two names of the providers are the same
     */
    isEqual(el: Provider) {
        return this.name == el.name;
    }
    /**
     * get service type map
     * @returns he map of service types
     */
    getServiceTypes(){
        return this.serviceTypes;
    }
    /**
     * get the service list
     * @returns a @see UnorderedSet of services
     */
    getServices(){
        return this.services;
    }
    /**
     * get the possible status
     * @returns the map of possible status
     */
    getPossibleStatus(){
        return this.possibleStatus;
    }
    /**
     * get the Country Object
     * @returns the Country object
     */
    getCountry(){
        return this.country;
    }
    /**
     * updates the map adding the number of type instances of the provider
     * @param type type to add
     * @private
     */
    private addType(type : string){
        if(this.serviceTypes.has(type)){
            this.serviceTypes.set(type, this.serviceTypes.get(type) + 1);
        }
        else{
            this.serviceTypes.set(type, 1);
        }    }
    /**
     * updates the number of the status instances given by the provider
     * @param status status to add
     * @private
     */
    private addStatus(status : string){
        if(this.possibleStatus.has(status)){
            this.possibleStatus.set(status, this.possibleStatus.get(status) + 1);
        }
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
        aService.getServiceTypes().forEach((str) => this.addType(str));
        this.addStatus(aService.status);
    }
    /**
     * adds country to the provider udating the services Country
     * @param aCountry the country to add
     */
    addCountry(aCountry : Country){
        this.country = aCountry;
        this.services.forEach((elem) => elem.addCountry(this.country));
    }

}
/**
 * describes a Country
 */
export class Country implements Settable<Country>{
    /**
     * the map of the country code to country name
     * @static
     */
    static codeToString : Map<string, string>;
    /**
     * map from country code to counry object
     * @static
     */
    //static codeToObject : Map<string, Country>;
    /**
     * initialises the codeToString map
     * @param arr an array with elements in the form {countryCode : "string", countryName : "string"}
     * @static
     */
    static initCodeToStringMap(arr){
        this.codeToString = new Map<string, string>();
        arr.forEach((el) => Country.codeToString.set(el.countryCode, el.countryName))
    }
    /**
     * initialises the codeToObject map
     * @param arr an array with elements in the form {countryCode : "string", countryName : "string"}
     * @static
     */
    static initCodeToObjectMap(arr){
        let codeToObject = new Map<string, Country>();
        arr.forEach((el) => codeToObject.set(el.countryCode, new Country(el.countryCode)));
        return codeToObject
    }
    /**
     * coutnry code
     * @readonly
     */
    readonly countryCode : string;
    /**
     * service types given by the services given by the coutnry providers,
     * with the number of instances
     * @private
     */
    private possibleServiceTypes : Map<string, number>;
    /**
     * status of the services given by the coutnry providers,
     * with the number of instances
     * @private
     */
    private possibleStatus : Map<string, number>;
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
        this.possibleStatus = new Map<string, number>();
        this.possibleServiceTypes = new Map<string, number>();
        this.providers = new UnorderedSet<Provider>(10);
    }
    /**
     * get the hashcode for the Country
     * @returns the hashcode of the CountryCode
     * @see Settable
     */
    hashCode() {
        return stringHash(this.countryCode);
    }
    /**
     * check if the two object correspond
     * @param el country to compare
     * @returns if the two country codes correspond
     */
    isEqual(el: Country) {
        return this.countryCode == el.countryCode;
    }
    /**
     * get the possible service Types
     * @returns the map of the possibleTypes
     */
    getPossibleServiceTypes(){   
        return this.possibleServiceTypes;
    }
    /**
     * get the possible status
     * @returns return the map of possible status
     */
    getPossibleStatus(){
        return this.possibleStatus;
    }
    /**
     * get the set of providers
     * @returns the @see UnorderedSet of providers
     */
    getProviders(){
        return this.providers;
    }
    /**
     * updates the status map
     * @param status the status string to add
     * @param num the number of the given instances
     * @private
     */
    private addStatus(status : string, num : number){
        if(this.possibleStatus.has(status)){
            this.possibleStatus.set(status, this.possibleStatus.get(status) + num);
        }
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
    private addServiceType(serviceType : string, num : number){
        if(this.possibleServiceTypes.has(serviceType)){
            this.possibleServiceTypes.set(serviceType, this.possibleServiceTypes.get(serviceType) + num);
        }
        else{
            this.possibleServiceTypes.set(serviceType, num);
        };
    }
    /**
     * updates the Provider set adding it to the Country and updating the service and status map
     * @param provider provider to add
     */
    addProvider(provider : Provider){
        provider.addCountry(this);
        if(this.providers.has(provider)){
            return;
        }
        this.providers.add(provider);
        provider.getServiceTypes().forEach((num: number, str : string) => {
            this.addServiceType(str, num);
        });
        provider.getPossibleStatus().forEach((num: number, str : string) => {
            this.addStatus(str, num);
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
