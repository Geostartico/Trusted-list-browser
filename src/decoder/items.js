import { UnorderedSet } from "./UnorderedSet.js";
import { UnorderedMap } from "./UnorderedMap.js";
/**
 * calculates the hash of a function
 * @param str a string
 * @returns the hash(with ciclyc shift) of str
 */
function stringHash(str) {
    var hash = 0, i, chr;
    if (str.length === 0)
        return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
/**
 * Represents a service type
 */
export class Type {
    constructor(name) {
        this.name = name;
        this.services = new UnorderedSet(10);
    }
    /**
     * hashcode of the type
     * @returns the hashcode of the type name
     * @see Settable
     */
    hashCode() {
        return stringHash(this.name);
    }
    /**
     * checks if two types are the same
     * @param el the second type
     * @returns if the two names are the same
     * @see Settable
     */
    isEqual(el) {
        return this.name == el.name;
    }
}
/**
 * Represents a service status
 */
export class Status {
    constructor(name) {
        this.name = name;
        this.services = new UnorderedSet(10);
    }
    /**
     * hashcode of the status
     * @returns the hashcode of the status name
     * @see Settable
     */
    hashCode() {
        return stringHash(this.name);
    }
    /**
     * checks if two statuses are the same
     * @param el the second status
     * @returns if the two names are the same
     * @see Settable
     */
    isEqual(el) {
        return this.name == el.name;
    }
}
/**
 * Represents a service
 */
export class Service {
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
    constructor(aName, aServiceId, aServiceTypes, pr, aStatus, aType, aTspId, aTob) {
        this.name = aName;
        this.serviceId = aServiceId;
        this.serviceTypes = new UnorderedSet(10);
        aServiceTypes.forEach((type) => { this.serviceTypes.add(type); });
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
    isEqual(el) {
        return this.name == el.name;
    }
    /**
     * get the provider
     * @returns the provider object
     */
    getProvider() {
        return this.provider;
    }
    /**
     * get the item list
     * @returns the set of items
     */
    getServiceTypes() {
        return this.serviceTypes;
    }
    /**
     * get the Country
     * @returns the Country Object
     */
    getCountry() {
        return this.country;
    }
    /**
     * sets the Country of the Service to the service
     * @param aCountry the Country to set
     */
    addCountry(aCountry) {
        this.country = aCountry;
    }
}
/**
 * Represents a provider
 */
export class Provider {
    /**
     * constructor
     * @param aName name of Provider
     * @param aTspId tspId of the provider
     * @param aTrustMark trustmark of the provider
     * @param aServiceTypes servicetypes given by the provider's services
     */
    constructor(aName, aTspId, aTrustMark, aServiceTypes) {
        this.name = aName;
        this.tspId = aTspId;
        this.trustMark = aTrustMark;
        this.serviceTypes = new UnorderedMap(10);
        aServiceTypes.forEach((str) => this.serviceTypes.set(str, 0));
        this.services = new UnorderedSet(10);
        this.possibleStatus = new UnorderedMap(10);
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
    isEqual(el) {
        return this.name == el.name;
    }
    /**
     * get service type map
     * @returns he map of service types
     */
    getServiceTypes() {
        return this.serviceTypes;
    }
    /**
     * get the service list
     * @returns a @see UnorderedSet of services
     */
    getServices() {
        return this.services;
    }
    /**
     * get the possible status
     * @returns the map of possible status
     */
    getPossibleStatus() {
        return this.possibleStatus;
    }
    /**
     * get the Country Object
     * @returns the Country object
     */
    getCountry() {
        return this.country;
    }
    /**
     * updates the map adding the number of type instances of the provider
     * @param type type to add
     * @private
     */
    addType(type) {
        if (this.serviceTypes.has(type)) {
            this.serviceTypes.set(type, this.serviceTypes.get(type) + 1);
        }
        else {
            this.serviceTypes.set(type, 1);
        }
    }
    /**
     * updates the number of the status instances given by the provider
     * @param status status to add
     * @private
     */
    addStatus(status) {
        if (this.possibleStatus.has(status)) {
            this.possibleStatus.set(status, this.possibleStatus.get(status) + 1);
        }
        else {
            this.possibleStatus.set(status, 1);
        }
    }
    /**
     * adds a service updating the instances of service tyes and status
     * @param aService service to add
     */
    addService(aService) {
        this.services.add(aService);
        aService.getServiceTypes().forEach((str) => this.addType(str));
        this.addStatus(aService.status);
    }
    /**
     * adds country to the provider udating the services Country
     * @param aCountry the country to add
     */
    addCountry(aCountry) {
        this.country = aCountry;
        this.services.forEach((service) => service.addCountry(this.country));
    }
}
/**
 * describes a Country
 */
export class Country {
    /**
     * constructor of Country
     * @param code country code string
     */
    constructor(code) {
        this.countryCode = code;
        this.possibleStatus = new UnorderedMap(10);
        this.possibleServiceTypes = new UnorderedMap(10);
        this.providers = new UnorderedSet(10);
    }
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
    static initCodeToStringMap(arr) {
        this.codeToString = new Map();
        arr.forEach((el) => Country.codeToString.set(el.countryCode, el.countryName));
    }
    /**
     * initialises the codeToObject map
     * @param arr an array with elements in the form {countryCode : "string", countryName : "string"}
     * @static
     */
    static initCodeToObjectMap(arr) {
        let codeToObject = new Map();
        arr.forEach((el) => codeToObject.set(el.countryCode, new Country(el.countryCode)));
        return codeToObject;
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
    isEqual(el) {
        return this.countryCode == el.countryCode;
    }
    /**
     * get the possible service Types
     * @returns the map of the possibleTypes
     */
    getPossibleServiceTypes() {
        return this.possibleServiceTypes;
    }
    /**
     * get the possible status
     * @returns return the map of possible status
     */
    getPossibleStatus() {
        return this.possibleStatus;
    }
    /**
     * get the set of providers
     * @returns the @see UnorderedSet of providers
     */
    getProviders() {
        return this.providers;
    }
    /**
     * updates the status map
     * @param status the status string to add
     * @param num the number of the given instances
     * @private
     */
    addStatus(status, num) {
        if (this.possibleStatus.has(status)) {
            this.possibleStatus.set(status, this.possibleStatus.get(status) + num);
        }
        else {
            this.possibleStatus.set(status, num);
        }
        ;
    }
    /**
     * updates the services map
     * @param serviceType the status string to add
     * @param num the number of the given instances
     * @private
     */
    addServiceType(serviceType, num) {
        if (this.possibleServiceTypes.has(serviceType)) {
            this.possibleServiceTypes.set(serviceType, this.possibleServiceTypes.get(serviceType) + num);
        }
        else {
            this.possibleServiceTypes.set(serviceType, num);
        }
        ;
    }
    /**
     * updates the Provider set adding it to the Country and updating the service and status map
     * @param provider provider to add
     */
    addProvider(provider) {
        if (this.providers.has(provider)) {
            return;
        }
        provider.addCountry(this);
        this.providers.add(provider);
        provider.getServiceTypes().forEach((num, type) => {
            this.addServiceType(type, num);
        });
        provider.getPossibleStatus().forEach((num, status) => {
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
