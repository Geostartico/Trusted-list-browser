import{Country, Provider, Service, Type, Status} from "./items"
import { UnorderedSet } from "./UnorderedSet";
/**
 * transforms from json dictionary to object
 * @param ctodict array with elements in the form {countryCode : "string", countryName : "string"}
 * @param jsondict array of providers in json format
 * @returns object in the form {"codeToObject": dictionary, "servicesArray": array}, with dictionary having the codes
 * @throws if the objects passed are either null or undefined
 * as keys and as value the country objects, and array contrining services
 */
export function objectify(ctodict : any, jsondict : any) : {"codeToObject": Map<string, Country>, "servicesArray": Array<Service>, "typeSet" : UnorderedSet<Type>, "statusSet" : UnorderedSet<Status>}{
  if(ctodict === undefined ||  ctodict === null || jsondict === null || jsondict === undefined){
    throw new Error("undefined or null input");
  }
  //initialises all the objects corresponding to the codes in the cto
  let codeToObject : Map<string, Country>  = Country.initCodeToObjectMap(ctodict);
  Country.initCodeToStringMap(ctodict);
  let servicesArray : Array<Service> = new Array<Service>();

  let stringToStatus : Map<string, Status> = new Map<string, Status>();
  let statusSet : UnorderedSet<Status> = new UnorderedSet<Status>(10);

  let stringToType : Map<string, Type> = new Map<string, Type>();
  let typeSet  : UnorderedSet<Type> = new UnorderedSet<Type>(10);

  //iterates over every provider description in jsondict
  jsondict.forEach((provider : any) => {
    //the country corresponding to the code in the provider description
    let curCountry : Country | undefined = codeToObject.get(provider["countryCode"]);
    let typearr = new Array<Type>();

    //creates the types of services if not already defined and inserts them in the array of types of the provider
    provider["qServiceTypes"].forEach((typestr : string) =>{
      let curt : Type | undefined = stringToType.get(typestr);
      if(curt === undefined){
        let t = new Type(typestr);
        stringToType.set(typestr, t);
        typeSet.add(t);
        typearr.push(t);
      }
      else{
        typearr.push(curt);
      }
    });

    //constructs the provider
    let curProv = new Provider(provider["name"], provider["tspId"], provider["trustmark"], typearr);
    //iterates over the services of the provider
    provider["services"].forEach((service_dict : any) => {
        let serviceTypeArr  : Array<Type> = new Array<Type>();
        //adds the serviceTypes for every 
        service_dict["qServiceTypes"].forEach((typestr : string) =>{
          let curt : Type | undefined= stringToType.get(typestr);
          if(curt === undefined){
            throw new Error("the provider didn't specify all the serviceTypes")
            /*let t : Type = new Type(typestr);
            stringToType.set(typestr, t);
            typeSet.add(t);
            serviceTypeArr.push(t);*/
          }
          else{
            serviceTypeArr.push(curt);
          }
        });
        //initialises the status or gets the existing one
        let statusStr : string = service_dict["currentStatus"];
        let stat : Status;
        let curs : Status | undefined = stringToStatus.get(statusStr);
        //the status wasn't initialised
        if(curs === undefined){
          stat = new Status(statusStr);
          stringToStatus.set(statusStr, stat);
          statusSet.add(stat);
        }
        //the status was initialised
        else{
          stat = curs;
        }
        //create service
        let ser = new Service(service_dict["serviceName"], service_dict["serviceId"], serviceTypeArr, curProv, stat, service_dict["type"], service_dict["tspId"], service_dict["tob"]);
        //add the service to the status
        stat.addService(ser);
        //add the service to the serviceTypes it contains
        serviceTypeArr.forEach((elem : Type) => elem.addService(ser));
        //adds the service to the provider
        curProv.addService(ser);
        //adds the services to the array of all the services
        servicesArray.push(ser);
    })
    
    if(curCountry !== undefined){
      curCountry.addProvider(curProv);
    }
    //the country code doesn't exist: error
    else{
      throw new Error("country not found");
    }
    //make providers and services immutable
    curProv.makeImmutable()
    curProv.getServices().forEach((elem : Service) => elem.makeImmutable());
    });
  //make
  codeToObject.forEach((val : Country, key : string) => {val.makeImmutable()});
  typeSet.forEach((elem: Type) => elem.makeImmutable());
  statusSet.forEach((elem : Status) => elem.makeImmutable());
  return {"codeToObject": codeToObject, "servicesArray": servicesArray, "typeSet" : typeSet, "statusSet" : statusSet};
}