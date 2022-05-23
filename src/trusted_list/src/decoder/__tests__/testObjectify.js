import { strict as assert } from 'node:assert';
import {Country, Service, Type, Provider, Status} from "../items"
import { objectify } from '../decoder';
import {Data} from "../../filter/data"
import { UnorderedSet } from '../UnorderedSet';
describe("decoder test with objectify function", () => {
    let f = new Set();
    /*Data.serviceDict.forEach((elem) => {
        if(f.has(elem.name)){
            console.log(elem.name);
        }
        f.add(elem.name);
    })*/
    let all = objectify(Data.countryDict, Data.serviceDict);
    it("should have created the right amount of services", () =>{
        assert.equal(all.servicesArray.length, 3500);
    });
    it("should have the right amount of Providers", () => {
        let s = new UnorderedSet(10);
        all.servicesArray.forEach((elem) =>{
           // let olds = s.getSize();
            s.add(elem.getProvider());
            /*if(olds === s.getSize() && ){
                console.log(elem.getProvider().name);
            }*/
        })
        assert.equal(s.getSize(), Data.serviceDict.length);
        //console.log(s.getSize(), Data.serviceDict.length)
    })
    it("should create services without null a null country", () => {
        all.servicesArray.forEach((elem) => {
            console.log(elem.getCountry().countryCode)
            assert.equal(elem.getCountry() !== null, true);
        });
    });
    it("should create the right number of countries", () => {
        assert.equal(all.codeToObject.size, Data.countryDict.length)
    });
    it("should create countries with the right amount of providers", () => {
        let sum = 0;
        all.codeToObject.forEach((value, key) => {
            sum += value.getProviders().getSize();
        })
        assert.equal(sum, Data.serviceDict.length)
    })
    it("should create providers with the right amount of services", () => {
        let sum = 0;
        all.codeToObject.forEach((value, key) => {
            value.getProviders().forEach((elem) => {
                sum += elem.getServices().getSize();
            });
        })
        assert.equal(sum, 3500)
    })
});