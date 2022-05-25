import {Filter, Rule, Selection} from "../filter/filter"
import { Data } from "./data";
import { objectify } from "../decoder/decoder";
import { Country, Provider, Service, Status, Type } from "../decoder/items";
import { UnorderedSet } from "../decoder/UnorderedSet";
import { Fetcher } from "../fetch/fetch";
export interface IgetView {
    "countries" : UnorderedSet<Country>, 
    "providers" : UnorderedSet<Provider>, 
    "services" : UnorderedSet<Service>,
}

export class Facade{
    private filter : Filter;
    private fetcher : Fetcher;
    private selection : Selection;
    readonly allServices : UnorderedSet<Service>;
    readonly allCountries : UnorderedSet<Country>;
    readonly allProviders : UnorderedSet<Provider>;
    readonly allTypes : UnorderedSet<Type>;
    readonly allStatuses : UnorderedSet<Status>;
    constructor(){
        this.fetcher = new Fetcher()
        let stuff = objectify(this.fetcher.getJSON("https://esignature.ec.europa.eu/efda/tl-browser/api/v1/search/countries_list"), this.fetcher.getJSON("https://esignature.ec.europa.eu/efda/tl-browser/api/v1/search/tsp_list"));
        this.filter = new Filter(stuff["servicesArray"]);
        this.selection = this.filter.getFiltered();
        this.allServices = this.selection.services;
        this.allCountries = this.selection.countries;
        this.allProviders = this.selection.providers;
        this.allTypes = this.selection.types;
        this.allStatuses = this.selection.statuses;
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
    getView() : IgetView {
        let countries : UnorderedSet<Country> = new UnorderedSet<Country>(10); 
        let providers : UnorderedSet<Provider> = new UnorderedSet<Provider>(10);
        let services : UnorderedSet<Service> = this.selection.services;
        services.forEach((elem : Service) => {
            let curCountry : Country | null = elem.getCountry(); 
            if(curCountry !== null){
                countries.add(curCountry);

            }
            else{
                throw new Error("service without a Country");
            }
            providers.add(elem.getProvider());
        })
        return {"countries" : countries, "providers" : providers, "services" : services};
    }
}
