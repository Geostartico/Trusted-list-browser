const DEBUG: boolean = true;

import {Country, Provider, Service, Status, Type} from "../decoder/items.js"
import {objectify} from "../decoder/decoder.js"
import {UnorderedSet} from "../decoder/UnorderedSet.js"
import {UnorderedMap} from "../decoder/UnorderedMap.js"
import {Settable} from "../decoder/settable.js"

 /**
  * Class that groups a selection of objects
  */
export class Selection{
    countries: UnorderedSet<Country>;
    providers: UnorderedSet<Provider>;
    statuses:  UnorderedSet<Status>;
    types:     UnorderedSet<Type>;
    services:  UnorderedSet<Service>;

    constructor(
                countries: Country[]  = new Array<Country>(),
                providers: Provider[] = new Array<Provider>(),
                statuses:  Status[]   = new Array<Status>(),
                types:     Type[]     = new Array<Type>(),
                services:  Service[]  = new Array<Service>()
               )
    {
        this.countries = new UnorderedSet<Country>(10);
        this.providers = new UnorderedSet<Provider>(10);
        this.statuses  = new UnorderedSet<Status>(10);
        this.services  = new UnorderedSet<Service>(10);
        this.types     = new UnorderedSet<Type>(10);

        countries.forEach((country)  => { this.countries.add(country)  });
        providers.forEach((provider) => { this.providers.add(provider) });
        statuses.forEach((status)    => { this.statuses.add(status)    });
        services.forEach((service)   => { this.services.add(service)   });
        types.forEach((type)         => { this.types.add(type)         });
    }

    /** @return copy of this Selection (no deep copy, but maps are reconstructed) */
    copy(){
        return new Selection(
            Array.from(this.countries.values()),
            Array.from(this.providers.values()),
            Array.from(this.statuses.values()),
            Array.from(this.types.values()),
            Array.from(this.services.values())
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
    private getServicesFromRule(rule: Rule): UnorderedMap<Service, number>{

        let ret = new UnorderedMap<Service, number>(10);

        if(rule.filtering_item instanceof Country){
            rule.filtering_item.getProviders().forEach((provider: Provider) => {
                provider.getServices().forEach((service: Service) => {
                    ret.set(service, 1);
                });
            });
            return ret;
        }
        if(rule.filtering_item instanceof Provider){
            rule.filtering_item.getServices().forEach((service: Service) => {
                ret.set(service, 1);
            });
        }

        if(rule.filtering_item instanceof Type){
            this.all_services.forEach((service: Service) => {
                service.getServiceTypes().forEach((type: Type) => {
                if(type === rule.filtering_item){
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
            });
        }

        return ret;
    }

    private rules: Set<Rule>;

    private selected: Selection;

    private countries_service_sum: UnorderedMap<Service, number>;
    private providers_service_sum: UnorderedMap<Service, number>;
    private types_service_sum:     UnorderedMap<Service, number>;
    private statuses_service_sum:  UnorderedMap<Service, number>;

    private readonly all_services:     UnorderedSet<Service>;
    private readonly all_services_map: UnorderedMap<Service, number>;

    constructor(service_list: Service[]){

        this.rules = new Set<Rule>();

        this.selected = new Selection();

        this.all_services     = new UnorderedSet<Service>(service_list.length);
        this.all_services_map = new UnorderedMap<Service, number>(10);

        this.countries_service_sum = new UnorderedMap<Service, number>(10);
        this.providers_service_sum = new UnorderedMap<Service, number>(10);
        this.types_service_sum     = new UnorderedMap<Service, number>(10);
        this.statuses_service_sum  = new UnorderedMap<Service, number>(10);

        service_list.forEach((service: Service) => {
            this.all_services.add(service);
            this.all_services_map.set(service, 1);
        });
    }

    /**
     * Add a rule to the filter
     * @param rule: @see{Rule} object
     */
    addRule(rule: Rule){
        this.rules.add(rule);

        if(rule.filtering_item instanceof Country){
            this.selected.countries.add(rule.filtering_item);
            for(let service of this.getServicesFromRule(rule).keys())
                mapIncreaseOrInsert(service, this.countries_service_sum);
        }

        if(rule.filtering_item instanceof Type){
            this.selected.types.add(rule.filtering_item);
            for(let service of this.getServicesFromRule(rule).keys())
                mapIncreaseOrInsert(service, this.types_service_sum);
        }

        if(rule.filtering_item instanceof Provider){
            this.selected.providers.add(rule.filtering_item);
            for(let service of this.getServicesFromRule(rule).keys())
                mapIncreaseOrInsert(service, this.providers_service_sum); //Note: this could be just a plain map remove
        }

        if(rule.filtering_item instanceof Status){
            this.selected.statuses.add(rule.filtering_item);
            for(let service of this.getServicesFromRule(rule).keys())
                mapIncreaseOrInsert(service, this.statuses_service_sum);
        }
    }

    removeRule(rule: Rule){
        this.rules.delete(rule);

        if(rule.filtering_item instanceof Country){
            this.selected.countries.remove(rule.filtering_item);
            for(let service of this.getServicesFromRule(rule).keys())
                mapDecreaseOrRemove(service, this.countries_service_sum);
        }

        if(rule.filtering_item instanceof Type){
            this.selected.types.remove(rule.filtering_item);
            for(let service of this.getServicesFromRule(rule).keys())
                mapDecreaseOrRemove(service, this.types_service_sum);
        }

        if(rule.filtering_item instanceof Provider){
            this.selected.providers.remove(rule.filtering_item);
            for(let service of this.getServicesFromRule(rule).keys())
                mapDecreaseOrRemove(service, this.providers_service_sum); //Note: this could be just a plain map set

        }

        if(rule.filtering_item instanceof Status){
            this.selected.statuses.remove(rule.filtering_item);
            for(let service of this.getServicesFromRule(rule).keys())
                mapDecreaseOrRemove(service, this.statuses_service_sum);
        }
    }

    /**
     * @returns set of filtered services based on the rules
     */
    getFiltered(): Selection{

        // If I have no selections in a field, it's the same as all selected
        if(this.selected.statuses.getSize() == 0)
            this.statuses_service_sum = this.all_services_map;

        if(this.selected.types.getSize() == 0)
            this.types_service_sum = this.all_services_map;

        if(this.selected.countries.getSize() == 0)
            this.countries_service_sum = this.all_services_map;

        if(this.selected.countries.getSize() == 0)
            this.providers_service_sum = this.all_services_map;


        let ret = new Selection();

        //let filtered: UnorderedSet<Service> = mapUnion(this.providers_service_sum, mapIntersect(this.countries_service_sum, this.types_service_sum, this.statuses_service_sum));
        let filtered: UnorderedSet<Service> = mapToUnorderedSet(
                                                mapIntersect(this.countries_service_sum,
                                                             this.types_service_sum,
                                                             this.statuses_service_sum,
                                                             this.providers_service_sum));

        filtered.forEach((service: Service) => {
            ret.countries.add(service.getCountry());
            ret.statuses.add (service.status);
            ret.providers.add(service.getProvider());
            ret.services.add (service);
            service.getServiceTypes().forEach((type: Type) => {
                ret.types.add(type);
            });
        });

        // Resetting to safe state
        if(this.selected.statuses.getSize() == 0)
            this.statuses_service_sum = new UnorderedMap<Service, number>(10);

        if(this.selected.types.getSize() == 0)
            this.types_service_sum = new UnorderedMap<Service, number>(10);

        if(this.selected.countries.getSize() == 0)
            this.countries_service_sum = new UnorderedMap<Service, number>(10);

        if(this.selected.countries.getSize() == 0)
            this.providers_service_sum = new UnorderedMap<Service, number>(10);

        return ret;
    }

}

function mapToUnorderedSet(map: UnorderedMap<Service, number>): UnorderedSet<Service>{
    let ret = new UnorderedSet<Service>(10);

    for(let service of map.keys())
        ret.add(service);

    return ret;
}

function unorderedSetToMap(set: UnorderedSet<Service>): UnorderedMap<Service, number>{
    let ret = new UnorderedMap<Service, number>(10);

    set.forEach((service: Service) => {
        ret.set(service, 1);
    });

    return ret;
}

function mapIntersect(...maps: Array<UnorderedMap<Service, number>>): UnorderedMap<Service, number>{

    let ret = new UnorderedMap<Service, number>(10);

    if(maps.length < 1)
        return ret;
    if(maps.length == 1){
        for(let service of maps[0].keys())
            ret.set(service, 1);
        return ret;
    }


    let all_maps_have: boolean;
    for(let service of maps[0].keys()){
        all_maps_have = true;
        for(let map of maps.slice(1)){
            if(!map.has(service)){
                all_maps_have = false;
                break;
            }
        }
        if(all_maps_have)
            ret.set(service, 1);
    }

    return ret;
}

function mapUnion(...maps: Array<UnorderedMap<Service, number>>): UnorderedSet<Service>{

    let ret = new UnorderedSet<Service>(10);

    for(let map of maps){
        for(let service of map.keys()){
            ret.add(service);
        }
    }

    return ret;
}

function mapSum(...maps: Array<UnorderedMap<Service, number>>): UnorderedMap<Service, number>{

    let ret = new UnorderedMap<Service, number>(10);

    for(let map of maps){
        for(let service of map.keys()){
            mapIncreaseOrInsert(service, ret);
        }
    }

    return ret;
}

 /**
  * Helper function, self explainatory
  * @param value: value to update
  * @param map:   map containing the value to be inserted
  */
function mapIncreaseOrInsert<T extends Settable<T>>(value: T, map: UnorderedMap<T, number>){
    if(map.has(value)){
        map.set(value, map.get(value)+1);
    }
    else{
        map.set(value, 1);
    }
}

 /**
  * Helper function, self explainatory
  * @param value: value to remove
  * @param map:   map containing the value to be removed
  *
  * @throws @link{Error}
  * Thrown if the value is not inserted in the map
  */
function mapDecreaseOrRemove<T extends Settable<T>>(value: T, map: UnorderedMap<T, number>){
    if(!map.has(value)){
        throw new Error("Trying to remove an item that does not exist");
    }
    if(map.get(value) > 1){
        map.set(value, map.get(value)-1);
    }
    else{
        map.remove(value);
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

myFilter.addRule(new Rule(retDict.servicesArray[1].status));

if(DEBUG == true)
    //console.log(myFilter.getFiltered());
    console.log(myFilter.getFiltered().countries.values());
    console.log(myFilter.getFiltered().types.values());
    console.log(myFilter.getFiltered().statuses.values());
    console.log(myFilter.getFiltered().providers.values());
    console.log(myFilter.getFiltered().services.values());
