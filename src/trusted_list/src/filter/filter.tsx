/*
 * filter.ts
 * This file is part of the TrustedListBrowser project (https://github.com/Geostartico/Trusted-list-browser)
 */

import {Country, Provider, Service, Status, Type, ItemType} from "../decoder/items"
import {UnorderedSet} from "../decoder/UnorderedSet"
import {UnorderedMap} from "../decoder/UnorderedMap"
import {Settable} from "../decoder/settable"


/**
 * Class that groups a selection/superset of objects in separate {@link UnorderedSet} objects representing:
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
    /**
     * @private
     */
    public readonly filtering_item: Type | Status | Provider | Country;

    /**
     * @param filtering_item: Country, Provider, Type or Status object that I want to filter with
     */
    constructor(filtering_item: Type | Status | Provider | Country){
        if(filtering_item === null || filtering_item === undefined)
            throw new Error("Rule filtering item cannot be null or undefined");
        this.filtering_item = filtering_item;
    }
}

 /**
  * Filtering class, it dynamically updates selectable and active objects
  */
export class Filter{

    /**
     * @private
     * This varibale holds the current selection of objects made by the user
     */
    private selected: Selection;

    private service_sums: Map<ItemType, UnorderedMap<Service, number>>;

    ///**
     //* @private
     //* This map is used as a cache for the number of services of type {@link Service} filtered by the {@link Rule} for the countries
     //* The number associated with the {@link Service} is the number of times a service has been referenced by the filter
     //* Note: analogous behaviour for the countries_service_sum, types_service_sum and statuses_service_sum maps
     //*/
    //private countries_service_sum: UnorderedMap<Service, number>;

    ///**
     //* @private
     //* {@link countries_service_sum}
     //*/
    //private providers_service_sum: UnorderedMap<Service, number>;

    ///**
     //* @private
     //* {@link countries_service_sum}
     //*/
    //private types_service_sum:     UnorderedMap<Service, number>;

    ///**
     //* @private
     //* {@link countries_service_sum}
     //*/
    //private statuses_service_sum:  UnorderedMap<Service, number>;

    /**
     * @private
     * This is a set of all possible services
     * It has a Service object as a key and the number 1 as a value
     */
    private readonly all_services: UnorderedMap<Service, number>;

    /**
     * @private
     * Number of currently applied rules
     */
    private number_of_rules: number;

    /**
     * @private
     * Type of the first applied rule, with this convenction
     */
    private first_rule_type: ItemType;


    constructor(service_list: Service[]){

        this.selected = new Selection();

        this.all_services = new UnorderedMap<Service, number>(service_list.length);

        this.service_sums = new Map<ItemType, UnorderedMap<Service, number>>();

        this.service_sums.set(ItemType.Provider, new UnorderedMap<Service, number>(10));
        this.service_sums.set(ItemType.Status, new UnorderedMap<Service, number>(10));
        this.service_sums.set(ItemType.Type, new UnorderedMap<Service, number>(10));
        this.service_sums.set(ItemType.Country, new UnorderedMap<Service, number>(10));

        service_list.forEach((service: Service) => {
            this.all_services.set(service, 1);
        });
    }

    /**
     * Add a rule to the filter and dynamically update {@link selected} and cached sum maps (e.g. {@link countries_service_sum})
     * Note: this is the opposite of {@link removeRule}
     * @param rule: {@link Rule} object to add
     */
    addRule(rule: Rule){

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
     * Remove a rule from the filter and dynamically update {@link selected} and cached sum maps (e.g. {@link countries_service_sum})
     * Note: this is the opposite of {@link addRule}
     * @param rule: {@link Rule} object to remove
     */
    removeRule(rule: Rule){

        if(rule === null || rule === undefined || rule.filtering_item === null || rule.filtering_item === undefined)
            throw new Error("Cannot add a null or undefined rule");

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
     * @private
     * Returns a map of all {@link Service} objects that have the property specified in the rule parameter
     * @param rule: the rule of type {@link Rule} that you want to get the affected services from
     * @returns: {@link UnorderedMap} all affected services as keys
     *           Note: the value of each key (i.e. the multiplicity of every Service key) is always 1
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

    /**
     * @returns selected objects that are converted from the added rules
     */
    getSelected(): Selection{
        return this.selected;
    }

    /**
     * Main filtering method, intersects each chached sum map (e.g. {@link countries_service_sum}) and updates the
     * {@link selected} map if some elemets are no longer selectable after a previous removal
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
            let country: Country|null = service.getCountry();
            if(country === null)
                throw new Error("Country variable is null");
            ret.countries.add(country);
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
     * Removes item of typl@link ink Country}, {@link Type}, {@link Provider}, {@link Status} from {@link selected}
     * if the item is not in the selectable {@link Selection}.
     * @param item: item to check and eventually remove
     * @param selectables: {@link Selection} object containing all selectable items
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
     * Makes all empty service sum maps (i.e. {@link statuses_service_sum}, {@link types_service_sum}, {@link countries_service_sum}, {@link providers_service_sum})
     * ) have all service.
     * Note: the inverse of this operation is done in {@link convertFullToEmpty}
     */
    private convertEmptyToFull(){
        if(this.selected.statuses.getSize() === 0)
            this.statuses_service_sum = this.all_services;

        if(this.selected.types.getSize() === 0)
            this.types_service_sum = this.all_services;

        if(this.selected.countries.getSize() === 0)
            this.countries_service_sum = this.all_services;

        if(this.selected.providers.getSize() === 0)
            this.providers_service_sum = this.all_services;
    }


    /**
     * @private
     * Makes all temporary-full service sum maps (i.e. {@link statuses_service_sum}, {@link types_service_sum}, {@link countries_service_sum}, {@link providers_service_sum})
     * ) have no selected elements.
     * Note: this is the inverse operation of {@link convertEmptyToFull}
     */
    private convertFullToEmpty(){
        if(this.selected.statuses.getSize() === 0)
            this.statuses_service_sum = new UnorderedMap<Service, number>(10);

        if(this.selected.types.getSize() === 0)
            this.types_service_sum = new UnorderedMap<Service, number>(10);

        if(this.selected.countries.getSize() === 0)
            this.countries_service_sum = new UnorderedMap<Service, number>(10);

        if(this.selected.providers.getSize() === 0)
            this.providers_service_sum = new UnorderedMap<Service, number>(10);
    }
}

/**
 * Intersects a variable number of maps
 * @param maps: comma separated map {@link UnorderedMap} maps
 * @returns: {@link UnorderedSet} containing services of type {@link Service} commmon to all maps
 */
function mapIntersect(...maps: Array<UnorderedMap<Service, number>>): UnorderedSet<Service>{

    let ret = new UnorderedSet<Service>(10);

    // Return empty map if there are no input maps
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
    if(maps.length === 1){
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

 /**
  * Increases the numeric value associated to a key in an {@link UnorderedMap} object, if not present, it inserts it (with the value 1)
  * @param key: value to update
  * @param map: map
  */
function mapIncreaseOrInsert<K extends Settable<K>>(key: K, map: UnorderedMap<K, number>){
    if(map.has(key)){
        let value: number|null = map.get(key);
        if(value === null || value === undefined)
            throw new Error("Null value in map associated with input key");
        map.set(key, value+1);
    }
    else
        map.set(key, 1);
}

 /**
  * Decreases the numeric value associated to a key in an {@link UnorderedMap} object, if the value drops to 0, it removes the entry
  * The key must be in the map, otherwise an exception will be thrown
  * @param key: key to remove
  * @param map: map containing the key to be removed
  * @throws @link{Error}
  * Thrown if the key is not inserted in the map
  */
function mapDecreaseOrRemove<K extends Settable<K>>(key: K, map: UnorderedMap<K, number>){
    if(!map.has(key))
        throw new Error("Trying to remove an key that does not exist");
    let value: number|null = map.get(key);
    if(value === null || value === undefined)
        throw new Error("Null value in map associated with input key");
    else if(value > 1)
        map.set(key, value-1);
    else
        map.remove(key);
}
