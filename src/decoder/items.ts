import{Settable, UnorderedSet} from "./UnorderedSet.js"

function stringHash(str : string) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export class Service implements Settable<Service>{
    readonly name : string;
    readonly serviceId : number;
    private serviceTypes : Set<string>;
    private provider : Provider;
    readonly status : string;
    readonly type : string;
    readonly tspId : number;
    readonly tob : string;
    private country : Country;
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
    hashCode() {
        return stringHash(this.name);
    }
    isEqual(el: Service) {
        return this.name == el.name;
    }
    getProvider(){
        return this.provider;
    }
    getServiceTypes(){
        return this.serviceTypes;
    }
    getCountry(){
        return this.country;
    }
    addCountry(aCountry : Country){
        this.country = aCountry;
    }
}

export class Provider implements Settable<Provider>{
    readonly name: string;
    readonly tspId: number;
    private country : Country;
    readonly trustMark : string;
    private serviceTypes: Map<string, number>;
    private possibleStatus : Map<string, number>;
    private services: UnorderedSet<Service>;

    constructor(aName: string, aTspId: number, aTrustMark : string, aServiceTypes : string[]){
        this.name = aName;
        this.tspId = aTspId;
        this.trustMark = aTrustMark;
        this.serviceTypes = new Map<string, number>();
        aServiceTypes.forEach((str) => this.serviceTypes.set(str, 0));
        this.services = new UnorderedSet<Service>(10);
        this.possibleStatus = new Map<string, number>();
    }
    hashCode() {
        return stringHash(this.name);
    }
    isEqual(el: Provider) {
        return this.name == el.name;
    }
    getServiceTypes(){
        return this.serviceTypes;
    }

    getServices(){
        return this.services;
    }

    getPossibleStatus(){
        return this.possibleStatus;
    }
    
    getCountry(){
        return this.country;
    }
    
    private addType(type : string){
        if(this.serviceTypes.has(type)){
            this.serviceTypes.set(type, this.serviceTypes.get(type) + 1);
        }
        else{
            this.serviceTypes.set(type, 1);
        }    }

    private addStatus(status : string){
        if(this.possibleStatus.has(status)){
            this.possibleStatus.set(status, this.possibleStatus.get(status) + 1);
        }
        else{
            this.possibleStatus.set(status, 1);
        }
    }

    addService(aService : Service){
        this.services.add(aService);
        aService.getServiceTypes().forEach((str) => this.addType(str));
        this.addStatus(aService.status);
    }
    addCountry(aCountry : Country){
        this.country = aCountry;
        this.services.forEach((elem) => elem.addCountry(this.country));
    }

}
export class Country implements Settable<Country>{
    static codeToString : Map<string, string>;
    static codeToObject : Map<string, Country>;
    static getCountry(code : string){
        return this.codeToObject.get(code);
    }
    static initCodeToStringMap(arr){
        this.codeToString = new Map<string, string>();
        arr.forEach((el) => Country.codeToString.set(el.countryCode, el.countryName))
    }
    static initCodeToObjectMap(arr){
        this.codeToObject = new Map<string, Country>();
        arr.forEach((el) => Country.codeToObject.set(el.countryCode, new Country(el.countryCode)))
    }
    readonly countryCode : string;
    private possibleServiceTypes : Map<string, number>;
    private possibleStatus : Map<string, number>;
    private providers : UnorderedSet<Provider>;

    constructor(code: string){
        this.countryCode = code;
        this.possibleStatus = new Map<string, number>();
        this.possibleServiceTypes = new Map<string, number>();
        this.providers = new UnorderedSet<Provider>(10);
    }

    hashCode() {
        return stringHash(this.countryCode);
    }

    isEqual(el: Country) {
        return this.countryCode == el.countryCode;
    }

    getPossibleServiceTypes(){   
        return this.possibleServiceTypes;
    }

    getPossibleStatus(){
        return this.possibleStatus;
    }

    getProviders(){
        return this.providers;
    }

    private addStatus(status : string, num : number){
        if(this.possibleStatus.has(status)){
            this.possibleStatus.set(status, this.possibleStatus.get(status) + num);
        }
        else{
            this.possibleStatus.set(status, num);
        };
    }

    private addServiceType(serviceType : string, num : number){
        if(this.possibleServiceTypes.has(serviceType)){
            this.possibleServiceTypes.set(serviceType, this.possibleServiceTypes.get(serviceType) + num);
        }
        else{
            this.possibleServiceTypes.set(serviceType, num);
        };
    }

    addProvider(provider : Provider){
        provider.addCountry(this);
        this.providers.add(provider);
        provider.getServiceTypes().forEach((num: number, str : string) => {
            this.addServiceType(str, num);
        });
        provider.getPossibleStatus().forEach((num: number, str : string) => {
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
prov.getServiceTypes().forEach((num :number, str : string) => console.log(str));
prov.getServices().forEach((sr) => {console.log(sr.name); console.log(sr.status)});
let count = new Country("IT");
count.addProvider(prov);