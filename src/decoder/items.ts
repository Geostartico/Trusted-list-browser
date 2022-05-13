export class Service{
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

export class Provider{
    private name: string;
    private tspId: number;
    private country : Country;
    private trustMark : string;
    private serviceTypes: Map<string, number>;
    private possibleStatus : Map<string, number>;
    private services: Service[];

    constructor(aName: string, aTspId: number, aTrustMark : string, aServiceTypes : string[]){
        this.name = aName;
        this.tspId = aTspId;
        this.trustMark = aTrustMark;
        this.serviceTypes = new Map<string, number>();
        aServiceTypes.forEach((str) => this.serviceTypes.set(str, 0));
        this.services = new Array<Service>();
        this.possibleStatus = new Map<string, number>();
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
    
    getCountry(){
        return this.country;
    }
    
    private addType(type : string){
        this.serviceTypes.set(type, this.serviceTypes.get(type));
    }

    private addStatus(status : string){
        if(this.possibleStatus.has(status)){
            this.possibleStatus.set(status, this.possibleStatus.get(status));
        }
        else{
            this.possibleStatus.set(status, 1);
        }
    }

    addService(aService : Service){
        this.services.push(aService);
        aService.getServiceTypes().forEach((str) => this.addType(str));
        this.addStatus(aService.status);
    }
    addCountry(aCountry : Country){
        this.country = aCountry;
        this.services.forEach((elem) => elem.addCountry(this.country));
    }

}
export class Country{
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
    private providers : Provider[];

    constructor(code: string){
        this.countryCode = code;
        this.possibleStatus = new Map<string, number>();
        this.possibleServiceTypes = new Map<string, number>();
        this.providers = new Array<Provider>();
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
        if(this.possibleStatus.has(status)){
            this.possibleStatus.set(status, this.possibleStatus.get(status));
        }
        else{
            this.possibleStatus.set(status, 1);
        };
    }

    private addServiceType(serviceType : string){
        if(this.possibleStatus.has(serviceType)){
            this.possibleStatus.set(serviceType, this.possibleStatus.get(serviceType));
        }
        else{
            this.possibleStatus.set(serviceType, 1);
        };
    }
    addProvider(provider : Provider){
        provider.addCountry(this);
        this.providers.push(provider);
        provider.getServiceTypes().forEach((num: number, str : string) => {
            this.addServiceType(str);
        });
        provider.getPossibleStatus().forEach((num: number, str : string) => {
            this.addStatus(str);
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