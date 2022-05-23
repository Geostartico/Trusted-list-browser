import { strict as assert } from 'node:assert';
import {Filter, Rule, Selection} from "../filter";
import {Data} from "../data";
import {objectify} from "../../decoder/decoder";

describe('Filter test', function() {

    let myFilter;
    let all_providers = (objectify(Data.countryDict, Data.serviceDict)["servicesArray"]);

    let all_service_number = 0;
    for(let provider of Data.serviceDict){
        //console.log(provider["services"]);
        for(let service of provider["services"])
            all_service_number += 1;
    }

    describe('Filter testing', function() {
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
                assert.equal(myFilter.getFiltered().services.getSize(), all_service_number);
            });
        });
        describe('Adding rules', function() {
            it('should return the filtered services by status (comparing number of entries)', function(){
                myFilter = new Filter(all_providers);

                let my_status = all_providers[3].status;
                myFilter.addRule(new Rule(my_status));
                let sum = 0;
                for(let provider of all_providers){
                    if(provider.status == my_status){
                        sum += 1;
                    }
                }
                assert.equal(myFilter.getFiltered().services.getSize(), sum);
            });
            it('should return the filtered services by country (comparing number of entries)', function(){
                myFilter = new Filter(all_providers);

                let my_country = all_providers[3].getCountry();
                myFilter.addRule(new Rule(my_country));
                let sum = 0;
                all_providers[0].getCountry().getProviders().forEach((provider) => {
                    sum += provider.getServices().getSize();
                    //console.log(provider.getServices());
                });
                assert.equal(myFilter.getFiltered().services.getSize(), sum);
            });
            it('should return the filtered services by type (comparing number of entries)', function(){
                myFilter = new Filter(all_providers);

                let my_type = all_providers[3].getServiceTypes()[0];
                myFilter.addRule(new Rule(my_type));
                let sum = 0;
                for(let provider of all_providers){
                    for(let service of provider.getChildren().values()){
                        service.getChildren().forEach(() => {});
                        if(service.getChildren().includes(my_type)){
                            sum += 1;
                        }
                    }
                }
                assert.equal(myFilter.getFiltered().services.getSize(), sum);
            });
        });
    });
});
