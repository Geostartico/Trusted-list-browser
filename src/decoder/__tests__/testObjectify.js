import { strict as assert } from 'node:assert';
import {Country, Service, Type, Provider, Status} from "../items"
import { objectify } from '../decoder';
import {Data} from "../../filter/data"
import { UnorderedSet } from '../UnorderedSet';
const util = require('util')


describe("decoder test with objectify function", () => {
    let all = undefined
    beforeAll(() => {
        expect(() => all = objectify(Data.countryDict, Data.serviceDict)).not.toThrow();
    })
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
            //console.log(elem.getCountry().countryCode)
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
                let curProv;
                Data.serviceDict.forEach((prov) => {
                    if(elem.name === prov.name && elem.tspId === prov.tspId){
                        curProv = prov;
                }})
                assert.equal(curProv.services.length, elem.getServices().getSize());
            });
        })
        assert.equal(sum, 3500)
    })
    it("should create providers and service with the correct country", () => {
        all.codeToObject.forEach((count, str) =>{
            count.getProviders().forEach((prov) => {
                assert.equal(prov.getCountry().isEqual(count), true);
                prov.getServices().forEach((ser) => {
                    assert.equal(ser.getCountry().isEqual(count), true);
                });
            });
        });
    });
    it("should create services with the right provider", () =>{
        all.codeToObject.forEach((count, str) =>{
            count.getProviders().forEach((prov) => {
                prov.getServices().forEach((ser) => {
                    assert.equal(ser.getProvider().isEqual(prov), true);
                });
            });
        });
    });
    it("should create services were Types and services contain each other", () =>{
        all.servicesArray.forEach((ser) => {
            all.typeSet.forEach((type) => {
                if(ser.getServiceTypes().has(type)){
                    assert.equal(type.getServices().has(ser), true);
                }
            })
        })
    });
    it("should create services were status and services contain each other", () =>{
        all.servicesArray.forEach((ser) => {
            all.statusSet.forEach((status) => {
                if(ser.getServiceTypes().has(status)){
                    assert.equal(status.getServices().has(ser), true);
                }
            })
        })
    });
    it("should throw an error if the input is null or undefined", () => {
        expect(() => objectify(null, null)).toThrow();
        expect(() => objectify(undefined, undefined)).toThrow();
    })
});