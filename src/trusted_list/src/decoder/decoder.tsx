import{Country, Provider, Service, Type, Status} from "./items"
import { UnorderedMap } from "./UnorderedMap";
import { UnorderedSet } from "./UnorderedSet";
/**
 * transforms from json dictionary to object
 * @param ctodict array with elements in the form {countryCode : "string", countryName : "string"}
 * @param jsondict array of providers in json format
 * @returns object in the form {"codeToObject": dictionary, "servicesArray": array}, with dictionary having the codes
 * as keys and as value the country objects, and array contrining services
 */
export function objectify(ctodict : any, jsondict : any) : {"codeToObject": Map<string, Country>, "servicesArray": Array<Service>, "typeSet" : UnorderedSet<Type>, "statusSet" : UnorderedSet<Status>}{
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
        stat.services.add(ser);
        //add the service to the serviceTypes it contains
        serviceTypeArr.forEach((elem : Type) => elem.services.add(ser));
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
    });
  
  return {"codeToObject": codeToObject, "servicesArray": servicesArray, "typeSet" : typeSet, "statusSet" : statusSet};
}
/*
let dict = [
    {
      "countryCode": "IT",
      "name": "tortellini",
      "qServiceTypes": [
              "tante", "cose"
        ],
      "trustmark": "fidati",
      "tspId": 0,
      "services": [
          {
              "countryCode": "IT",
              "currentStatus": "cista",
              "qServiceTypes": [
                  "tante"
              ],
              "serviceId": 0,
              "serviceName": "lro",
              "tob": "pob",
              "tspId": 173,
              "type": "qualcuno.com"
          },
          {
            "countryCode": "IT",
            "currentStatus": "noncista",
            "qServiceTypes": [
                "cose"
            ],
            "serviceId": 1,
            "serviceName": "lor",
            "tob": "cob",
            "tspId": 174,
            "type": "questo.com"
        }
      ],
    },

    {
        "countryCode": "DE",
        "name": "crauti",
        "qServiceTypes": [
                "poche", "robe"
            ],
        "trustmark": "nonfidarti",
        "tspId": 1,
        "services": [
            {
                "countryCode": "DE",
                "currentStatus": "cista",
                "qServiceTypes": [
                    "poche"
                ],
                "serviceId": 0,
                "serviceName": "no",
                "tob": "jo",
                "tspId": 176,
                "type": "nesuno.de"
            }
        ],
      }
  ]
let map = [{countryName: "Italia", countryCode: "IT"}, 
           {countryName: "Germania", countryCode: "DE" }]
let d = objectify(map, dict);
console.log(d["servicesArray"]);*/
/*let countryDict = [
    {
      "countryCode": "AT",
      "countryName": "Austria"
    },
    {
      "countryCode": "BE",
      "countryName": "Belgium"
    },
    {
      "countryCode": "BG",
      "countryName": "Bulgaria"
    },
    {
      "countryCode": "CY",
      "countryName": "Cyprus"
    },
    {
      "countryCode": "CZ",
      "countryName": "Czech Republic"
    },
    {
      "countryCode": "DE",
      "countryName": "Germany"
    },
    {
      "countryCode": "DK",
      "countryName": "Denmark"
    },
    {
      "countryCode": "EE",
      "countryName": "Estonia"
    },
    {
      "countryCode": "EL",
      "countryName": "Greece"
    },
    {
      "countryCode": "ES",
      "countryName": "Spain"
    },
    {
      "countryCode": "EU",
      "countryName": "European Union"
    },
    {
      "countryCode": "FI",
      "countryName": "Finland"
    },
    {
      "countryCode": "FR",
      "countryName": "France"
    },
    {
      "countryCode": "HR",
      "countryName": "Croatia"
    },
    {
      "countryCode": "HU",
      "countryName": "Hungary"
    },
    {
      "countryCode": "IE",
      "countryName": "Ireland"
    },
    {
      "countryCode": "IS",
      "countryName": "Iceland"
    },
    {
      "countryCode": "IT",
      "countryName": "Italy"
    },
    {
      "countryCode": "LI",
      "countryName": "Liechtenstein"
    },
    {
      "countryCode": "LT",
      "countryName": "Lithuania"
    },
    {
      "countryCode": "LU",
      "countryName": "Luxembourg"
    },
    {
      "countryCode": "LV",
      "countryName": "Latvia"
    },
    {
      "countryCode": "MT",
      "countryName": "Malta"
    },
    {
      "countryCode": "NL",
      "countryName": "Netherlands"
    },
    {
      "countryCode": "NO",
      "countryName": "Norway"
    },
    {
      "countryCode": "PL",
      "countryName": "Poland"
    },
    {
      "countryCode": "PT",
      "countryName": "Portugal"
    },
    {
      "countryCode": "RO",
      "countryName": "Romania"
    },
    {
      "countryCode": "SE",
      "countryName": "Sweden"
    },
    {
      "countryCode": "SI",
      "countryName": "Slovenia"
    },
    {
      "countryCode": "SK",
      "countryName": "Slovakia"
    },
    {
      "countryCode": "UK",
      "countryName": "United Kingdom"
    }
  ];
  
  let serviceDict = [
    {
      "tspId": 1,
      "name": "A-Trust Gesellschaft für Sicherheitssysteme im elektronischen Datenverkehr GmbH",
      "countryCode": "AT",
      "trustmark": "VATAT-U50272100",
      "qServiceTypes": [
        "QCertESeal",
        "CertESeal",
        "QCertESig",
        "WAC",
        "QWAC",
        "CertESig"
      ],
      "services": [
        {
          "tspId": 1,
          "serviceId": 1,
          "countryCode": "AT",
          "serviceName": "TrustSign-Sig-01 (key no. 1)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/withdrawn",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 2,
          "countryCode": "AT",
          "serviceName": "TrustSign-Sig-01 (key no. 2)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/withdrawn",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 3,
          "countryCode": "AT",
          "serviceName": "TrustSign-Sig-01 (key no. 3)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/withdrawn",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 4,
          "countryCode": "AT",
          "serviceName": "a-sign uni",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/withdrawn",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 5,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-01 (key no. 1)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 6,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-01 (key no. 2)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 7,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-01 (key no. 3)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 8,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-02 (key no. 1)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 9,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-02 (key no. 2)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 10,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-03 (key no. 1)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 11,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-03 (key no. 2)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 12,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-05",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 13,
          "countryCode": "AT",
          "serviceName": "a-sign-premium-mobile-03",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 14,
          "countryCode": "AT",
          "serviceName": "a-sign-premium-mobile-05",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 15,
          "countryCode": "AT",
          "serviceName": "OCSP Responder 03-1",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/Certstatus/OCSP/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 16,
          "countryCode": "AT",
          "serviceName": "EU-Identity-mobile-05",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 17,
          "countryCode": "AT",
          "serviceName": "a-sign-premium-mobile-seal-07",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESeal"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 18,
          "countryCode": "AT",
          "serviceName": "a-sign-SSL-EV-07",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QWAC"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 19,
          "countryCode": "AT",
          "serviceName": "a-sign-SSL-03",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/PKC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/recognisedatnationallevel",
          "tob": null,
          "qServiceTypes": [
            "WAC"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 20,
          "countryCode": "AT",
          "serviceName": "a-sign-SSL-05",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/PKC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/recognisedatnationallevel",
          "tob": null,
          "qServiceTypes": [
            "WAC"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 21,
          "countryCode": "AT",
          "serviceName": "a-sign-SSL-07",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/PKC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/recognisedatnationallevel",
          "tob": null,
          "qServiceTypes": [
            "WAC"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 22,
          "countryCode": "AT",
          "serviceName": "a-sign-SSL-EV-05",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/PKC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/recognisedatnationallevel",
          "tob": null,
          "qServiceTypes": [
            "WAC"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 23,
          "countryCode": "AT",
          "serviceName": "a-sign-SSL-EV-07a",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QWAC"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 24,
          "countryCode": "AT",
          "serviceName": "a-sign-corporate-light-02",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/PKC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/recognisedatnationallevel",
          "tob": null,
          "qServiceTypes": [
            "CertESeal",
            "CertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 25,
          "countryCode": "AT",
          "serviceName": "a-sign-corporate-light-03",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/PKC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/recognisedatnationallevel",
          "tob": null,
          "qServiceTypes": [
            "CertESeal",
            "CertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 26,
          "countryCode": "AT",
          "serviceName": "a-sign-corporate-05",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/PKC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/recognisedatnationallevel",
          "tob": null,
          "qServiceTypes": [
            "CertESeal",
            "CertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 27,
          "countryCode": "AT",
          "serviceName": "a-sign-corporate-07",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/PKC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/recognisedatnationallevel",
          "tob": null,
          "qServiceTypes": [
            "CertESeal",
            "CertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 28,
          "countryCode": "AT",
          "serviceName": "a-sign-premium-mobile-07",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 29,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-07",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        }
      ]
    }
  ];
  
  let retDict = objectify(countryDict, serviceDict);
  
  console.log(retDict["codeToObject"]);
  console.log(retDict["servicesArray"]);
  console.log(retDict["statusSet"].values());
  console.log(retDict["typeSet"].values());*/
