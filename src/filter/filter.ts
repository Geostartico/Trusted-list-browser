import {Country, Provider, Service, Status, Type} from "../decoder/items.js"
import {objectify} from "../decoder/decoder.js"
import {UnorderedSet} from "../decoder/UnorderedSet.js"

 /**
  * Class that groups a selection of objects
  */
export class Selection{
    readonly countries: UnorderedSet<Country>;
    readonly providers: UnorderedSet<Provider>;
    readonly statuses:  UnorderedSet<Status>;
    readonly types:     UnorderedSet<Type>;

    constructor(
                countries: Country[]  = new Array<Country>(),
                providers: Provider[] = new Array<Provider>(),
                statuses:  Status[]   = new Array<Status>(),
                types:     Type[]     = new Array<Type>()
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
  * Flitering rule class
  */
export class Rule {
    public readonly filtering_item: Type | Status | Provider | Country;

    /**
     * @param filtering_item: Country, Provider, Type or Status object
     */
    constructor(filtering_item: Type | Status | Provider | Country){
        this.filtering_item = filtering_item;
    }
}

 /**
  * Filtering class, (it dynamically updates selectable and active objects)
  */
export class Filter{

    // TODO: this should just be rule.filtering_item.getServices()
    private getFiterdServices(rule: Rule): Map<Service, number>{

        let ret = new Map<Service, number>();

        if(rule.filtering_item instanceof Country){
            rule.filtering_item.getProviders().forEach((provider: Provider) => {
                provider.getServices().forEach((service: Service) => {
                    if(service.getCountry() === rule.filtering_item){
                        ret.set(service, 1);
                    }
                });
            });
            return ret;
        }

        if(rule.filtering_item instanceof Type){
            this.all_services.forEach((service: Service) => {
                service.getServiceTypes().forEach((type: Type) => {
                if(service.status === rule.filtering_item){
                    ret.set(service, 1);
                }
                });
            });
        }
        else if(rule.filtering_item instanceof Status){
            this.all_services.forEach((service: Service) => {
                if(service.status === rule.filtering_item){
                    ret.set(service, 1);
                }
            }

        }

        return ret;
    }

    private rules:       Set<Rule>;
    private filtered:    Set<Service>;

    private readonly all_services: UnorderedSet<Service>;

    constructor(service_list: Service[]){

        this.rules        = new Set<Rule>();
        this.filtered     = new Set<Service>();
        this.all_services = new UnorderedSet<Service>(service_list.length);

        // Initialize variables (no filtering yet)
        service_list.forEach((service: Service) => {
            this.filtered.add(service);
            this.all_services.add(service);

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
                if(!rule.rule_function(service)){
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

//console.log(retDict);

let myFilter = new Filter(retDict.servicesArray);

console.log(myFilter.getFiltered());
