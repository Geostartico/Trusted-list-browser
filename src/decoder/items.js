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
    getName() {
        return this.name;
    }
    getServiceId() {
        return this.serviceId;
    }
    getServiceTypes() {
        return this.serviceTypes;
    }
    getStatus() {
        return this.status;
    }
    getType() {
        return this.type;
    }
    getTspId() {
        return this.tspId;
    }
    getTob() {
        return this.tob;
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
        this.serviceTypes = new Set();
        aServiceTypes.forEach((str) => this.serviceTypes.add(str));
        this.services = new Array();
        this.possibleStatus = new Set();
    }
    getName() {
        return this.name;
    }
    getTspId() {
        return this.tspId;
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
    getTrustMark() {
        return this.trustMark;
    }
    getCountry() {
        return this.country;
    }
    addType(type) {
        this.serviceTypes.add(type);
    }
    addStatus(status) {
        this.possibleStatus.add(status);
    }
    addService(aService) {
        this.services.push(aService);
        aService.getServiceTypes().forEach((str) => this.addType(str));
        this.addStatus(aService.getStatus());
    }
    addCountry(aCountry) {
        this.country = aCountry;
        this.services.forEach((elem) => elem.addCountry(this.country));
    }
}
export class Country {
    constructor(code) {
        this.countryCode = code;
        this.possibleStatus = new Set();
        this.possibleServiceTypes = new Set();
        this.providers = new Array();
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
    getCountryCode() {
        return this.countryCode;
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
    addStatus(status) {
        this.possibleStatus.add(status);
    }
    addServiceType(serviceType) {
        this.possibleServiceTypes.add(serviceType);
    }
    addProvider(provider) {
        provider.addCountry(this);
        this.providers.push(provider);
        provider.getServiceTypes().forEach(element => {
            this.addServiceType(element);
        });
        provider.getPossibleStatus().forEach(element => {
            this.addStatus(element);
        });
    }
}
/*
let prov = new Provider("tu", 22, "fidati", ["no", "si", "forse"]);
let ser = new Service("IO", 40, ["tante", "persone", "in", "in"], prov, "gone", "ww.google.com", 69, "nonono");
console.log(ser.getName());
console.log(ser.getServiceId());
ser.getServiceTypes().forEach(element => {
    console.log(element);
});
prov.addService(ser);
prov.addService(new Service("VOI", 40, ["tante", "cani", "in", "in"], prov, "here", "ww.ebay.com", 70, "nono"));
console.log(prov.getName());
console.log(prov.getTspId());
prov.getServiceTypes().forEach((str) => console.log(str));
prov.getServices().forEach((sr) => {console.log(sr.getName()); console.log(sr.getStatus())});
let count = new Country("IT");
count.addProvider(prov);*/ 
