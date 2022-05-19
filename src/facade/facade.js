import { Filter, Rule } from "../filter/filter.js";
import { Data } from "./data.js";
import { objectify } from "../decoder/decoder.js";
import { UnorderedSet } from "../decoder/UnorderedSet.js";
export class Facade {
    constructor() {
        let stuff = objectify(Data.countryDict, Data.serviceDict);
        //this.fetcher = new Fetcher()
        //let dict = fetcher.fetch();
        this.filter = new Filter(stuff["servicesArray"]);
    }
    updateAdd(item) {
        this.filter.addRule(new Rule(item));
        this.selection = this.filter.getFiltered();
    }
    updateRemove(item) {
        this.filter.removeRule(new Rule(item));
        this.selection = this.filter.getFiltered();
    }
    getSelectableCountries() {
        return this.selection.countries;
    }
    getSelectableProviders() {
        return this.selection.providers;
    }
    getSelectableTypes() {
        return this.selection.types;
    }
    getSelectableStatus() {
        return this.selection.statuses;
    }
    getView() {
        let countries = new UnorderedSet(10);
        let providers = new UnorderedSet(10);
        let services = this.selection.services;
        services.forEach((elem) => {
            countries.add(elem.getCountry());
            providers.add(elem.getProvider());
        });
        return { "countries": countries, "providers": providers, "services": services };
    }
}
