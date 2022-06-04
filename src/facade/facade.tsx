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
/**
 * class used to interface with the filtering and fetching subsystem
 */
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
    }

    /**
     * This fuction is used to fetch all the data using the Fetcher object and than
     * decode all the arrived information
     *
     * This is an async function becouse while we are waiting for the data the page
     * instead will be rendered
     *
     * @param onSetUpCompleted this is a callback fuction used to advice the finish of the fetch and decode
     */
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
    /**
     * if the setUp wasn't run it won't work correctly
     * @param item item to add to the selected
     */
    updateAdd(item : Country | Type | Status | Provider){
        this.filter?.addRule(new Rule(item));
        if(this.filter === undefined) return;
        this.selection = this.filter.getFiltered();
    }
    /**
     * the method won't work correctly if setUp wasn't run
     * @param item item to remove from the selected
     * @returns true if the item could be deselected
     */
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
    /**
     * 
     * @returns selectable countries
     */
    getSelectableCountries() : UnorderedSet<Country>{
        return this.selection.countries;
    }
    /**
     * 
     * @returns the selectable providers
     */
    getSelectableProviders() : UnorderedSet<Provider>{
        return this.selection.providers;
    }
    /**
     * 
     * @returns selectable types
     */
    getSelectableTypes() : UnorderedSet<Type>{
        return this.selection.types;
    }
    /**
     * 
     * @returns selectable statuses
     */
    getSelectableStatus() : UnorderedSet<Status>{
        return this.selection.statuses;
    }
    /**
     * 
     * @returns returns the items to be viewed
     */
    getView() : IgetView {
        let countries : UnorderedSet<Country> = new UnorderedSet<Country>(10); 
        let providers : UnorderedSet<Provider> = new UnorderedSet<Provider>(10);
        let services : UnorderedSet<Service> = this.selection.services;
        //the filter only returns services, to facilitate the representation it gets the set of countries and providers to be shown
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
    /**
     * it won't work correctly if setUp wasn't run
     * @returns the selected items
     */
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
