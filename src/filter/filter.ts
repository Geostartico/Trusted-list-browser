import {Country, Provider, Service} from "../decoder/items.js"
import {objectify} from "../decoder/decoder.js"

 /**
  * Class that groups a selection of objects and keeps track of how many times
  * one object has been selected
  */
//export class Selection{
//    readonly countries: Map<Country,number>;
//    readonly providers: Map<Provider,number>;
//    readonly statuses:  Map<string,number>;
//    readonly types:     Map<string,number>;
//
//    /** Note: pass the value "undefined" to every field that you want to omit */
//    constructor(
//                countries: Country[]  = new Array<Country>(),
//                providers: Provider[] = new Array<Provider>(),
//                statuses:  string[]   = new Array<string>(),
//                types:     string[]   = new Array<string>()
//               )
//    {
//       countries.forEach((country)  => { mapInsert(country, this.countries)  });
//       providers.forEach((provider) => { mapInsert(provider, this.providers) });
//       statuses.forEach((status)    => { mapInsert(status, this.statuses)    });
//       types.forEach((type)         => { mapInsert(type, this.types)         });
//    }
//
//    /** @return copy of this Selection (no deep copy, but maps are reconstructed) */
//    copy(){
//        return new Selection(
//            Array.from(this.countries.keys()),
//            Array.from(this.providers.keys()),
//            Array.from(this.statuses.keys()),
//            Array.from(this.types.keys())
//        );
//    }
//}

 /**
  * Class that groups a selection of objects
  */
export class Selection{
    readonly countries: Set<Country>;
    readonly providers: Set<Provider>;
    readonly statuses:  Set<string>;
    readonly types:     Set<string>;

    constructor(
                countries: Country[]  = new Array<Country>(),
                providers: Provider[] = new Array<Provider>(),
                statuses:  string[]   = new Array<string>(),
                types:     string[]   = new Array<string>()
               )
    {
       countries.forEach((country)  => { this.countries.add(country)  });
       providers.forEach((provider) => { this.providers.add(provider) });
       statuses.forEach((status)    => { this.statuses.add(status)    });
       types.forEach((type)         => { this.types.add(type)         });
    }

    /** @return copy of this Selection (no deep copy, but maps are reconstructed) */
    copy(){
        return new Selection(
            Array.from(this.countries.values()),
            Array.from(this.providers.values()),
            Array.from(this.statuses.values()),
            Array.from(this.types.values())
        );
    }
}


 /**
  * Flitering rule class to force function parameter and return types
  */
export class Rule {
    public readonly rule_function: (service: Service) => boolean;

    constructor(aRuleFunction: (service: Service) => boolean){
        this.rule_function = aRuleFunction;
    }
}

 /**
  * Filtering class, (it dynamically updates selectable and active objects)
  */
export class Filter{

    //private readonly all_possible: {
    //    readonly services:  Set<Service>;
    //    readonly countries: Set<Country>;
    //    readonly providers: Set<Provider>;
    //    readonly types:     Set<string>;
    //    readonly statuses:  Set<string>;
    //}

    private rules:       Set<Rule>;
    private selectables: Selection;
    private filtered:    Set<Service>;

    private readonly all_services: Set<Service>;


    constructor(all_services: Service[]){

        this.selectables = new Selection();

        // Initialize variables (no filtering yet)
        all_services.forEach((service: Service) => {

            // Initialize "all_possible"
            //this.all_possible.services.add(service);
            //this.all_possible.countries.add(service.getCountry());
            //this.all_possible.providers.add(service.getProvider());
            //this.all_possible.statuses.add(service.status);
            //service.getServiceTypes().forEach((type) => {
            //    this.all_possible.types.add(type);
            //});

            this.filtered.add(service);

            this.all_services.add(service);

            // Initialize "filtered" and "selectables" (both with all possible values)
            //mapInsert(service.getCountry(), this.selectables.countries);
            //mapInsert(service.getProvider(), this.selectables.providers);
            //mapInsert(service.status, this.selectables.statuses);

            //service.getServiceTypes().forEach((type) => {
            //    mapInsert(type, this.selectables.types);
            //});
        });
    }

    /**
     * Add a rule to the filter
     * @param rule: @see{Rule} object
     */
    addRule(rule: Rule){
        this.rules.add(rule);
    }

    removeRule(rule: Rule){
        this.rules.delete(rule);
    }


    /**
     * @returns @see{Selection} object containing all selectable items
     */
    getSelectables(): Selection{

        let selectables = new Selection();

        for(let service of this.getFiltered()){
            selectables.countries.add(service.getCountry());
            selectables.types.add(service.type);
            selectables.statuses.add(service.status);
            selectables.providers.add(service.getProvider());
        }

        return selectables;
    }

    /**
     * @returns set of filtered services based on the rules
     */
    getFiltered(): Set<Service>{

        let filtered = new Set<Service>();

        for(let service of this.all_services){
            this.rules.forEach((rule) => {
                if(rule.rule_function(service)){
                    filtered.add(service);
                }
            });
        }

        return filtered;
    }
}


 /**
  * Helper function to insert value in map
  * @param value: value toinsert
  * @param map:   map containing the value to be inserted
  */
function mapInsert<T>(value: T, map: Map<T, number>){
    if(map.has(value)){
        map.set(value, map.get(value)+1);
    }
    else{
        map.set(value, 1);
    }
}

 /**
  * Helper function to remove value from map
  * @param value: value to remove
  * @param map:   map containing the value to be removed
  *
  * @throws @link{Error}
  * Thrown if the value is not inserted in the map
  */
function mapRemove<T>(value: T, map: Map<T, number>){
    if(!map.has(value)){
        throw new Error("Trying to remove an item that does not exist");
    }
    if(map.get(value) > 1){
        map.set(value, map.get(value)-1);
    }
    else{
        map.delete(value);
    }
}


let countryDict = [
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

console.log(retDict);
