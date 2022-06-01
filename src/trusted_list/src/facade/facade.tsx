import {Filter, Rule, Selection} from "../filter/filter"
import { Data } from "./data";
import { objectify } from "../decoder/decoder";
import { Country, Provider, Service, Status, Type } from "../decoder/items";
import { UnorderedSet } from "../decoder/UnorderedSet";
import { Fetcher } from "../fetch/Fetcher";

export interface IgetView {
    "countries" : UnorderedSet<Country>, 
    "providers" : UnorderedSet<Provider>, 
    "services" : UnorderedSet<Service>,
}

export class Facade{
    private filter : Filter | undefined;
    private fetcher : Fetcher;
    private selection : Selection;
    private allServices : UnorderedSet<Service>;
    private allCountries : UnorderedSet<Country>;
    private allProviders : UnorderedSet<Provider>;
    private allTypes : UnorderedSet<Type>;
    private allStatuses : UnorderedSet<Status>;

    constructor(){
        this.filter = undefined;
        this.fetcher = new Fetcher();
        this.selection = new Selection();
        this.allServices = new UnorderedSet(10);
        this.allCountries= new UnorderedSet(10);
        this.allProviders= new UnorderedSet(10);
        this.allTypes = new UnorderedSet(10);
        this.allStatuses = new UnorderedSet(10);
        //this.setUp(onSetUpCompleted);
    }

    async setUp(onSetUpCompleted: Function) {

        let countryDict = await this.fetcher.getJSON(("https://esignature.ec.europa.eu/efda/tl-browser/api/v1/search/countries_list")).catch(err => {throw err});
        let serviceDict = await this.fetcher.getJSON(("https://esignature.ec.europa.eu/efda/tl-browser/api/v1/search/tsp_list")).catch(err => {throw err});

        let stuff = objectify(countryDict, serviceDict);
        //let stuff = objectify(Data.countryDict, Data.serviceDict);
        this.filter = new Filter(stuff["servicesArray"]);
        this.selection = this.filter.getFiltered();
        this.allServices = this.selection.services;
        this.allCountries = this.selection.countries;
        this.allProviders = this.selection.providers;
        this.allTypes = this.selection.types;
        this.allStatuses = this.selection.statuses;

        onSetUpCompleted();
    }

    updateAdd(item : Country | Type | Status | Provider){
        this.filter?.addRule(new Rule(item));
        if(this.filter === undefined) return;
        this.selection = this.filter.getFiltered();
    }
    updateRemove(item : Country | Type | Status | Provider) : boolean{
        this.filter?.removeRule(new Rule(item));

        if(this.filter === undefined) return false;

        let temp = this.filter.getFiltered();
        
        if(temp.services.getSize() === 0){
            this.filter.addRule(new Rule(item));
            return false
        }
        else{
            this.selection = temp;
            return true;
        }
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
    getSelected() : IgetView{
        let temp = this.filter?.getSelected();
        if(temp?.countries !== undefined && temp.providers !== undefined && temp.services !== undefined){
            return {"countries" : temp?.countries, "providers" : temp?.providers, "services" : temp?.services};
        }
        else{
            throw new Error("undefined filter");
        }
    }
}
