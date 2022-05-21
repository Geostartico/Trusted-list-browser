/*
 * filter.ts
 * This file is part of the TrustedListBrowser project (https://github.com/Geostartico/Trusted-list-browser)
 */

// Set this variable to true of you want to see debug messages on the console
const DEBUG: boolean = true;

import {Country, Provider, Service, Status, Type} from "../decoder/items"
import {UnorderedSet} from "../decoder/UnorderedSet"
import {UnorderedMap} from "../decoder/UnorderedMap"
import {Settable} from "../decoder/settable"
//import {objectify} from "../decoder/decoder"

 /**
  * Class that groups a selection/superset of objects in separate @see{UnorderedSet} objects representing:
  * - countries
  * - providers
  * - statuses
  * - types
  * - services
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

    /**
    * @return copy of this Selection (no deep copy, but maps are reconstructed)
    */
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
  * Flitering rule class, used to store the item to filter with with a forced type
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
  * Filtering class, it dynamically updates selectable and active objects
  */
export class Filter{

    /**
     * Returns a map of all @see{Service} objects that have the property specified in the rule parameter
     * @param rule: the rule of type @{Rule} that you want to get the affected services from
     * @returns: @see{UnorderedMap} all affected services as keys
     * Note: the value of each key (i.e. the multiplicity of every Service key) is always 1
     */
    private getServicesFromRule(rule: Rule): UnorderedMap<Service, number>{

        let ret = new UnorderedMap<Service, number>(10);

        if(rule.filtering_item instanceof Country){
            rule.filtering_item.getProviders().forEach((provider: Provider) => {
                provider.getServices().forEach((service: Service) => {
                    ret.set(service, 1);
                });
            });
        }
        else if(rule.filtering_item instanceof Provider){
            rule.filtering_item.getServices().forEach((service: Service) => {
                ret.set(service, 1);
            });
        }

        else if(rule.filtering_item instanceof Type){
            rule.filtering_item.services.forEach((service: Service) => {
                ret.set(service, 1);
            });
        }
        else if(rule.filtering_item instanceof Status){
            rule.filtering_item.services.forEach((service: Service) => {
                ret.set(service, 1);
            });
        }

        return ret;
    }

    //private rules: Set<Rule>;

    private selected: Selection;

    /**
     * @private
     * This map is used as a cache for the number of services of type @see{Service} filtered by the @see{Rule} for the countries
     * The number associated with the @see{Service} is the number of times a service has been referenced by the filter
     * Note: analogous behaviour for the countries_service_sum, types_service_sum and statuses_service_sum maps
     */
    private countries_service_sum: UnorderedMap<Service, number>;
    private providers_service_sum: UnorderedMap<Service, number>;
    private types_service_sum:     UnorderedMap<Service, number>;
    private statuses_service_sum:  UnorderedMap<Service, number>;

    /**
     * @private
     * This is a cache of all possible services
     * It is a @see{UnorderedMap} with a @see{Service} object as a key and the number 1 as a value
     */
    private readonly all_services: UnorderedMap<Service, number>;

    constructor(service_list: Service[]){

        //this.rules = new Set<Rule>();

        this.selected = new Selection();

        this.all_services = new UnorderedMap<Service, number>(service_list.length);

        this.countries_service_sum = new UnorderedMap<Service, number>(10);
        this.providers_service_sum = new UnorderedMap<Service, number>(10);
        this.types_service_sum     = new UnorderedMap<Service, number>(10);
        this.statuses_service_sum  = new UnorderedMap<Service, number>(10);

        service_list.forEach((service: Service) => {
            this.all_services.set(service, 1);
        });
    }

    /**
     * Add a rule to the filter and dynamically update @see{selected} and cached sum maps (e.g. @see{countries_service_sum})
     * @param rule: @see{Rule} object to add
     * Note: this is the opposite of @see{removeRule}
     */
    addRule(rule: Rule){
        //this.rules.add(rule);

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

    /**
     * Remove a rule from the filter and dynamically update @see{selected} and cached sum maps (e.g. @see{countries_service_sum})
     * @param rule: @see{Rule} object to remove
     * Note: this is the opposite of @see{addRule}
     */
    removeRule(rule: Rule){
        //this.rules.delete(rule);

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
     * @returns selected objects that are converted from the added rules
     */
    getSelected(): Selection{
        return this.selected;
    }

    /**
     * Main filtering method, intersects each chached sum map and (e.g. @see{countries_service_sum}) and updates the
     * @see{selected} map if some elemets are removed by a cascade effect (TODO: add better link to an explaination)
     * @returns: set of filtered services based on the rules
     */
    getFiltered(): Selection{

        // If I have no selections in a field, it's the same as all selected
        this.convertEmptyToFull();

        let ret = new Selection();

        let filtered: UnorderedSet<Service> = mapIntersect(this.countries_service_sum,
                                                           this.types_service_sum,
                                                           this.statuses_service_sum,
                                                           this.providers_service_sum);

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
        this.convertFullToEmpty();

        // Remove item from selected if it is not selectable
        for(let map of [this.selected.countries, this.selected.types, this.selected.providers, this.selected.statuses]){
            map.forEach((item: Country|Type|Provider|Status, _: number) => {
                this.removeFromSelectedIfNotSelectable(item, ret);
            });
        }

        return ret;
    }

    /**
     * @private
     * Removes item of type @see{Country}, @see{Type}, @see{Provider}, @see{Status} from @see{selected}
     * if the item is not in the selectable @see{Selection}.
     * @param item: item to check and eventually remove
     * @param selectables: @see{Selection} object containing all selectable items
     */
    private removeFromSelectedIfNotSelectable(item: Country|Type|Provider|Status, selectables: Selection){
        if(item instanceof Country)
            if(!selectables.countries.has(item))
                this.selected.countries.remove(item);

        else if(item instanceof Type)
            if(!selectables.types.has(item))
                this.selected.types.remove(item);

        else if(item instanceof Status)
            if(!selectables.statuses.has(item))
                this.selected.statuses.remove(item);

        else if(item instanceof Provider)
            if(!selectables.providers.has(item))
                this.selected.providers.remove(item);
    }

    /**
     * @private
     * Makes all empty service sum maps (i.e. @see{statuses_service_sum}, @see{types_service_sum}, @see{countries_service_sum}, @see{providers_service_sum})
     * ) have all service.
     * Note: the inverse of this operation is done in @see{convertFullToEmpty}
     */
    private convertEmptyToFull(){
        if(this.selected.statuses.getSize() == 0)
            this.statuses_service_sum = this.all_services;

        if(this.selected.types.getSize() == 0)
            this.types_service_sum = this.all_services;

        if(this.selected.countries.getSize() == 0)
            this.countries_service_sum = this.all_services;

        if(this.selected.countries.getSize() == 0)
            this.providers_service_sum = this.all_services;
    }


    /**
     * @private
     * Makes all temporary-full service sum maps (i.e. @see{statuses_service_sum}, @see{types_service_sum}, @see{countries_service_sum}, @see{providers_service_sum})
     * ) have no selected elements.
     * Note: this is the inverse operation of @see{convertEmptyToFull}
     */
    private convertFullToEmpty(){
        if(this.selected.statuses.getSize() == 0)
            this.statuses_service_sum = new UnorderedMap<Service, number>(10);

        if(this.selected.types.getSize() == 0)
            this.types_service_sum = new UnorderedMap<Service, number>(10);

        if(this.selected.countries.getSize() == 0)
            this.countries_service_sum = new UnorderedMap<Service, number>(10);

        if(this.selected.countries.getSize() == 0)
            this.providers_service_sum = new UnorderedMap<Service, number>(10);
    }
}

// TODO: remove
function mapToUnorderedSet(map: UnorderedMap<Service, number>): UnorderedSet<Service>{
    let ret = new UnorderedSet<Service>(10);

    for(let service of map.keys())
        ret.add(service);

    return ret;
}

// TODO: remove
function unorderedSetToMap(set: UnorderedSet<Service>): UnorderedMap<Service, number>{
    let ret = new UnorderedMap<Service, number>(10);

    set.forEach((service: Service) => {
        ret.set(service, 1);
    });

    return ret;
}

/**
 * Intersects a variable number of maps
 * @param maps: comma separated map @see{UnorderedMap} maps
 * @returns: @see{UnorderedSet} containing services of type @see{Service} commmon to all maps
 */
function mapIntersect(...maps: Array<UnorderedMap<Service, number>>): UnorderedSet<Service>{

    let ret = new UnorderedSet<Service>(10);

    // Return empty map if there are no maps for parameters
    if(maps.length < 1)
        return ret;

    // Throw error on null map and find the shortest map for faster search
    let shortest_map = maps[0];
    for(let map of maps){
        if(map === undefined || map === null)
            throw new Error("Error, intersect on null maps");

        if(map.getSize() < shortest_map.getSize())
            shortest_map = map;
    }

    // If there is just one map, return a copy of it
    if(maps.length == 1){
        for(let service of maps[0].keys())
            ret.add(service);
        return ret;
    }

    // Search for each filtered service of shortest map in other filtering maps
    let all_maps_have_service: boolean;
    for(let service of shortest_map.keys()){
        all_maps_have_service = true;
        for(let map of maps){
            if(map === shortest_map)
                continue;
            if(!map.has(service)){
                all_maps_have_service = false;
                break;
            }
        }
        if(all_maps_have_service)
            ret.add(service);
    }

    return ret;
}

// TODO: remove
function mapUnion(...maps: Array<UnorderedMap<Service, number>>): UnorderedSet<Service>{

    let ret = new UnorderedSet<Service>(10);

    for(let map of maps){
        for(let service of map.keys()){
            ret.add(service);
        }
    }

    return ret;
}

// TODO: remove
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
  * Increases the numeric value associated to a key in an @see{UnorderedMap} object, if not present, it inserts it (with the value 1)
  * @param key: value to update
  * @param map: map
  */
function mapIncreaseOrInsert<K extends Settable<K>>(key: K, map: UnorderedMap<K, number>){
    if(map.has(key)){
        map.set(key, map.get(key)+1);
    }
    else{
        map.set(key, 1);
    }
}

 /**
  * Decreases the numeric value associated to a key in an @see{UnorderedMap} object, if the value drops to 0, it removes the entry
  * The key must be in the map, otherwise an exception will be thrown
  * @param key: key to remove
  * @param map: map containing the key to be removed
  * @throws @link{Error}
  * Thrown if the key is not inserted in the map
  */
function mapDecreaseOrRemove<K extends Settable<K>>(key: K, map: UnorderedMap<K, number>){
    if(!map.has(key)){
        throw new Error("Trying to remove an key that does not exist");
    }
    let value: number = map.get(key);
    if(value > 1){
        map.set(key, value-1);
    }
    else{
        map.remove(key);
    }
}

//let retDict = objectify(countryDict, serviceDict);
//
//console.log(retDict);
//
//let myFilter = new Filter(retDict.servicesArray);
//
//myFilter.addRule(new Rule(retDict.servicesArray[1].getServiceTypes()[0]));
//
//if(DEBUG == true)
//    console.log(myFilter.getFiltered());
//    console.log(myFilter.getFiltered().countries.values());
//    console.log(myFilter.getFiltered().types.values());
//    console.log(myFilter.getFiltered().statuses.values());
//    console.log(myFilter.getFiltered().providers.values());
//    console.log(myFilter.getFiltered().services.values());
