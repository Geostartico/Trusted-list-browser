/**
 * Class that groups a selection of objects and keeps track of how many times
 * one object has been selected
 */
//export class Selection{
//    readonly countries: Map<Country,number>;
//    readonly providers: Map<Provider,number>;
//    readonly statuses:  Map<string,number>;
//    readonly types:     Map<string,number>;
//
//    /** Note: pass the value "undefined" to every field that you want to omit */
//    constructor(
//                countries: Country[]  = new Array<Country>(),
//                providers: Provider[] = new Array<Provider>(),
//                statuses:  string[]   = new Array<string>(),
//                types:     string[]   = new Array<string>()
//               )
//    {
//       countries.forEach((country)  => { mapInsert(country, this.countries)  });
//       providers.forEach((provider) => { mapInsert(provider, this.providers) });
//       statuses.forEach((status)    => { mapInsert(status, this.statuses)    });
//       types.forEach((type)         => { mapInsert(type, this.types)         });
//    }
//
//    /** @return copy of this Selection (no deep copy, but maps are reconstructed) */
//    copy(){
//        return new Selection(
//            Array.from(this.countries.keys()),
//            Array.from(this.providers.keys()),
//            Array.from(this.statuses.keys()),
//            Array.from(this.types.keys())
//        );
//    }
//}
/**
 * Class that groups a selection of objects
 */
export class Selection {
    constructor(countries = new Array(), providers = new Array(), statuses = new Array(), types = new Array()) {
        countries.forEach((country) => { this.countries.add(country); });
        providers.forEach((provider) => { this.providers.add(provider); });
        statuses.forEach((status) => { this.statuses.add(status); });
        types.forEach((type) => { this.types.add(type); });
    }
    /** @return copy of this Selection (no deep copy, but maps are reconstructed) */
    copy() {
        return new Selection(Array.from(this.countries.values()), Array.from(this.providers.values()), Array.from(this.statuses.values()), Array.from(this.types.values()));
    }
}
/**
 * Flitering rule class to force function parameter and return types
 */
export class Rule {
    constructor(aRuleFunction) {
        this.rule_function = aRuleFunction;
    }
}
/**
 * Filtering class, (it dynamically updates selectable and active objects)
 */
export class Filter {
    constructor(all_services) {
        this.selectables = new Selection();
        // Initialize variables (no filtering yet)
        all_services.forEach((service) => {
            // Initialize "all_possible"
            //this.all_possible.services.add(service);
            //this.all_possible.countries.add(service.getCountry());
            //this.all_possible.providers.add(service.getProvider());
            //this.all_possible.statuses.add(service.status);
            //service.getServiceTypes().forEach((type) => {
            //    this.all_possible.types.add(type);
            //});
            this.filtered.add(service);
            this.all_services.add(service);
            // Initialize "filtered" and "selectables" (both with all possible values)
            //mapInsert(service.getCountry(), this.selectables.countries);
            //mapInsert(service.getProvider(), this.selectables.providers);
            //mapInsert(service.status, this.selectables.statuses);
            //service.getServiceTypes().forEach((type) => {
            //    mapInsert(type, this.selectables.types);
            //});
        });
    }
    /**
     * Add a rule to the filter
     * @param rule: @see{Rule} object
     */
    addRule(rule) {
        this.rules.add(rule);
    }
    removeRule(rule) {
        this.rules.delete(rule);
    }
    /**
     * @returns @see{Selection} object containing all selectable items
     */
    getSelectables() {
        let selectables = new Selection();
        for (let service of this.getFiltered()) {
            selectables.countries.add(service.getCountry());
            selectables.types.add(service.type);
            selectables.statuses.add(service.status);
            selectables.providers.add(service.getProvider());
        }
        return selectables;
    }
    /**
     * @returns set of filtered services based on the rules
     */
    getFiltered() {
        let filtered = new Set();
        for (let service of this.all_services) {
            this.rules.forEach((rule) => {
                if (rule.rule_function(service)) {
                    filtered.add(service);
                }
            });
        }
        return filtered;
    }
}
/**
 * Helper function to insert value in map
 * @param value: value toinsert
 * @param map:   map containing the value to be inserted
 */
function mapInsert(value, map) {
    if (map.has(value)) {
        map.set(value, map.get(value) + 1);
    }
    else {
        map.set(value, 1);
    }
}
/**
 * Helper function to remove value from map
 * @param value: value to remove
 * @param map:   map containing the value to be removed
 *
 * @throws @link{Error}
 * Thrown if the value is not inserted in the map
 */
function mapRemove(value, map) {
    if (!map.has(value)) {
        throw new Error("Trying to remove an item that does not exist");
    }
    if (map.get(value) > 1) {
        map.set(value, map.get(value) - 1);
    }
    else {
        map.delete(value);
    }
}
