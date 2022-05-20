const DEBUG = true;
import { Country, Provider, Status, Type } from "../decoder/items.js";
import { objectify } from "../decoder/decoder.js";
import { UnorderedSet } from "../decoder/UnorderedSet.js";
import { UnorderedMap } from "../decoder/UnorderedMap.js";
/**
 * Class that groups a selection of objects
 */
export class Selection {
    constructor(countries = new Array(), providers = new Array(), statuses = new Array(), types = new Array(), services = new Array()) {
        this.countries = new UnorderedSet(10);
        this.providers = new UnorderedSet(10);
        this.statuses = new UnorderedSet(10);
        this.services = new UnorderedSet(10);
        this.types = new UnorderedSet(10);
        countries.forEach((country) => { this.countries.add(country); });
        providers.forEach((provider) => { this.providers.add(provider); });
        statuses.forEach((status) => { this.statuses.add(status); });
        services.forEach((service) => { this.services.add(service); });
        types.forEach((type) => { this.types.add(type); });
    }
    /** @return copy of this Selection (no deep copy, but maps are reconstructed) */
    copy() {
        return new Selection(Array.from(this.countries.values()), Array.from(this.providers.values()), Array.from(this.statuses.values()), Array.from(this.types.values()), Array.from(this.services.values()));
    }
}
/**
 * Flitering rule class
 */
export class Rule {
    /**
     * @param filtering_item: Country, Provider, Type or Status object
     */
    constructor(filtering_item) {
        this.filtering_item = filtering_item;
    }
}
/**
 * Filtering class, (it dynamically updates selectable and active objects)
 */
export class Filter {
    constructor(service_list) {
        //this.rules = new Set<Rule>();
        this.selected = new Selection();
        this.all_services = new UnorderedMap(service_list.length);
        this.countries_service_sum = new UnorderedMap(10);
        this.providers_service_sum = new UnorderedMap(10);
        this.types_service_sum = new UnorderedMap(10);
        this.statuses_service_sum = new UnorderedMap(10);
        service_list.forEach((service) => {
            this.all_services.set(service, 1);
        });
    }
    getServicesFromRule(rule) {
        let ret = new UnorderedMap(10);
        if (rule.filtering_item instanceof Country) {
            rule.filtering_item.getProviders().forEach((provider) => {
                provider.getServices().forEach((service) => {
                    ret.set(service, 1);
                });
            });
        }
        else if (rule.filtering_item instanceof Provider) {
            rule.filtering_item.getServices().forEach((service) => {
                ret.set(service, 1);
            });
        }
        else if (rule.filtering_item instanceof Type) {
            rule.filtering_item.services.forEach((service) => {
                ret.set(service, 1);
            });
        }
        else if (rule.filtering_item instanceof Status) {
            rule.filtering_item.services.forEach((service) => {
                ret.set(service, 1);
            });
        }
        return ret;
    }
    /**
     * Add a rule to the filter
     * @param rule: @see{Rule} object
     */
    addRule(rule) {
        //this.rules.add(rule);
        if (rule.filtering_item instanceof Country) {
            this.selected.countries.add(rule.filtering_item);
            for (let service of this.getServicesFromRule(rule).keys())
                mapIncreaseOrInsert(service, this.countries_service_sum);
        }
        if (rule.filtering_item instanceof Type) {
            this.selected.types.add(rule.filtering_item);
            for (let service of this.getServicesFromRule(rule).keys())
                mapIncreaseOrInsert(service, this.types_service_sum);
        }
        if (rule.filtering_item instanceof Provider) {
            this.selected.providers.add(rule.filtering_item);
            for (let service of this.getServicesFromRule(rule).keys())
                mapIncreaseOrInsert(service, this.providers_service_sum); //Note: this could be just a plain map remove
        }
        if (rule.filtering_item instanceof Status) {
            this.selected.statuses.add(rule.filtering_item);
            for (let service of this.getServicesFromRule(rule).keys())
                mapIncreaseOrInsert(service, this.statuses_service_sum);
        }
    }
    removeRule(rule) {
        //this.rules.delete(rule);
        if (rule.filtering_item instanceof Country) {
            this.selected.countries.remove(rule.filtering_item);
            for (let service of this.getServicesFromRule(rule).keys())
                mapDecreaseOrRemove(service, this.countries_service_sum);
        }
        if (rule.filtering_item instanceof Type) {
            this.selected.types.remove(rule.filtering_item);
            for (let service of this.getServicesFromRule(rule).keys())
                mapDecreaseOrRemove(service, this.types_service_sum);
        }
        if (rule.filtering_item instanceof Provider) {
            this.selected.providers.remove(rule.filtering_item);
            for (let service of this.getServicesFromRule(rule).keys())
                mapDecreaseOrRemove(service, this.providers_service_sum); //Note: this could be just a plain map set
        }
        if (rule.filtering_item instanceof Status) {
            this.selected.statuses.remove(rule.filtering_item);
            for (let service of this.getServicesFromRule(rule).keys())
                mapDecreaseOrRemove(service, this.statuses_service_sum);
        }
    }
    getSelected() {
        return this.selected;
    }
    /**
     * @returns set of filtered services based on the rules
     */
    getFiltered() {
        // If I have no selections in a field, it's the same as all selected
        this.convertEmptyToFull();
        let ret = new Selection();
        //console.log(this.countries_service_sum.entries());
        //let filtered: UnorderedSet<Service> = mapUnion(this.providers_service_sum, mapIntersect(this.countries_service_sum, this.types_service_sum, this.statuses_service_sum));
        let filtered = mapToUnorderedSet(mapIntersect(this.countries_service_sum, this.types_service_sum, this.statuses_service_sum, this.providers_service_sum));
        filtered.forEach((service) => {
            ret.countries.add(service.getCountry());
            ret.statuses.add(service.status);
            ret.providers.add(service.getProvider());
            ret.services.add(service);
            service.getServiceTypes().forEach((type) => {
                ret.types.add(type);
            });
        });
        // Resetting to safe state
        this.convertFullToEmpty();
        // Remove item from selected if it is not selectable
        for (let map of [this.selected.countries, this.selected.types, this.selected.providers, this.selected.statuses]) {
            map.forEach((item, _) => {
                this.removeFromSelectedIfNotSelectable(item, ret);
            });
        }
        return ret;
    }
    removeFromSelectedIfNotSelectable(item, selectables) {
        if (item instanceof Country)
            if (!selectables.countries.has(item))
                this.selected.countries.remove(item);
            else if (item instanceof Type)
                if (!selectables.types.has(item))
                    this.selected.types.remove(item);
                else if (item instanceof Status)
                    if (!selectables.statuses.has(item))
                        this.selected.statuses.remove(item);
                    else if (item instanceof Provider)
                        if (!selectables.providers.has(item))
                            this.selected.providers.remove(item);
    }
    convertEmptyToFull() {
        if (this.selected.statuses.getSize() == 0)
            this.statuses_service_sum = this.all_services;
        if (this.selected.types.getSize() == 0)
            this.types_service_sum = this.all_services;
        if (this.selected.countries.getSize() == 0)
            this.countries_service_sum = this.all_services;
        if (this.selected.countries.getSize() == 0)
            this.providers_service_sum = this.all_services;
    }
    convertFullToEmpty() {
        if (this.selected.statuses.getSize() == 0)
            this.statuses_service_sum = new UnorderedMap(10);
        if (this.selected.types.getSize() == 0)
            this.types_service_sum = new UnorderedMap(10);
        if (this.selected.countries.getSize() == 0)
            this.countries_service_sum = new UnorderedMap(10);
        if (this.selected.countries.getSize() == 0)
            this.providers_service_sum = new UnorderedMap(10);
    }
}
function mapToUnorderedSet(map) {
    let ret = new UnorderedSet(10);
    for (let service of map.keys())
        ret.add(service);
    return ret;
}
function unorderedSetToMap(set) {
    let ret = new UnorderedMap(10);
    set.forEach((service) => {
        ret.set(service, 1);
    });
    return ret;
}
function mapIntersect(...maps) {
    let ret = new UnorderedMap(10);
    // Return empty map if there are no maps for parameters
    if (maps.length < 1)
        return ret;
    // Throw error on null map and find the shortest map for faster search
    let shortest_map = maps[0];
    for (let map of maps) {
        if (map === undefined || map === null)
            throw new Error("Error, intersect on null maps");
        if (map.getSize() < shortest_map.getSize())
            shortest_map = map;
    }
    // If there is just one map, return a copy of it
    if (maps.length == 1) {
        for (let service of maps[0].keys())
            ret.set(service, 1);
        return ret;
    }
    // Search for each filtered service of shortest map in other filtering maps
    let all_maps_have_service;
    for (let service of shortest_map.keys()) {
        all_maps_have_service = true;
        for (let map of maps) {
            if (map === shortest_map)
                continue;
            if (!map.has(service)) {
                all_maps_have_service = false;
                break;
            }
        }
        if (all_maps_have_service)
            ret.set(service, 1);
    }
    return ret;
}
function mapUnion(...maps) {
    let ret = new UnorderedSet(10);
    for (let map of maps) {
        for (let service of map.keys()) {
            ret.add(service);
        }
    }
    return ret;
}
function mapSum(...maps) {
    let ret = new UnorderedMap(10);
    for (let map of maps) {
        for (let service of map.keys()) {
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
function mapIncreaseOrInsert(value, map) {
    if (map.has(value)) {
        map.set(value, map.get(value) + 1);
    }
    else {
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
function mapDecreaseOrRemove(value, map) {
    if (!map.has(value)) {
        throw new Error("Trying to remove an item that does not exist");
    }
    if (map.get(value) > 1) {
        map.set(value, map.get(value) - 1);
    }
    else {
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
myFilter.addRule(new Rule(retDict.servicesArray[1].getServiceTypes()[0]));
if (DEBUG == true)
    console.log(myFilter.getFiltered());
console.log(myFilter.getFiltered().countries.values());
console.log(myFilter.getFiltered().types.values());
console.log(myFilter.getFiltered().statuses.values());
console.log(myFilter.getFiltered().providers.values());
console.log(myFilter.getFiltered().services.values());
