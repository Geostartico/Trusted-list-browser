import { strict as assert } from 'node:assert';
const util = require('util')

import {Filter, Rule} from "../filter";
import {Data} from "../data";
import {objectify} from "../../decoder/decoder";


let myFilter;
let all_services = (objectify(Data.countryDict, Data.serviceDict)["servicesArray"]);
let all_services_length = all_services.length;

describe('Filter module tests', function() {

    describe('Filter class tests', function() {

        describe('Filter construction', function() {

            it('should construct the Filter object', function(){
                myFilter = new Filter([]);
                myFilter = new Filter(all_services);
            });

            it('should have nothing selected', function(){
                for(let map of [myFilter.selected.providers, myFilter.selected.statuses, myFilter.selected.countries, myFilter.selected.types]){
                    assert.equal(map.getSize(), 0);
                }
            });

            it('should return all services when I apply no filter (comparing the number of entries)', function(){
                assert.equal(myFilter.getFiltered().services.getSize(), all_services_length);
            });
        });

        describe('Adding and removing rules', function() {
            myFilter = new Filter(all_services);
            var added_rules = [];

            it('should add rule with no error', function(){
                added_rules.push(new Rule(all_services[getRandomServiceIndex()].status));
                expect(() => myFilter.addRule(added_rules[0])).not.toThrow();

                added_rules.push(new Rule(all_services[getRandomServiceIndex()].getCountry()));
                expect(() => myFilter.addRule(added_rules[1])).not.toThrow();

                added_rules.push(new Rule(all_services[getRandomServiceIndex()].getProvider()));
                expect(() => myFilter.addRule(added_rules[2])).not.toThrow();

                added_rules.push(new Rule(all_services[getRandomServiceIndex()].getServiceTypes().values()[0]));
                expect(() => myFilter.addRule(added_rules[3])).not.toThrow();
            });

            it('should throw an error when inserting a null or undefined key', function(){
                expect(() => myFilter.addRule(new Rule(null))).toThrow();
                expect(() => myFilter.addRule(new Rule(undefined))).toThrow();
            });

            it('should remove the rule with no error', function(){
                added_rules.push(new Rule(all_services[getRandomServiceIndex()].status));
                expect(() => myFilter.removeRule(added_rules[0])).not.toThrow();

                added_rules.push(new Rule(all_services[getRandomServiceIndex()].getCountry()));
                expect(() => myFilter.removeRule(added_rules[1])).not.toThrow();

                added_rules.push(new Rule(all_services[getRandomServiceIndex()].getProvider()));
                expect(() => myFilter.removeRule(added_rules[2])).not.toThrow();

                added_rules.push(new Rule(all_services[getRandomServiceIndex()].getServiceTypes().values()[0]));
                expect(() => myFilter.removeRule(added_rules[3])).not.toThrow();
            });

            it('should throw an error when removing an unexistent rule', function(){
                expect(() => myFilter.removeRule(new Rule(null))).toThrow();
                expect(() => myFilter.removeRule(new Rule(undefined))).toThrow();

                added_rules.push(new Rule(all_services[getRandomServiceIndex()].status));
                expect(() => myFilter.removeRule(added_rules[0])).toThrow();

                added_rules.push(new Rule(all_services[getRandomServiceIndex()].getCountry()));
                expect(() => myFilter.removeRule(added_rules[1])).toThrow();

                added_rules.push(new Rule(all_services[getRandomServiceIndex()].getProvider()));
                expect(() => myFilter.removeRule(added_rules[2])).toThrow();

                added_rules.push(new Rule(all_services[getRandomServiceIndex()].getServiceTypes().values()[0]));
                expect(() => myFilter.removeRule(added_rules[3])).toThrow();
            });
        });

        describe('Checking filtered services', function() {
            it('should follow the filtering rules', function() {
                for(let i=0; i<10; i+=1)
                    expect(() => testFilteredServices(all_services, genRandomItems())).not.toThrow();
            });
        });
    });
});

///////////// Helper functions ///////////////

function getRandomServiceIndex(){
    return Math.floor(Math.random() * all_services_length);
}

/**
 * Function to test fitered services, it does the filtering and checks the filtered services
 */
function testFilteredServices(all_services, items){
    let my_filter = new Filter(all_services);
    let rules = [];
    let how_many_items = items[1];

    for(let item of items[0]){
        let rule = new Rule(item);
        my_filter.addRule(rule);
        rules.push(rule);
    }

    let filtered = my_filter.getFiltered();

    all_services.forEach((service) => {
        let rules_matched = [true, true, true, true];
        for(let rule of rules){
            service.getServiceTypes().forEach((type) => {
                if(rule.filtering_item === type){
                    rules_matched[0] = true;
                }
            });
            if(rule.filtering_item === service.status)
                rules_matched[1] = true;
            else if(rule.filtering_item === service.getProvider())
                rules_matched[2] = true;
            else if(rule.filtering_item === service.getCountry())
                rules_matched[3] = true;
        }
        let number_matched = 0;
        for(let bool of rules_matched)
            number_matched += bool;

        if(filtered.services.has(service)){
            expect(number_matched).toBe(how_many_items);
        }
        else{
            expect(rules_matched).not.toBe(rules.length);
        }
    });
}

/**
 * Generates random rules and returns the number of types of elements (e.g. there could be only Providers rules so the sum would be 1)
 */
function genRandomItems(){
    let rules = [];
    let types_present = [false, false, false, false];
    for(let i=0; i<Math.random()*10; i++){
        rules.push(all_services[getRandomServiceIndex()].status);
        types_present[0] = true;
    }
    for(let i=0; i<Math.random()*10; i++){
        rules.push(all_services[getRandomServiceIndex()].getCountry());
        types_present[1] = true;
    }
    for(let i=0; i<Math.random()*10; i++){
        rules.push(all_services[getRandomServiceIndex()].getProvider());
        types_present[2] = true;
    }
    for(let i=0; i<Math.random()*10; i++){
        all_services[Math.floor(Math.random()*all_services_length)].getServiceTypes().forEach((type) => {
            if(Math.random() < 0.5)
                rules.push(type);
        });
        types_present[3] = true;
    }
    let sum = 0;
    for(let bool of types_present)
        sum += bool;
    return [rules, sum];
}
