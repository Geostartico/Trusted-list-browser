/*
 * filter.tsx
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
     * @private
     * Adds an item to the corresponding set
     * Note: this is the opposite of {@link removeFromSelection}
     * @param item: the item to add
     */
    add(item: Type|Country|Status|Provider|Service){
        switch(item.item_type){
            case ItemType.Type:     { this.types.add(item);     return; }
            case ItemType.Country:  { this.countries.add(item); return; }
            case ItemType.Provider: { this.providers.add(item); return; }
            case ItemType.Status:   { this.statuses.add(item);  return; }
            case ItemType.Service:  { this.services.add(item);  return; }
        }
    }

    /**
     * @private
     * Removes an item from the corresponding set
     * Note: this is the opposite of {@link addToSelection}
     * @param item: the item to remove
     */
    remove(item: Type|Country|Status|Provider|Service){
        switch(item.item_type){
            case ItemType.Type:     { this.types.remove(item);     return; }
            case ItemType.Country:  { this.countries.remove(item); return; }
            case ItemType.Provider: { this.providers.remove(item); return; }
            case ItemType.Status:   { this.statuses.remove(item);  return; }
            case ItemType.Service:  { this.services.remove(item);  return; }
        }
    }

    /**
     * @private
     * Checks if an item is present in the sets
     * @param item: the item to remove
     * @returns true is the element is present, false otherwise
     */
    has(item: Type|Country|Status|Provider|Service): boolean{
        switch(item.item_type){
            case ItemType.Type:     { return this.types.has(item);     }
            case ItemType.Country:  { return this.countries.has(item); }
            case ItemType.Provider: { return this.providers.has(item); }
            case ItemType.Status:   { return this.statuses.has(item);  }
            case ItemType.Service:  { return this.services.has(item);  }
        }
    }

    /**
     * Get the set of the corresponding item type
     * @param item_type: the type of the required set
     */
    getSet(item_type: ItemType){
        switch(item_type){
            case ItemType.Status:   return this.statuses;
            case ItemType.Provider: return this.providers;
            case ItemType.Country:  return this.countries;
            case ItemType.Type:     return this.types;
        }
    }

    /**
     * Get a {@link Map} whose keys are an {@link ItemType} instance and whose values are the {@link Set}s of items
     * @returns a {@link Map} whose keys are an {@link ItemType} instance and whose values are the {@link Set}s of items
     */
    getSets(): Map<ItemType, UnorderedSet<Service> |
                             UnorderedSet<Status>  |
                             UnorderedSet<Type>    |
                             UnorderedSet<Country> |
                             UnorderedSet<Provider>  >
    {
        let ret = new Map<ItemType, UnorderedSet<Service>|UnorderedSet<Status>|UnorderedSet<Type>|UnorderedSet<Country>|UnorderedSet<Provider>>();

        ret.set(ItemType.Service,  this.services);
        ret.set(ItemType.Status,   this.statuses);
        ret.set(ItemType.Provider, this.providers);
        ret.set(ItemType.Country,  this.countries);
        ret.set(ItemType.Type,     this.types);

        return ret;
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

    /**
     * @private
     * A map whose keys are {@link ItemType} enums representing the type of the corresponding service_sum
     * Brief explanation (see more in the filter documentation): this {@link UnorderedSet}s are the cache for the
     * affected services by each type of item (Provider, Status, Type and Country)
     */
    private service_sums: Map<ItemType, UnorderedMap<Service, number>>;

    /**
     * @private
     * This set stores the item types that have at least one entry selected
     */
    private active_filtering_types: Set<ItemType>;

    /**
     * @private
     * This is a set of all possible services
     * It has a Service object as a key and the number 1 as a value
     */
    private readonly all_services: UnorderedMap<Service, number>;

    private readonly all_items: Selection;

    /**
     * @private
     * Type of the first applied rule
     */
    private first_rule_type: ItemType;


    constructor(service_list: Service[]){

        this.selected = new Selection();

        this.all_services = new UnorderedMap<Service, number>(service_list.length);

        this.all_items = new Selection();

        this.service_sums = new Map<ItemType, UnorderedMap<Service, number>>();

        this.active_filtering_types = new Set<ItemType>();

        this.service_sums.set(ItemType.Provider, new UnorderedMap<Service, number>(10));
        this.service_sums.set(ItemType.Status,   new UnorderedMap<Service, number>(10));
        this.service_sums.set(ItemType.Type,     new UnorderedMap<Service, number>(10));
        this.service_sums.set(ItemType.Country,  new UnorderedMap<Service, number>(10));

        // Initialize all_items and all_services
        service_list.forEach((service: Service) => {
            this.all_services.set(service, 1);
            let country: Country|null = service.getCountry();
            if(country === null)
                throw new Error("Service's country attribute is null");
            this.all_items.countries.add(country);
            this.all_items.providers.add(service.getProvider());
            this.all_items.statuses.add(service.status);
            service.getServiceTypes().forEach((type: Type) => {
                this.all_items.types.add(type);
            });
        });

        // This is just a default initialization
        this.first_rule_type = ItemType.Country;
    }


    /**
     * Add a rule to the filter and dynamically update {@link selected} and cached sum maps (e.g. {@link countries_service_sum})
     * Note: this is the opposite of {@link removeRule}
     * @param rule: {@link Rule} object to add
     */
    addRule(rule: Rule){

        if(rule === null || rule === undefined || rule.filtering_item === null || rule.filtering_item === undefined)
            throw new Error("Cannot add a null or undefined rule");

        this.selected.add(rule.filtering_item);

        this.active_filtering_types.add(rule.filtering_item.item_type);
        //console.log(this.active_filtering_types);

        this.getServicesFromItem(rule.filtering_item).forEach((service: Service) => {
            const service_sum_map = this.service_sums.get(rule.filtering_item.item_type);
            if(service_sum_map === null || service_sum_map === undefined)
                throw new Error("Null or undefined sum map");
            mapIncreaseOrInsert(service, service_sum_map);
        });
    }

    /**
     * Remove a rule from the filter and dynamically update {@link selected} and cached sum maps (e.g. {@link countries_service_sum})
     * Note: this is the opposite of {@link addRule}
     * @param rule: {@link Rule} object to remove
     */
    removeRule(rule: Rule){

        if(rule === null || rule === undefined || rule.filtering_item === null || rule.filtering_item === undefined)
            throw new Error("Cannot remove a null or undefined rule");

        this.selected.remove(rule.filtering_item);

        if(this.active_filtering_types.has(rule.filtering_item.item_type) && this.selected.getSet(rule.filtering_item.item_type)?.getSize() === 0)
            this.active_filtering_types.delete(rule.filtering_item.item_type)

        this.getServicesFromItem(rule.filtering_item).forEach((service: Service) => {
            const service_sum_map = this.service_sums.get(rule.filtering_item.item_type);
            if(service_sum_map === null || service_sum_map === undefined)
                throw new Error("Null or undefined sum map");
            mapDecreaseOrRemove(service, service_sum_map);
        });
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

        let selectables = new Selection();

        // If no selection is made, it is like all options are selected
        this.convertEmptyToFull();


        let filtered: UnorderedSet<Service> = mapIntersect(new Array(this.service_sums.get(ItemType.Country),
                                                                     this.service_sums.get(ItemType.Provider),
                                                                     this.service_sums.get(ItemType.Type),
                                                                     this.service_sums.get(ItemType.Status)));

        filtered.forEach((service: Service) => {
            selectables.services.add (service);
            selectables.statuses.add (service.status);
            selectables.providers.add(service.getProvider());
            service.getServiceTypes().forEach((type: Type) => {
                selectables.types.add(type);
            });
            let country: Country|null = service.getCountry();
            if(country === null)
                throw new Error("Service's country attribute is null");
            selectables.countries.add(country);
        });

        this.addSelectables(selectables);

        // Return to initial state after treating all empty selections as full selection
        this.convertFullToEmpty();

        return selectables;
    }


    /**
     * @private
     * Add all selectable items (i.e. the ones that do not make the filtered-services set empty) to {@link Selection} objects
     * @param selectables: items that can be added to the filter as rules
     */
    private addSelectables(selectables: Selection){
        this.all_items.getSets().forEach((set, item_type) => {
            set.forEach((item: any) => {
                if(!selectables.has(item)){
                    let maps = new Array<UnorderedMap<Service, number>>();
                    this.service_sums.forEach((map, item_type) => {
                        if(item.item_type !== item_type)
                            maps.push(map);
                    });
                    maps.push(setToMap(this.getServicesFromItem(item)));
                    if(mapIntersect(maps).getSize() > 0){
                        selectables.add(item);
                    }
                }
            });
        });
        // All selected items are selectable
        this.selected.getSets().forEach((set, item_type) => {
            set.forEach((item: any) => selectables.add(item));
        });
    }

    /**
     * @private
     * Returns a map of all {@link Service} objects that have the property specified in the rule parameter
     * @param item: the item that you want to get the affected services of
     * @returns: {@link UnorderedSet} containing all affected services
     */
    private getServicesFromItem(item: Status|Provider|Country|Type): UnorderedSet<Service>{

        switch(item.item_type){
            case ItemType.Country: {
                let ret = new UnorderedSet<Service>(10);
                item.getProviders().forEach((provider: Provider) => {
                    provider.getServices().forEach((service: Service) => {
                        ret.add(service);
                    });
                });
                return ret;
            }
            case ItemType.Provider: {
                return item.getServices();
            }
            case ItemType.Status: {
                return item.getServices();
            }
            case ItemType.Type: {
                return item.getServices();
            }
        }
    }

    /**
     * @private
     * Makes all empty service sum maps have all services, the opposite of this is {@link convertFullToEmpty}
     */
    private convertEmptyToFull(){
        this.selected.getSets().forEach((set, item_type) => {
            if(set.getSize() === 0){
                this.service_sums.set(item_type, this.all_services);
            }
        });
    }

    /**
     * @private
     * Undo what {@link convertEmptyToFull} does
     */
    private convertFullToEmpty(){
        this.selected.getSets().forEach((set, item_type) => {
            if(set.getSize() === 0)
                this.service_sums.set(item_type, new UnorderedMap<Service, number>(10));
        });
    }
}

/**
 * Intersects a variable number of maps
 * @param maps: comma separated map {@link UnorderedMap} maps
 * @returns: {@link UnorderedSet} containing services of type {@link Service} commmon to all maps
 * @throws {@link Error}
 * Thrown if one of the input maps is null
 */
function mapIntersect(maps: Array<UnorderedMap<Service, number> | null | undefined>): UnorderedSet<Service>{

    let ret = new UnorderedSet<Service>(10);

    // Return empty map if there are no input maps
    if(maps.length < 1)
        return ret;

    // Throw error on null map and find the shortest map for faster search
    let shortest_map = maps[0];
    if(shortest_map === undefined || shortest_map === null)
        throw new Error("Error, intersect on null maps");

    for(let map of maps){
        if(map === undefined || map === null)
            throw new Error("Error, intersect on null maps");

        if(map.getSize() < shortest_map.getSize())
            shortest_map = map;
    }

    // If there is just one map, return a copy of it
    if(maps.length === 1){
        for(let service of shortest_map.keys())
            ret.add(service);
        return ret;
    }

    // Search for each filtered service of shortest map in other filtering maps
    let all_maps_have_service: boolean;
    for(let service of shortest_map.keys()){
        all_maps_have_service = true;
        for(let map of maps){
            if(map === undefined || map === null)
                throw new Error("Error, intersect on null maps");
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
 * Converts an {@link UnorderedSet} to an {@link UnorderedMap} whose keys are the number 1
 * @param set: The set to be converted
 * @returns a map whose keys are the number 1
 */
function setToMap<K extends Settable<K>>(set: UnorderedSet<K>): UnorderedMap<K, number>{
    let ret = new UnorderedMap<K, number>(set.getSize());
    set.forEach((value: K) => {
        ret.set(value, 1);
    });
    return ret;
}

 /**
  * Increases the numeric value associated to a key in an {@link UnorderedMap} object, if not present, it inserts it (with the value 1)
  * @param key: value to update
  * @param map: map
  * @throws {@link error}
  * Thrown if the associated value to the key is null or does not exist in the map
  */
function mapIncreaseOrInsert<K extends Settable<K>>(key: K, map: UnorderedMap<K, number>){
    if(map.has(key)){
        let value: number|null = map.get(key);
        if(value === null || value === undefined)
            throw new Error("Missing or null value in map associated with input key");
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
