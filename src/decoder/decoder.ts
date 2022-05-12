class Service{
    private name : string;
    private serviceId : number;
    private serviceTypes : Set<string>;
    private provider : Provider;
    private status : string;
    private type : string;
    private tspId : number;
    private tob : string;
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

    getName(){
        return this.name;
    }

    getServiceId(){
        return this.serviceId;
    }

    getServiceTypes(){
        return this.serviceTypes;
    }

    getStatus(){
        return this.status;
    }
    getType(){
        return this.type;
    }
    getTspId(){
        return this.tspId;
    }
    getTob(){
        return this.tob;
    }

}

class Provider{
    private name: string;
    private tspId: number;
    private trustMark : string;
    private serviceTypes: Set<string>;
    private possibleStatus : Set<string>;
    private services: Service[];

    constructor(aName: string, aTspId: number, aTrustMark : string, aServiceTypes : string[]){
        this.name = aName;
        this.tspId = aTspId;
        this.trustMark = aTrustMark;
        this.serviceTypes = new Set<string>();
        aServiceTypes.forEach((str) => this.serviceTypes.add(str));
        this.services = new Array<Service>();
        this.possibleStatus = new Set<string>();
    }

    getName(){
        return this.name;
    }

    getTspId(){
        return this.tspId;
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

    getTrustMark(){
        return this.trustMark;
    }
    private addType(type : string){
        this.serviceTypes.add(type);
    }

    private addStatus(status : string){
        this.possibleStatus.add(status);
    }

    addService(aService : Service){
        this.services.push(aService);
        aService.getServiceTypes().forEach((str) => this.addType(str));
        this.addStatus(aService.getStatus());
    }

}
class Country{
    static codeToString : Map<string, string>;
    static codeToObject : Map<string, Country>;
    static getCountry(code : string){
        return this.codeToObject[code];
    }
    static initCodeToStringMap(arr){
        this.codeToString = new Map<string, string>();
        arr.forEach((el) => Country.codeToString.set(el.countryCode, el.countryName))
    }
    static initCodeToObjectMap(arr){
        this.codeToString = new Map<string, string>();
        arr.forEach((el) => Country.codeToObject.set(el.countryCode, new Country(el.countryCode)))
    }
    private countryCode : string;
    private possibleServiceTypes : Set<string>;
    private possibleStatus : Set<string>;
    private providers : Provider[];

    constructor(code: string){
        this.countryCode = code;
        this.possibleStatus = new Set<string>();
        this.possibleServiceTypes = new Set<string>();
        this.providers = new Array<Provider>();
    }
    getCountryCode(){
        return this.countryCode;
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
    private addStatus(status : string){
        this.possibleStatus.add(status);
    }

    private addServiceType(serviceType : string){
        this.possibleServiceTypes.add(serviceType);
    }
    addProvider(provider : Provider){
        this.providers.push(provider);
        provider.getServiceTypes().forEach(element => {
            this.addServiceType(element);
        });
        provider.getPossibleStatus().forEach(element => {
            this.addStatus(element);
        });
    }
}

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
count.addProvider(prov);