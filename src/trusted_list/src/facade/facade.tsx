import {Filter, Rule, Selection} from "../filter/filter.js"
import { Data } from "./data.js";
import { objectify } from "../decoder/decoder.js";
import { Country, Provider, Service, Status, Type } from "../decoder/items.js";
import { UnorderedSet } from "../decoder/UnorderedSet.js";

export class Facade{
    private filter : Filter;
    //private fetcher : Fetcher;
    private selection : Selection;
    constructor(){
        let stuff = objectify(Data.countryDict, Data.serviceDict);
        //this.fetcher = new Fetcher()
        //let dict = fetcher.fetch();
        this.filter = new Filter(stuff["servicesArray"]);
    }
    updateAdd(item : Country | Type | Status | Provider){
        this.filter.addRule(new Rule(item));
        this.selection = this.filter.getFiltered();
    }
    updateRemove(item : Country | Type | Status | Provider){
        this.filter.removeRule(new Rule(item));
        this.selection = this.filter.getFiltered();
    }
    getSelectableCountries() : UnorderedSet<Country>{
        return this.selection.countries;
    }
    getSelectableProviders() : UnorderedSet<Provider>{
        return this.selection.providers;
    }
    getSelectableTypes() : UnorderedSet<Type>{
        return this.selection.types;
    }
    getSelectableStatus() : UnorderedSet<Status>{
        return this.selection.statuses;
    }
    getView() : {"countries" : UnorderedSet<Country>, "providers" : UnorderedSet<Provider>, "services" : UnorderedSet<Service>}{
        let countries : UnorderedSet<Country> = new UnorderedSet<Country>(10); 
        let providers : UnorderedSet<Provider> = new UnorderedSet<Provider>(10);
        let services : UnorderedSet<Service> = this.selection.services;
        services.forEach((elem : Service) => {
            countries.add(elem.getCountry());
            providers.add(elem.getProvider());
        })
        return {"countries" : countries, "providers" : providers, "services" : services};
    }
}
