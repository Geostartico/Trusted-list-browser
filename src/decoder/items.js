import { UnorderedSet } from "./UnorderedSet.js";
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
export class Service {
    constructor(aName, aServiceId, aServiceTypes, pr, aStatus, aType, aTspId, aTob) {
        this.name = aName;
        this.serviceId = aServiceId;
        this.serviceTypes = new Set();
        aServiceTypes.forEach((str) => { this.serviceTypes.add(str); });
        this.provider = pr;
        this.status = aStatus;
        this.type = aType;
        this.tspId = aTspId;
        this.tob = aTob;
    }
    hashCode() {
        return stringHash(this.name);
    }
    isEqual(el) {
        return this.name == el.name;
    }
    getProvider() {
        return this.provider;
    }
    getServiceTypes() {
        return this.serviceTypes;
    }
    getCountry() {
        return this.country;
    }
    addCountry(aCountry) {
        this.country = aCountry;
    }
}
export class Provider {
    constructor(aName, aTspId, aTrustMark, aServiceTypes) {
        this.name = aName;
        this.tspId = aTspId;
        this.trustMark = aTrustMark;
        this.serviceTypes = new Map();
        aServiceTypes.forEach((str) => this.serviceTypes.set(str, 0));
        this.services = new UnorderedSet(10);
        this.possibleStatus = new Map();
    }
    hashCode() {
        return stringHash(this.name);
    }
    isEqual(el) {
        return this.name == el.name;
    }
    getServiceTypes() {
        return this.serviceTypes;
    }
    getServices() {
        return this.services;
    }
    getPossibleStatus() {
        return this.possibleStatus;
    }
    getCountry() {
        return this.country;
    }
    addType(type) {
        if (this.serviceTypes.has(type)) {
            this.serviceTypes.set(type, this.serviceTypes.get(type) + 1);
        }
        else {
            this.serviceTypes.set(type, 1);
        }
    }
    addStatus(status) {
        if (this.possibleStatus.has(status)) {
            this.possibleStatus.set(status, this.possibleStatus.get(status) + 1);
        }
        else {
            this.possibleStatus.set(status, 1);
        }
    }
    addService(aService) {
        this.services.add(aService);
        aService.getServiceTypes().forEach((str) => this.addType(str));
        this.addStatus(aService.status);
    }
    addCountry(aCountry) {
        this.country = aCountry;
        this.services.forEach((elem) => elem.addCountry(this.country));
    }
}
export class Country {
    constructor(code) {
        this.countryCode = code;
        this.possibleStatus = new Map();
        this.possibleServiceTypes = new Map();
        this.providers = new UnorderedSet(10);
    }
    static getCountry(code) {
        return this.codeToObject.get(code);
    }
    static initCodeToStringMap(arr) {
        this.codeToString = new Map();
        arr.forEach((el) => Country.codeToString.set(el.countryCode, el.countryName));
    }
    static initCodeToObjectMap(arr) {
        this.codeToObject = new Map();
        arr.forEach((el) => Country.codeToObject.set(el.countryCode, new Country(el.countryCode)));
    }
    hashCode() {
        return stringHash(this.countryCode);
    }
    isEqual(el) {
        return this.countryCode == el.countryCode;
    }
    getPossibleServiceTypes() {
        return this.possibleServiceTypes;
    }
    getPossibleStatus() {
        return this.possibleStatus;
    }
    getProviders() {
        return this.providers;
    }
    addStatus(status, num) {
        if (this.possibleStatus.has(status)) {
            this.possibleStatus.set(status, this.possibleStatus.get(status) + num);
        }
        else {
            this.possibleStatus.set(status, num);
        }
        ;
    }
    addServiceType(serviceType, num) {
        if (this.possibleServiceTypes.has(serviceType)) {
            this.possibleServiceTypes.set(serviceType, this.possibleServiceTypes.get(serviceType) + num);
        }
        else {
            this.possibleServiceTypes.set(serviceType, num);
        }
        ;
    }
    addProvider(provider) {
        provider.addCountry(this);
        this.providers.add(provider);
        provider.getServiceTypes().forEach((num, str) => {
            this.addServiceType(str, num);
        });
        provider.getPossibleStatus().forEach((num, str) => {
            this.addStatus(str, num);
        });
    }
}
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
prov.getServiceTypes().forEach((num, str) => console.log(str));
prov.getServices().forEach((sr) => { console.log(sr.name); console.log(sr.status); });
let count = new Country("IT");
count.addProvider(prov);
