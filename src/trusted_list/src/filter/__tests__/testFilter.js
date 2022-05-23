import { strict as assert } from 'node:assert';
import {Filter, Rule, Selection} from "../filter";
import {Data} from "../data";
import {objectify} from "../../decoder/decoder";

describe('Filter test', function() {

    let myFilter;
    let all_providers = (objectify(Data.countryDict, Data.serviceDict)["servicesArray"]);

    //console.log(all_providers);
    //console.log(Data.serviceDict);

    let all_service_number = 0;
    for(let provider of Data.serviceDict){
        //console.log(provider["services"]);
        for(let service of provider["services"])
            all_service_number += 1;
    }

    describe('Filter construction', function() {
        it('should construct the Filter object', function(){
            myFilter = new Filter([]);
            myFilter = new Filter(all_providers);
        });
        it('sould have nothing selected', function(){
            for(let map of [myFilter.selected.providers, myFilter.selected.statuses, myFilter.selected.countries, myFilter.selected.types]){
                assert.equal(map.getSize(), 0);
            }
        });
        it('should return all services when I filter (comparing the number of entries)', function(){
            //console.log(all_service_number);
            assert.equal(myFilter.getFiltered().services.getSize(), all_service_number);
        });
        it('should fuck your uncle in the ass', function(){
            myFilter.addRule(new Rule(all_providers[0].getCountry()));
        });
    });

    for(let service of Data.serviceDict){
        let all_good = true;
        for(let service2 of all_providers){
            if(service.name == service2.name){
                all_good = false;
                break;
            }
        }
        if(!all_good){
            //console.log(service.name);
        }
    }

});
